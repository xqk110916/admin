<template>
  <div>

  </div>
</template>

<script>
  import g from '@/components/Global.vue'
  import bus from '@/assets/eventBus'
  import axios from '@/axios'
  export default {
    name: 'socket',
    data() {
      return {
        socketData: [], //用于向未接传递转换后的数据
        nameData: [], //用于提取品种名
        priceData: [], //用于提取价格等信息
        responseData: [], //用于存储推送过来的数据
        configs: [],  //用于存储远期配置数据
        sub: '',  //用于记录过滤所需的子账
        flag: false,  //用于判断是否进入过远期界面
        list: [],
        ws: '',
      }
    },
    created() {
      // this.periodic()
    },
    methods: {
      periodic(){
        setTimeout(() => {
          this.Socket(this.configs)
          this.periodic()
        },3000)
      },
      getforwardConfig() {
        return new Promise((reslove, reject) => {
          axios.post('client/inner/forwardconfig/queryAll.do').then(result => {
            if (result.data.success) {
              let arr = result.data.ForwardConfigs
              let datas = []
              arr.forEach(item => {
                if(item.subAccountNo == this.sub) {
                  datas.push(item)
                }
              })
              this.configs = datas
              reslove(datas)
            }
          })
        })
      },
      // 查询行情
      Socket (params) {
        let _this = this
        const ws = new WebSocket(g.underlyingMarketDataServe)
        this.ws = ws
        let list = g.changeList(params)
        this.list = list
        ws.onopen = function (e) {
          this.send(`{"f":513,"r":"${g.generate_rid()}","b":{"code_list":[${list}]}}`)
          this.send(`{"f":514,"r":"${g.generate_rid()}","b":{"code_list":[${list}]}}`)
          this.send(`{"f":33282,"r":"${g.generate_rid()}","b":{"code_list":[${list}]}}`)
          this.send(`{"f":515,"r":"${g.generate_rid()}","b":{"code_list":[${list}]}}`)
          this.send(`{"f":33283,"r":"${g.generate_rid()}","b":{"code_list":[${list}]}}`)
        }
        ws.onmessage = function (e) {
          let f = JSON.parse(e.data).f
          if (f == 33281) {
            _this.nameData = JSON.parse(e.data).b.instrument
          }
          if (f == 33282) {
            _this.priceData = JSON.parse(e.data).b.market_data
          }
          if (f == 33283) {
            let arr = JSON.parse(e.data).b.market_data
            _this.changeSocket(arr)
            return
          }

          let arr = []
          params.forEach(list => {
            // list = JSON.parse(list)
            let n = list.priceAccuracy
            let obj = {
              market: list.exchange,
              code: list.underlying,
              priceAccuracy: list.priceAccuracy,
            }
            _this.nameData.forEach(item => {
              if (item.exchange_id == list.exchange && item.instrument_id == list.underlying) {
                // obj['name'] = item.instrument_name
                obj['name'] = item.product_id
              }
            })
            _this.priceData.forEach(item => {
              if (item.exchange_id == list.exchange && item.instrument_id == list.underlying) {
                item.ask_price.forEach(ask => {
                  ask = ask.toFixed(n)
                })
                item.bid_price.forEach(bid => {
                  bid = bid.toFixed(n)
                })
                console.log(item.ask_price, item.bid_price)
                obj['price'] = item.last_price.toFixed(n)
                obj['ask_price'] = item.ask_price
                obj['ask_volume'] = item.ask_volume
                obj['bid_price'] = item.bid_price
                obj['bid_volume'] = item.bid_volume
                obj['close_price'] = item.close_price.toFixed(n)
                obj['highest_price'] = item.highest_price.toFixed(n)
                obj['lower_limit_price'] = item.lower_limit_price.toFixed(n)
                obj['lowest_price'] = item.lowest_price.toFixed(n)
                obj['open_price'] = item.open_price.toFixed(n)
                obj['pre_close_price'] = item.pre_close_price.toFixed(n)
                obj['pre_settlement_price'] = item.pre_settlement_price.toFixed(n)
                obj['upper_limit_price'] = item.upper_limit_price.toFixed(n)

                obj['update_millisec'] = item.update_millisec     //行情更新时间
                obj['update_time'] = item.update_time     //行情更新时间

                obj['exchange_id'] = item.exchange_id
                obj['instrument_id'] = item.instrument_id
              }
            })
            if (obj.name && obj.price) {
              arr.push(obj)
            }
          })

          if (!arr.length) {
            return
          }
          _this.socketData = arr
          bus.$emit("sockets", arr)

        }
        ws.onerror = function (e) {

        }
        ws.onclose = function (e) {

        }
      },
      // 订阅推送行情（用于盘冲时)
      changeSocket(arr){
        this.socketData.forEach(item => {
          if(item.market == arr[0].exchange_id && item.code == arr[0].instrument_id){
            let n = item.priceAccuracy    //获取价格精度
            let ask_price = []
            let bid_price = []
            arr[0].ask_price.forEach(ask => {
              ask_price.push(ask.toFixed(n))
            })
            arr[0].bid_price.forEach(bid => {
              bid_price.push(bid.toFixed(n))
            })
            item.price = arr[0].last_price.toFixed(2)
            item['ask_price'] = ask_price
            item['ask_volume'] = arr[0].ask_volume
            item['bid_price'] = bid_price
            item['bid_volume'] = arr[0].bid_volume
            item['close_price'] = arr[0].close_price.toFixed(n)
            item['highest_price'] = arr[0].highest_price.toFixed(n)
            item['lower_limit_price'] = arr[0].lower_limit_price.toFixed(n)
            item['lowest_price'] = arr[0].lowest_price.toFixed(n)
            item['open_price'] = arr[0].open_price.toFixed(n)
            item['pre_close_price'] = arr[0].pre_close_price.toFixed(n)
            item['pre_settlement_price'] = arr[0].pre_settlement_price.toFixed(n)
            item['upper_limit_price'] = arr[0].upper_limit_price.toFixed(n)

            item['update_millisec'] = arr[0].update_millisec     //行情更新时间
            item['update_time'] = arr[0].update_time     //行情更新时间

            bus.$emit("pusher", item)
          }
        })
        
      },
      // 查询交易日
      restDay () {
        let _this = this
        const ws = new WebSocket(g.optionsQuoteServer)
        ws.onopen = function (e) {
          this.send(`{"f":260,"r":"${g.generate_rid()}","b":{}}`)
          this.send(`{"f":33028,"r":"${g.generate_rid()}","b":{}}`)
        }
        ws.onmessage = function (e) {
          let arr = JSON.parse(e.data).b.rest_day
          bus.$emit('restDay', arr)
        }
        ws.onerror = function (e) {
          console.log('error')
          console.log(e)
        }
        ws.onclose = function (e) {
          console.log("close")
          console.log(e)
        }
      },
    },
    watch: {
      $route: {
        handler(to, from) {
          if (to.path == '/forwardType') {
            // this.Socket()
            this.sub = to.query.sub
            this.flag = true
            this.getforwardConfig().then((configs) => {
              this.Socket(configs)
            })
            this.restDay()
          } else {
            if(!this.flag) return

            this.flag = false
            this.ws.onopen = function (e) {
              this.send(`{"f":516,"r":"${g.generate_rid()}","b":{"code_list":[${this.list}]}}`)
            }
            this.ws.onmessage = function (e) {

            }
          }
        },
        immediate: true
      }
    },
  }

</script>

<style>

</style>
