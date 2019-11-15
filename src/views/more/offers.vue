<style scoped>
  .app {
    position: relative;
    width: 100%;
    max-width: 750px;
    min-width: 320px;
    margin: 0 auto;
    padding-top: 4.25rem;
    padding-bottom: 2.5rem;
    border-left: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
  }

  .top {
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100%;
    max-width: 750px;
    height: 2rem;
    line-height: 2rem;
    padding-left: 5px;
    background-color: white;
    border-bottom: 1px solid #ccc;
    box-shadow: 1px 1px 1px #ddd;
  }

  .enter {
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    background: #f00;
    border-radius: 5px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    margin: 10px;
  }


  .market {
    position: fixed;
    top: 2rem;
    z-index: 1;
    height: 2.25rem;
    line-height: 2.25rem;
    background-color: white;
    width: 100%;
    max-width: 750px;

  }

  .market span {
    display: block;
    float: left;
    width: 20%;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }

  .claecla {
    height: calc(100% - 4.25rem);
  }

  .code {
    height: 2rem;
    max-height: 2rem;
    overflow: hidden;
    line-height: 2rem;
    width: 100%;
    border-bottom: 1px solid #eee;
  }

  .code span {
    color: #515a6e;
    display: block;
    float: left;
    width: 20%;
    text-align: center;

    border-bottom: 1px solid #eee;
  }

  .red {
    color: #e75563 !important;
  }

  .green {
    color: #16d397 !important;
  }

  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vertical-center-modal .ivu-modal {
    top: 0;
  }

  .modal-row {
    padding-bottom: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    height: 3rem;
    line-height: 1rem;
  }

  .modal-row .sele-p {
    padding: 0 10px;
  }

  .modal-buy {
    padding: 5px;
    text-align: center;
    color: white;
    background-color: rgb(217, 84, 79);
    border-radius: 5px
  }

  .modal-sale {
    padding: 5px;
    text-align: center;
    color: white;
    background-color: rgb(91, 184, 93);
    border-radius: 5px
  }

  .el-date-editor {
    max-width: 120px;
  }
  .el-date-editor .el-input__inner {
    padding-right:0;
  }

</style>
<template>
  <div class="app">
    <HeadBack title="远期报价"></HeadBack>
    <Row class="market">
      <span>交易所</span>
      <span>品种</span>
      <span>代码</span>
      <span>标的价格</span>
      <span>远期价格</span>
    </Row>
    <Row class="claecla">
      <Row class="code" v-for="item in newArr" v-bind:key="item.code">
        <span>{{ item.market }}</span>
        <span>{{ item.name }}</span>
        <span>{{ item.code }}</span>
        <span :class="{ red: item.call , green: item.put }">{{ item.price }}</span>
        <span :class="{ red: item.call , green: item.put }" @click="order(item)">{{ item.price }}</span>
      </Row>
    </Row>

    <!-- 下单弹框 -->
    <Modal :title="Title" v-model="drawerModal" :footer-hide="true" class-name="vertical-center-modal">
      <Row>
        <Col span="12" class="modal-row">
        <p>挂扣标的</p>
        <p> {{ entrust.underlying }} </p>
        </Col>
        <Col span="12" class="modal-row">
        <p>交易所</p>
        <p>{{ entrust.exchange }}</p>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>子账业务</p>
        <!-- <p>{{ entrust.subAccountNo }}</p> -->
        <p>{{ changeSub(sub) }}</p>
        </Col>
        <Col span="12" class="modal-row">
        <p>场内开平方向</p>
        <p class="sele-p">
          <el-select v-model="entrust.offsetFlag" size="mini" disabled>
            <el-option v-for="item in offsetFlagOptions" :value="item.value" :key="item.value" :label="item.label">
            </el-option>
          </el-select>
        </p>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>投机套保标识</p>
        <el-select v-model="entrust.hedgeFlag" size="mini">
          <el-option v-for="item in hedgeFlagOptions" :value="item.value" :key="item.value" :label="item.label">
          </el-option>
        </el-select>
        </Col>
        <Col span="12" class="modal-row">
        <p>到期日期</p>
        <el-date-picker v-model="entrust.expiringDate" type="date" placeholder="选择到期日期" size="mini" @change="detection"
          :picker-options="pickerOptions">
        </el-date-picker>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>委托价</p>
        <p class="sele-p">
          <InputNumber v-model="entrust.orderPrice"></InputNumber>
        </p>
        </Col>
        <Col span="12" class="modal-row">
        <p>委托数量(手)</p>
        <InputNumber v-model="entrust.orderVolume" :min="0" :max="maxOrderVolume"> </InputNumber>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
        <div class="enter" @click="buy"> 买入 </div>
        </Col>
        <Col :span="12">
        <div class="enter" @click="sell"> 卖出 </div>
        </Col>
      </Row>
      </Row>
    </Modal>

    <BottonTab></BottonTab>

  </div>
