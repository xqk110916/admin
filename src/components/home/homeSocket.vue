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
      }
    },
    created() {

    },
    methods: {
      // 查询行情
      Socket (params) {
        let _this = this
        const ws = new WebSocket(g.underlyingMarketDataServe)
        let list = g.changeLists(params)
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
            console.log(JSON.parse(e.data))
            _this.nameData = JSON.parse(e.data).b.instrument
          }
          if (f == 33282) {
            console.log(JSON.parse(e.data))
            _this.priceData = JSON.parse(e.data).b.market_data
          }
          if (f == 33283) {
            let arr = JSON.parse(e.data).b.market_data
            _this.changeSocket(arr)
            return
          }

          let arr = []
          list.forEach(list => {
            list = JSON.parse(list)
            let obj = {
              market: list.market,
              code: list.code,
            }
            _this.nameData.forEach(item => {
              if (item.exchange_id == list.market && item.instrument_id == list.code) {
                // obj['name'] = item.instrument_name
                obj['name'] = item.product_id
              }
            })
            _this.priceData.forEach(item => {
              if (item.exchange_id == list.market && item.instrument_id == list.code) {
                obj['price'] = item.last_price.toFixed(2)
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
          console.log(arr)

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
            item.price = arr[0].last_price.toFixed(2)
            // bus.$emit("pusher", item)
            // console.log(item)
          }
        })
        
      },
    },
    watch: {
      $route: {
        handler(to, frin) {
          console.log(to)
          if(to.path == "/" && to.name == "Home") {

          }
        },
        immediate: true
      },
      list: {
        handler(newValue, oldValue) {
          console.log(newValue)
          if(newValue.length) {
            this.Socket(newValue)
          }
          // this.Socket(newValue)
        },
        immediate: true
      },
    },
    props: {
      list: Array,
    }
  }

</script>

<style>

</style>