</template>
<script>
  import BottonTab from '@/components/BottonTab'
  import global_ from '@/components/Global'
  import bus from '@/assets/eventBus'
  import axios from '@/axios'
  import HeadBack from '@/components/HeadBack.vue'
  import Jq from 'jquery'
  export default {
    data() {
      return {
        sub:'',
        userID: '',
        bdID: '',
        subNos: [],
        websock: new WebSocket(global_.optionsQuoteServer),
        newData: [],
        CacheData: [],
        marketCode: [],
        drawerBtn: false,
        restDay: [],
        expiryDate: '',
        minDays: '',
        nowDate: '',
        options3: {
          disabledDate: date => {
            return date.getDay() === 0 || date.getDay() === 6 || this.changeDate(date) < this.minDays || this.$store
              .state.restDayStore.indexOf(Number(this.changeDate(date))) !== -1
          }
        },
        bid_deduction: '',
        ask_deduction: '',
        CodeList: [],
        FlatVolatility: {
          'vol': false,
          'pri': false
        },
        sucOrEee: false,
        Title: '远期下单',
        drawerModal: false,
        strikePrice: 0,
        modalPrompt: false,
        detailedData: {
          code: '',
          market: '',
          interestRate: '',
          thePrice: 0,
          strikePrice: 0,
          volume: 0,
          buyPrice: 0,
          salePrice: 0,
          buyVol: '',
          saleVol: '',
          buyPercent: '',
          salePercent: '',
          tradeMinVolume: 0,
          tradeMaxVolume: 0,
          marginRate: '',
          tradingMargin: '',
          delta: '',
          royalties: '',
          margin: ''
        },

        datas: [],
        len: '',
        newArr: [],
        times:'', //定时器
        str:[],
        copyArr:[],
        ForwardConfigs: [],
        // subNos: [],
        

        // 下委托单数据
        entrust: {
          clientId: '',
          clientBindId: '',
          // tradePassword: '',
          // openClose: '',
          buySell: '',
          exchange: '',
          underlying: '',
          subAccountNo: '',
          startingDate: '',
          expiringDate: '',
          orderDate: '',
          orderPrice: 0,
          orderVolume: 0,
          offsetFlag:'',
          hedgeFlag: '',
          days: '',
          yearTradeDays: '',

        },
        offsetFlagOptions: [{
            value: 0,
            label: "开仓"
          },
          {
            value: 1,
            label: "平仓"
          },
          {
            value: 3,
            label: "平今"
          }
        ],
        hedgeFlagOptions: [{
            value: 1,
            label: "投机"
          },
          {
            value: 2,
            label: "套利"
          },
          {
            value: 3,
            label: "套保"
          },
          {
            value: 4,
            label: "备兑"
          }
        ],
        marginTypeOptions: [ //保证金类型+
          {
            value: 0,
            label: "普通保证金类型"
          },
          {
            value: 1,
            label: "特别保证金类型"
          },
          {
            value: 2,
            label: "上海筑欣类型"
          },
          {
            value: 3,
            label: "大商所优化保证金"
          },
          {
            value: 4,
            label: "Delta保证金"
          },
          {
            value: 5,
            label: "权益类期权保证金"
          },
        ],
        maxDate: '',  //用于判断选择结束日期是否大于最晚日期
        maxOrderVolume: 0,   //用于判断下单量是否大于最大下单量
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() 
          },
        },
        orderFlag: true,
        dialogVisible: false,

        payData: {},    //用于存储下单数据，防止token过期后下单输入密码后自动下单
      }
    },
    components: {
      BottonTab,
      HeadBack
    },
    created () {
      // this.getSubNos().then(subNos => {this.subNos = subNos})
      bus.$on("order", this.order)
      bus.$on('retryPay', this.retryPay)
    },
    mounted: function () {
      let that = this
      that.$Loading.start()
      //  保持websocket心跳
      let heartCheck = {
        timeout: 50000,
        timeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj)
          this.start()
        },
        start: function () {
          this.timeoutObj = setInterval(function () {
            that.websock.send('HeartBeat')
          }, this.timeout)
        }
      }
      //  let ws = new WebSocket(global_.optionsQuoteServer)
      that.websock.onopen = function (evt) {
        heartCheck.start()
        that.websock.send('{"f":260,"r":"H1nzpDxnQvGLmui1Ts7EUA==","b":{}}')
        that.websock.send(
          '{"f":257,"r":"eT/uZ6FjTjSRHvIO7EexqA==","b":{"market":["SHFE","DCE","CZCE","INE","SSE","SZSE","CFFEX","SGE"]}}'
        )
        that.websock.send(
          '{"f":261,"r":"DpoF4ECPkRzCtzPxfataqg==","b":{"market":["SHFE","DCE","CZCE","INE","SSE","SZSE","CFFEX","SGE"]}}'
        )
      }
      that.websock.onmessage = function (evt) {
        let BasicMarketData = JSON.parse(evt.data)
        switch (BasicMarketData.r) {
          case 'H1nzpDxnQvGLmui1Ts7EUA==':
            if (BasicMarketData.b.ret == 0) {
              that.restDay = BasicMarketData.b.rest_day
              that.$store.dispatch('changeRestDate', that.restDay)
            } else {
              that.rest_day = []
            }
            break
          case 'eT/uZ6FjTjSRHvIO7EexqA==':
            let codeList = BasicMarketData.b.code_list
            that.$store.dispatch('changeCodeList', codeList)
            let minDaysArr = []
            let arr = []
            for (let i = 0; i < codeList.length; i++) {
              let obj = {}
              obj['market'] = codeList[i].market
              obj['code'] = codeList[i].code
              arr.push(obj)
              let newObj = {}
              newObj['market'] = codeList[i].market
              newObj['code'] = codeList[i].code
              newObj['name'] = ''
              newObj['price'] = ''
              newObj['buy'] = ''
              newObj['sale'] = ''
              newObj['strike_price_change'] = codeList[i].strike_price_change
              newObj['ask_volatility'] = ''
              newObj['bid_volatility'] = ''
              newObj['interest_rate'] = codeList[i].interest_rate
              // 加入最远到期日
              newObj['deadline'] = codeList[i].deadline
              if (Math.floor(Math.random() * 2) === 0) {
                newObj['call'] = true
                newObj['put'] = false
              } else {
                newObj['call'] = false
                newObj['put'] = true
              }
              minDaysArr.push(codeList[i].min_days)
              that.newData.push(newObj)
            }
            that.len = that.newData.length
            that.marketCode = arr
            let mindays = Math.min.apply(Math, minDaysArr)
            let DayArr = that.ThirdDate(that.restDay, 30)
            that.expiryDate = DayArr[0]
            that.nowDate = DayArr[2]
            let DayArrMin = that.ThirdDate(that.restDay, mindays)
            that.minDays = DayArrMin[0]
            let locaOpArr = JSON.parse(localStorage.getItem('optionalCode')) || []
            for (var i = 0; i < locaOpArr.length; i++) {
              if (locaOpArr[i].opExpiryDate < that.expiryDate) {
                locaOpArr.splice(i, 1)
                i--
              } else {}
            }
            localStorage.setItem('optionalCode', JSON.stringify(locaOpArr))
            that.$store.dispatch('changeOptional', locaOpArr)
            let optionsQuoteSesseionJichu = new that.OptionsQuoteSessionCodeList(optionsQuoteServerMarket)
            optionsQuoteSesseionJichu.reconnect()
            optionsQuoteSesseion = new that.OptionsQuoteSession(optionsQuoteServer)
            optionsQuoteSesseion.reconnect()
            break
          case '':
            that.getNewPriceFun()
            break
          default:
            break
        }
      }
      setTimeout(function () {
        if (that.sucOrEee) {} else {
          that.$Loading.finish()
          alert('数据获取失败!')
        }
      }, 10000)
      //  每过3秒刷新一次最新报价
      that.times = setInterval(function () {
        if (that.FlatVolatility.vol && that.FlatVolatility.pri) {
          that.FlatVolatility.vol = false
          that.$Loading.finish()
          return false
        }
        that.dataFilter()
        that.getNewPriceFun()
      }, 3000)
      let optionsQuoteServerMarket = global_.optionsQuoteServerMarket
      let optionsQuoteServer = global_.optionsQuoteServer
      let optionsQuote = {
        'kOutQueryCodeInfoReq': 257,
        'kOutQueryCodeInfoResp': 33025,
        'kOutQueryVolatilityReq': 265,
        'kOutQueryVolatilityResp': 33033,
        'kOutQueryFestivalReq': 259,
        'kOutQueryFestivalResp': 33027,
        'kOutQueryTradingDayReq': 260,
        'kOutQueryTradingDayResp': 33028,
        'kOutQueryMarketCodeReq': 513,
        'kOutQueryMarketCodeResp': 33281,
        'kOutQueryHangQingReq': 514,
        'kOutQueryHangQingResp': 33282,
        'kOutQueryDingYueReq': 515,
        'kOutQueryDingYueResp': 33283
      }
      let optionsQuoteSesseion = null
      that.OptionsQuoteSession = function (url) {
        let _this = this
        this.out_going_queue = []
        this.connection = null
        this.is_open = function () {
          return this.connection.readyState === WebSocket.OPEN
        }
        this.send = function (parcel) {
          let data = JSON.stringify(parcel)
          if (this.is_open()) {
            this.connection.send(data)
            return true
          } else {
            return false
          }
        }
        this.flush = function () {}

        function onOpen(evt) {
          _this.queryVolatilityInfo()
          _this.queryFestivalInfo()
          _this.queryTradingDayInfo()
        }

        function onClose(evt) {
          /* setTimeout(function() {
              _this.reconnect()
          }, 3000) */
        }

        function onError(evt) {
          console.log('Error occured: ' + evt.data)
        }
        this.reconnect = function () {
          this.connection = new WebSocket(url)
          this.connection.onopen = onOpen
          this.connection.onclose = onClose
          this.connection.onmessage = onMessage
          this.connection.onerror = onError
        }
        this.queryVolatilityInfo = function () {
          let arr = []
          for (let i = 0; i < that.newData.length; i++) {
            let obj = {}
            obj['market'] = that.newData[i].market
            obj['code'] = that.newData[i].code
            obj['expiring_date'] = that.changeDate(that.expiryDate)
            obj['strike_price_ratio'] = [1]
            arr.push(obj)
          }
          let codeList = arr
          let queryVolatilityInfoReqPack = makeParcel(optionsQuote.kOutQueryVolatilityReq, {
            'query_list': codeList
          })
          if (!this.send(queryVolatilityInfoReqPack)) {
            return false
          }
        }
        this.queryFestivalInfo = function () {
          let queryFestivalInfoReqPack = makeParcel(optionsQuote.kOutQueryFestivalReq, {})
          if (!this.send(queryFestivalInfoReqPack)) {
            return false
          }
        }
        this.queryTradingDayInfo = function () {
          let queryTradingDayReqPack = makeParcel(optionsQuote.kOutQueryTradingDayReq, {})
          if (!this.send(queryTradingDayReqPack)) {
            return false
          }
        }

        function onMessage(evt) {
          let parcel = JSON.parse(evt.data)
          switch (parcel.f) {
            case optionsQuote.kOutQueryVolatilityResp:
              that.FlatVolatility.vol = true
              that.sucOrEee = true
              for (let j = 0; j < parcel.b.volatility_list.length; j++) {
                if (JSON.parse(evt.data).b.ret === 0) {
                  that.newData[j].ask_volatility = parcel.b.volatility_list[j].ask_volatility[0]
                  that.newData[j].bid_volatility = parcel.b.volatility_list[j].bid_volatility[0]
                } else {
                  that.newData[j].ask_volatility = ''
                  that.newData[j].bid_volatility = ''
                }
              }
              setTimeout(function () {
                that.getNewPriceFun()
              }, 1000)
              break
            case optionsQuote.kOutQueryFestivalResp:
              that.festivalList = parcel.b.festival_list
              that.$store.dispatch('changeFestList', that.festivalList)
              let dce = that.Deduction(that.nowDate, that.expiryDate, that.festivalList)
              that.bid_deduction = dce[0]
              that.ask_deduction = dce[1]
              break
            case optionsQuote.kOutQueryTradingDayResp:
              break
            default:
              console.log('Retrieved resp info: ' + evt.data)
              break
          }
        }
      }
      that.OptionsQuoteSessionCodeList = function (url) {
        let _this = this
        this.out_going_queue = []
        this.connection = null
        this.is_open = function () {
          return this.connection.readyState === WebSocket.OPEN
        }
        this.send = function (parcel) {
          let data = JSON.stringify(parcel)
          if (this.is_open()) {
            this.connection.send(data)
            return true
          } else {
            console.log('connection offline, cannot send parcel: ' + data)
            return false
          }
        }
        this.flush = function () {}

        function onOpen(evt) {
          _this.codeinfo()
          _this.jichushujv()
          _this.dingyue()
        }

        function onClose(evt) {
          setTimeout(function () {
            _this.reconnect()
          }, 3000)
        }

        function onError(evt) {}
        this.reconnect = function () {
          this.connection = new WebSocket(url)
          this.connection.onopen = onOpen
          this.connection.onclose = onClose
          this.connection.onmessage = onMessage
          this.connection.onerror = onError
        }
        this.codeinfo = function () {
          console.log(that.marketCode)
          console.log(that.str)
          let queryCodeInfoReqPack = makeParcel(optionsQuote.kOutQueryMarketCodeReq, {
            'code_list': that.marketCode
            // 'code_list': that.str
            //此处that.marketCode改为that.str就可以进行按需查询，但是按需查询太卡了
          })
          if (!this.send(queryCodeInfoReqPack)) {
            return false
          }
        }
        this.jichushujv = function () {
          let queryCodeInfoReqPack = makeParcel(optionsQuote.kOutQueryHangQingReq, {
            'code_list': that.marketCode
            // 'code_list': that.str
            //此处that.marketCode改为that.str就可以进行按需查询
          })
          if (!this.send(queryCodeInfoReqPack)) {
            return false
          }
        }
        this.dingyue = function () {
          let queryCodeInfoReqPack = makeParcel(optionsQuote.kOutQueryDingYueReq, {
            'code_list': that.marketCode
            // 'code_list': that.str
            //此处that.marketCode改为that.str就可以进行按需查询
          })
          if (!this.send(queryCodeInfoReqPack)) {
            return false
          }
        }

        function onMessage(evt) {
          let parcel = JSON.parse(evt.data)
          // let newArr = []
          // let arr1 = []
          // let arr2 = []
          // if(parcel.f == optionsQuote.kOutQueryHangQingResp) {
          //   let arr = parcel.b.instrument

          //   arr.forEach(item => {
          //     let obj = {}
          //     obj["prices"] = item.last_price
          //     obj["code"] = item.instrument_id
          //     obj["market"] = item.exchange_id
          //     arr1.push(obj)
          //     console.log(item.last_price)
          //   })
          //   // that.newData = newArr
          // }

          // if(parcel.f == optionsQuote.kOutQueryMarketCodeResp) {
          //   let arr = parcel.b.instrument
          //   arr.forEach(item => {
          //     let obj ={}
          //     obj["market"] = item.exchange_id
          //     obj["code"] = item.exchange_inst_id
          //     obj["name"] = item.instrument_name
          //     arr2.push(obj)
          //   })
          // }
          // arr1.forEach(item => {
          //   arr2.forEach(list => {
          //     if(item.market == list.market && item.code == list.code) {
          //       arr1["name"] == arr2.name
          //     }
          //   })
          // })
          // that.newData = arr1

          switch (parcel.f) {
            case optionsQuote.kOutQueryHangQingResp:
              that.CacheData = JSON.parse(evt.data).b.market_data
              that.$store.dispatch('changeCacnhe', that.CacheData)
              that.FlatVolatility.pri = true
              that.sucOrEee = true
              for (let i = 0; i < that.newData.length; i++) {
                that.newData[i].price = Number(parcel.b.market_data[i].last_price.toFixed(2))
              }
              break
            case optionsQuote.kOutQueryDingYueResp:
              let ThisData = JSON.parse(evt.data)
              for (let j = 0; j < that.CacheData.length; j++) {
                if (that.CacheData[j].instrument_id === ThisData.b.market_data[0].instrument_id) {
                  that.CacheData[j].last_price = Number(ThisData.b.market_data[0].last_price.toFixed(2))
                }
              }
              that.$store.dispatch('changeCacnhe', that.CacheData)
              break
            case optionsQuote.kOutQueryMarketCodeResp:
              for (let z = 0; z < that.newData.length; z++) {
                that.newData[z].name = that.zifuchan(parcel.b.instrument[z].instrument_name)
              }
              that.$store.dispatch('changeInstrument', parcel.b.instrument)
              break
            default:
              console.log('Retrieved resp info:' + evt.data)
              break
          }
        }
      }
      that.generate_rid = function () {
        let buffer = new ArrayBuffer(16)
        let intView = new Uint32Array(buffer)
        intView[0] = Math.random() * 1000000000000000
        intView[1] = Math.random() * 1000000000000000
        intView[2] = Math.random() * 1000000000000000
        intView[3] = Math.random() * 1000000000000000
        let binStr = String.fromCharCode.apply(null, new Uint8Array(buffer))
        let base64T = btoa(binStr)
        return base64T
      }

      function Parcel(msgType, body) {
        this.f = msgType
        this.r = that.generate_rid()
        if (body) {
          this.b = body
        } else {
          this.b = {}
        }
      }

      function makeParcel(msgType, body) {
        let p = new Parcel(msgType, body)
        return p
      }

    },
    methods: {
      dataFilter() {
        let all = this.newData
        bus.$emit("socket", all)
        // let arr = this.datas
        // let newArr = []
        // arr.forEach(item => {
        //   all.forEach(list => {
        //     if (list.market == item.exchange && list.code == item.underlying) {
        //       list["subAccountNo"] = item["subAccountNo"]
        //       list["yearTradeDays"] = item["yearTradeDays"]
        //       list["expiringDate"] = item["expiringDate"]
        //       list["maxOrderVolume"] = item["maxOrderVolume"]
        //       newArr.push(list)
        //     }
        //   })
        // })
        // if(!newArr.length) {
        //   newArr = this.copyArr
        // }
        // this.newArr = newArr
      },
      getAll() {
        // this.datas = []
        this.str = []
        // this.copyArr = []
        return new Promise((reslove, reject) => {
          axios.post('client/inner/forwardconfig/queryAll.do').then(result => {
            if (result.data.success) {
              let arr = result.data.ForwardConfigs
              this.ForwardConfigs = arr
              arr.forEach(item => {
                if (item.subAccountNo == this.sub) {
                  this.datas.push(item)
                  this.str.push({   //暂时没用，用于Websocket精确查询某个标的用。
                    market: item.exchange,
                    code: item.underlying,
                  })
                  // this.copyArr.push({
                  //   market: item.exchange,
                  //   code: item.underlying,
                  //   name: '--',
                  //   price: '--',
                  // })
                }
              })
              reslove()
            }
          })
        })
      },

      expiryDateChange: function () {
        // if (this.$store.state.restDayStore.indexOf(Number(this.changeDate(this.expiryDate))) !== -1) {
        //   this.$Message.error('当前日期为节假日')
        //   return false
        // }
        let dce = this.Deduction(this.nowDate, this.expiryDate, this.festivalList)
        this.bid_deduction = dce[0]
        this.ask_deduction = dce[1]
        let arr = []
        for (let i = 0; i < this.newData.length; i++) {
          let obj = {}
          obj['market'] = this.newData[i].market
          obj['code'] = this.newData[i].code
          obj['expiring_date'] = this.changeDate(this.expiryDate)
          obj['strike_price_ratio'] = [1]
          arr.push(obj)
        }
        let websockObj = {}
        websockObj['f'] = 265
        websockObj['r'] = this.generateRid()
        websockObj['b'] = {}
        websockObj.b['query_list'] = arr
        let that = this
        that.websock.send(JSON.stringify(websockObj))
        that.websock.onmessage = function (evt) {
          let parcel = JSON.parse(evt.data)
          for (let j = 0; j < parcel.b.volatility_list.length; j++) {
            if (parcel.b.ret === 0) {
              that.newData[j].ask_volatility = parcel.b.volatility_list[j].ask_volatility[0]
              that.newData[j].bid_volatility = parcel.b.volatility_list[j].bid_volatility[0]
            } else {
              that.newData[j].ask_volatility = ''
              that.newData[j].bid_volatility = ''
            }
          }
          that.getNewPriceFun()
        }
      },
      detailedPrice: function (c, item) {
        let dateNum = this.DateDiff(this.nowDate, this.changeDate(this.expiryDate))
        let dtBuy = ((dateNum - this.bid_deduction) / 365)
        let dtSale = ((dateNum - this.ask_deduction) / 365)
        this.direction = 'C'
        for (var i = 0; i < this.newData.length; i++) {
          if (c === this.newData[i].code) {
            if (this.newData[i].buy === '--') {
              return false
            }
            this.detailedData.code = c
            this.detailedData.market = this.newData[i].market
            this.detailedData.interestRate = this.newData[i].interest_rate
            this.detailedData.salePrice = this.CalcCall(this.newData[i].price, this.newData[i].bid_volatility, this
              .newData[i].interest_rate, this.newData[i].price, dtBuy).toFixed(2)
            this.detailedData.buyPrice = this.CalcCall(this.newData[i].price, this.newData[i].ask_volatility, this
              .newData[i].interest_rate, this.newData[i].price, dtSale).toFixed(2)
            this.detailedData.thePrice = this.newData[i].price
            this.detailedData.strikePrice = this.newData[i].price
            this.detailedData.buyPercent = ((this.detailedData.buyPrice / this.newData[i].price) * 100).toFixed(2) +
              '%'
            this.detailedData.salePercent = ((this.detailedData.salePrice / this.newData[i].price) * 100).toFixed(2) +
              '%'
            this.detailedData.buyVol = this.newData[i].bid_volatility
            this.detailedData.saleVol = this.newData[i].ask_volatility
            this.detailedData.volume = this.$store.state.codeListStore[i].trade_min_volume
            this.detailedData.tradeMinVolume = this.$store.state.codeListStore[i].trade_min_volume
            this.detailedData.tradeMaxVolume = this.$store.state.codeListStore[i].trade_max_volume
            this.detailedData.marginRate = this.add(this.$store.state.instrumentStore[i].margin_rate[1]
              .long_margin_ratio_by_money, 0.01)
            this.Title = this.newData[i].code + 'C' + this.changeDate(this.expiryDate) + 'M' + this.detailedData
              .strikePrice
            this.drawerModal = true
          }
        }

        this.detailedData.tradingMargin = this.mul(this.detailedData.thePrice, this.detailedData.volume)
        this.detailedData.tradingMargin = this.mul(this.detailedData.tradingMargin, this.detailedData.marginRate)
        // this.detailedData.delta = this.CalcCallDelta(this.detailedData.thePrice, this.detailedData.saleVol, 0.06, this.detailedData.strikePrice, dtSale)
        // this.detailedData.delta = this.detailedData.delta.toFixed(4)

        var VirtualValue = Math.max(this.sub(this.detailedData.thePrice, this.detailedData.strikePrice), 0),
          VirtualValue = this.mul(VirtualValue, this.detailedData.volume);

        this.detailedData.royalties = this.mul(this.detailedData.salePrice, this.detailedData.volume)
        // this.detailedData.margin = this.mul(this.detailedData.tradingMargin, Math.max(this.detailedData.delta, 0.2))
        this.detailedData.margin = Math.max(this.sub(this.detailedData.tradingMargin, (this.mul(0.5, VirtualValue))),
          (this.mul(0.5, VirtualValue)));

      },
      priceChange: function () {
        this.Title = this.detailedData.code + this.direction + this.changeDate(this.expiryDate) + 'M' + this
          .detailedData.strikePrice
        if (this.detailedData.strikePrice === '--') {
          return false
        }
        let dateNum = this.DateDiff(this.nowDate, this.changeDate(this.expiryDate))
        let dtBuy = ((dateNum - this.bid_deduction) / 365)
        let dtSale = ((dateNum - this.ask_deduction) / 365)
        this.detailedData.tradingMargin = this.mul(this.detailedData.thePrice, this.detailedData.volume)
        this.detailedData.tradingMargin = this.mul(this.detailedData.tradingMargin, this.detailedData.marginRate)
        let strikePriceRatio = []
        let spr = Number((this.detailedData.strikePrice / this.detailedData.thePrice).toFixed(8))
        strikePriceRatio.push(spr)
        let that = this
        let arr = []
        let obj = {}
        obj['market'] = that.detailedData.market
        obj['code'] = that.detailedData.code
        obj['expiring_date'] = that.changeDate(that.expiryDate)
        obj['strike_price_ratio'] = strikePriceRatio
        arr.push(obj)
        let websockObj = {}
        websockObj['f'] = 265
        websockObj['r'] = that.generateRid()
        websockObj['b'] = {}
        websockObj.b['query_list'] = arr
        that.websock.send(JSON.stringify(websockObj))
        that.websock.onmessage = function (evt) {
          if (JSON.parse(evt.data).b.ret !== 0) {
            return false
          }
          let volatilityList = JSON.parse(evt.data).b.volatility_list
          if (volatilityList[0].ask_volatility[0] === 0) {
            that.detailedData.salePrice = '--'
            that.detailedData.buyPrice = '--'
            that.detailedData.buyPercent = '--%'
            that.detailedData.salePercent = '--%'
            that.detailedData.royalties = '--'
            that.detailedData.margin = '--'
            that.detailedData.buyVol = '--'
            that.detailedData.saleVol = '--'
            return false
          }
          let askVolatility = volatilityList[0].ask_volatility[0]
          let bidVolatility = volatilityList[0].bid_volatility[0]
          if (that.direction === 'C') {
            that.detailedData.salePrice = that.CalcCall(that.detailedData.thePrice, bidVolatility, that.detailedData
              .interestRate, that.detailedData.strikePrice, dtBuy).toFixed(2)
            that.detailedData.buyPrice = that.CalcCall(that.detailedData.thePrice, askVolatility, that.detailedData
              .interestRate, that.detailedData.strikePrice, dtSale).toFixed(2)
            that.detailedData.delta = that.CalcCallDelta(that.detailedData.thePrice, askVolatility, that
              .detailedData.interestRate, that.detailedData.strikePrice, dtSale)
            that.detailedData.delta = that.detailedData.delta.toFixed(4)


            var VirtualValue = Math.max(that.sub(that.detailedData.thePrice, that.detailedData.strikePrice), 0),
              VirtualValue = that.mul(VirtualValue, that.detailedData.volume);
          } else {
            that.detailedData.salePrice = that.CalcPut(that.detailedData.thePrice, bidVolatility, that.detailedData
              .interestRate, that.detailedData.strikePrice, dtBuy).toFixed(2)
            that.detailedData.buyPrice = that.CalcPut(that.detailedData.thePrice, askVolatility, that.detailedData
              .interestRate, that.detailedData.strikePrice, dtSale).toFixed(2)
            that.detailedData.delta = that.CalcPutDalta(that.detailedData.thePrice, askVolatility, that.detailedData
              .interestRate, that.detailedData.strikePrice, dtSale)
            that.detailedData.delta = that.detailedData.delta.toFixed(4)


            var VirtualValue = Math.max(that.sub(that.detailedData.strikePrice, that.detailedData.thePrice), 0),
              VirtualValue = that.mul(VirtualValue, that.detailedData.volume);
          }
          that.detailedData.buyPercent = ((that.detailedData.buyPrice / that.detailedData.thePrice) * 100).toFixed(
            2) + '%'
          that.detailedData.salePercent = ((that.detailedData.salePrice / that.detailedData.thePrice) * 100)
            .toFixed(2) + '%'
          that.detailedData.buyVol = bidVolatility
          that.detailedData.saleVol = askVolatility
          that.detailedData.royalties = that.mul(that.detailedData.salePrice, that.detailedData.volume)

          // that.detailedData.margin = that.mul(that.detailedData.tradingMargin, Math.max(that.detailedData.delta, 0.2)).toFixed(2)
          that.detailedData.margin = Math.max(that.sub(that.detailedData.tradingMargin, (that.mul(0.5,
            VirtualValue))), (that.mul(0.5, VirtualValue)));
        }
      },
      numberChange: function () {
        this.detailedData.tradingMargin = this.mul(this.detailedData.thePrice, this.detailedData.volume)
        this.detailedData.tradingMargin = this.mul(this.detailedData.tradingMargin, this.detailedData.marginRate)
        this.detailedData.royalties = this.mul(this.detailedData.salePrice, this.detailedData.volume)
        // this.detailedData.margin = this.mul(this.detailedData.tradingMargin, Math.max(this.detailedData.delta, 0.2)).toFixed(2)
        var VirtualValue = Math.max(this.sub(this.detailedData.thePrice, this.detailedData.thePrice), 0),
          VirtualValue = this.mul(VirtualValue, this.detailedData.volume);
        this.detailedData.margin = Math.max(this.sub(this.detailedData.tradingMargin, (this.mul(0.5, VirtualValue))),
          (this.mul(0.5, VirtualValue)));
      },
      detailedPriceBuy: function () {
        this.$Modal.info({
          title: '提示',
          content: '交易功能暂未开放'
        })
      },
      prompt: function () {
        this.modalPrompt = true
      },
      //  计算最新价格
      getNewPriceFun: function () {
        let dateNum = this.DateDiff(this.nowDate, this.changeDate(this.expiryDate))
        let dtBuy = ((dateNum - this.bid_deduction) / 365)
        let dtSale = ((dateNum - this.ask_deduction) / 365)
        for (let a = 0; a < this.newData.length; a++) {
          if (this.CacheData.length !== 0) {
            if (this.newData[a].price !== '') {
              if (this.newData[a].price < this.CacheData[a].last_price) {
                this.newData[a].call = true
                this.newData[a].put = false
              } else {
                if (this.newData[a].price > this.CacheData[a].last_price) {
                  this.newData[a].call = false
                  this.newData[a].put = true
                } else {}
              }
            }
            this.newData[a].price = Number(this.CacheData[a].last_price.toFixed(2))
            if (this.newData[a].bid_volatility !== 0 && this.newData[a].price !== 0) {
              this.newData[a].sale = this.CalcCall(this.newData[a].price, this.newData[a].bid_volatility, this
                .newData[a].interest_rate, this.newData[a].price, dtBuy)
              this.newData[a].buy = this.CalcCall(this.newData[a].price, this.newData[a].ask_volatility, this.newData[
                a].interest_rate, this.newData[a].price, dtSale)
              if (this.buyLabel === '买价') {
                this.newData[a].sale = this.newData[a].sale.toFixed(2)
                this.newData[a].buy = this.newData[a].buy.toFixed(2)
              } else if (this.buyLabel === '买价%') {
                this.newData[a].buy = ((this.newData[a].buy / this.newData[a].price) * 100).toFixed(2) + '%'
                this.newData[a].sale = ((this.newData[a].sale / this.newData[a].price) * 100).toFixed(2) + '%'
              } else {
                this.newData[a].buy = (this.newData[a].bid_volatility * 100).toFixed(2) + '%'
                this.newData[a].sale = (this.newData[a].ask_volatility * 100).toFixed(2) + '%'
              }
            } else {
              this.newData[a].buy = '--'
              this.newData[a].sale = '--'
            }
          } else {
            this.newData[a].price = 0
            this.newData[a].buy = '--'
            this.newData[a].sale = '--'
          }
        }
      },
      // 下委托单
      buy(){
        if(!this.entrust.orderVolume) {
          this.$message({
            type:"error",
            message:"请输入委托数量",
            showClose: true,
          })
          return
        }
        if(!this.entrust.expiringDate) {
          this.$message({
            type:"error",
            message:"请选择到期日期",
            showClose: true,
          })
          return
        }
        this.entrust.buySell = "B"
        this.drawerModal = false
        this.weituo()
      },
      sell(){
        if(!this.entrust.orderVolume) {
          this.$message({
            type:"error",
            message:"请输入委托数量",
            showClose: true,
          })
          return
        }
        if(!this.entrust.expiringDate) {
          this.$message({
            type:"error",
            message:"请选择到期日期",
            showClose: true,
          })
          return
        }
        this.entrust.buySell = "S"
        this.drawerModal = false
        this.weituo()
      },
      setEntrustDefault(item) {
        let id = this.userID
        return new Promise((reslove, reject) => {
          this.entrust.exchange = item.market
          this.entrust.underlying = item.code
          this.entrust.clientId = this.bdID
          this.entrust.clientBindId = this.userID
          this.entrust.subAccountNo = this.sub
          this.entrust.orderPrice = item.price
          this.entrust.startingDate = this.getNext() //获取交易日
          this.entrust.expiringDate = ''    //到期日让其自己选择,但最大值不能超过 expiringDate
          this.entrust.orderDate = this.getNext() //获取交易日
          this.entrust.yearTradeDays = item.yearTradeDays
          this.entrust.hedgeFlag = 1
          this.entrust.offsetFlag = 0
          this.maxDate = new Date(Number(item.expiringDate)) //将得到的最远到期日存起来方便校验
        })

      },
      weituo() {
        let token = window.sessionStorage.getItem('token')
        let data = {}
        for (let item in this.entrust) {    //如因交易密码失效导致的下单失败，会将其数据拷贝一份
          this.payData[item] = this.entrust[item]
        }
        for (let item in this.entrust) {
          data[item] = this.entrust[item]
        }
        data["tradeToken"] = token
        let _this = this
        _this.drawerModal = false
        return new Promise((reslove, reject) => {
          Jq.ajax({
            type: "post",
            url: `${global_.baseURL}client/forward/forwardorderlog/doAdd.do`,
            data,
            success(result) {
              // 请求成功后清除其数据
              
              if (result.success) {
                reslove()
                _this.$message({
                  type:"success",
                  message:"下单成功",
                })
                if(result.FORWARD_TRADE_TOKEN) {
                  window.sessionStorage.setItem("token", result.FORWARD_TRADE_TOKEN)
                }
                
              } else {
                _this.$message({
                  type:"error",
                  message: result.errorInfo,
                  showClose: true
                })
                if(result.errorNo == 11056) {
                  let obj = {
                    id: _this.userID,
                    type: 'xiadan'
                  }
                  bus.$emit("checkPass", obj)
                  return
                }
              }
              for(let item in _this.entrust) {
                _this.entrust[item] = 0
              }
            }
          })
        })
      },
      retryPay(){
        this.entrust = this.payData
        this.weituo()
      },
      order(item) {
        // let arr = this.ForwardConfigs
        // let patch = []
        // for(let i=0;i<arr.length;i++) {
        //   if(arr[i].subAccountNo == this.sub  && arr[i].underlying == item.code) {
        //     item['expiringDate'] = arr[i].expiringDate
        //     patch.push(item)
        //   }
        // }
        // if(!patch.length) {
        //   this.$message({
        //     type:"error",
        //     message:"该标的没有远期配置，或你没有该子账的权限",
        //     showClose: true
        //   })
        //   return
        // }
        this.setEntrustDefault(item)
        this.drawerModal = true
        this.maxOrderVolume = item.maxOrderVolume
      },
      // 获取下一个交易日（默认传入当天），
      getNext(time = new Date()) {
        let day = this.timeFormat(time)
        let one = 1000 * 60 * 60 * 24
        let restDay = this.restDay
        let week = time.getDay()
        if (week == 6 || week == 0) {
          let sj = time.getTime() + one
          this.getNext(sj)
          return
        }
        for (let i = 0; i < restDay.length; i++) {
          if (restDay[i] == day) {
            let sj = time.getTime() + one
            this.getNext(sj)
            return
          }
        }
        return time //结果为格林威治时间
      },
      // 检测时间是否大于最远交易日
      detection(val) {
        let max = this.maxDate.getTime()
        let maxDate = this.timeFormat(this.maxDate, '-')
        let active = val.getTime()
        if (active > max) {
          this.orderFlag = false
          this.$message({
            type: "error",
            message: `你所选的时间已超过最远交易日${maxDate}`,
          })
        } else {
          this.orderFlag = true
          let restDay = this.restDay
          let big = Number(this.timeFormat(this.maxDate))
          let small = Number(this.timeFormat(val))
          let arr = []
          restDay.forEach(item => {
            if (Number(item) < big && Number(item) > small) {
              arr.push(item)
            }
          })
          let c = this.getRestDays(active, max)
          let num = (max - active) / 1000 / 60 / 60 /24
          this.entrust.days = num - arr.length - c
        }
      },
      // 计算星期天
      getRestDays(bd,ed) {
        var d1=new Date(bd),d2=new Date(ed);
        var dateSpan=d2-d1;
        var days=parseInt(dateSpan/(24*3600*1000))+1;//计算两个日期间的天数差，加1是为了把起始日期计算在内
        var weeks=parseInt(days/7,10);
        var result=weeks*2;
        if(days%7>0)
        {
            var leftdays=days%7;
            var week1=d1.getDay(); //周日=0，周一=1，依次。。       
            if(week1==0)//如果第一个日期从周日开始，剩余天数不足一周（7天）
            {
              result +=1;
            }
            else if(week1+leftdays>7)//如果第一个日期从周一到周六，加上剩余天数大于7，表示包含周六和周日，所以有两天
            {
              result +=2;
            }
            else if(week1+leftdays==7)//如果刚好到周六，有一天休息日
            {
              result +=1;
            }
        }
        return result;
      },
      handleClose() {
        this.dialogVisible = false
      },
      // 转化子账
      changeSub(val){
        let str = ''
        this.subNos.forEach(item => {
          if(item.subAccountNo == val) {
            str = item.subAccountBusinessName
          }
        })
        return str
      },
    },
    watch: {
      $route: {
        handler(to, from) {
          if(to.path == '/forwardType') {
            this.sub = to.query.sub
            this.userID = to.query.id
            this.bdID = to.query.user
            this.getAll()
          }
        },
        immediate: true
      }
    },
    computed: {

    }
  }

</script>
