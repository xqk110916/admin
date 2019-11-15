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
</style>
<template>
  <div class="app">
    <Row class="top">
      <Col :xs="13" :sm="7" style="font-size:14px; color: rgb(0, 122, 255);">
      <Icon type="md-menu" size="24" @click="drawerBtn = true" />
      <span @click="drawerBtn = true">{{gsName}}</span>
      </Col>
      <Col :xs="0" :sm="8">
      <Button>
        <!-- <a href="./pdf.html">导出场外报价表</a> -->
        <span @click="$router.push('/pdf')">导出场外报价表</span>
      </Button>
      </Col>
      <Col :xs="11" :sm="9" style="padding-right:5px;text-align:right">
      <span @click="prompt">简易提示</span>
      <DatePicker style="width: 100px" size="small" type="date" format="yyyyMMdd" v-model="expiryDate"
        :options="options3" placeholder="Select date" placement="bottom-end" :clearable="false" :editable="false"
        @on-change="expiryDateChange">
      </DatePicker>
      </Col>
    </Row>
    <Drawer title="南华资本" placement="left" :closable="false" v-model="drawerBtn">
      <Row style="text-align: center">
        <div @click="loginSys">
          <Avatar icon="ios-person" size="large" />
          <p style="margin-top: 5px">{{username}}</p>
        </div>
      </Row>
    </Drawer>
    <Row class="market">
      <span>品种</span>
      <span>代码</span>
      <span>标的价格</span>
      <span @click="priceTypeChange"> {{ buyLabel }} </span>
      <span @click="priceTypeChange"> {{ saleLabel }} </span>
    </Row>
    <Row class="claecla">
      <Row class="code" v-for="(item, index) in newData" :key="index">
        <span>{{ item.name?item.name:"--" }}</span>
        <span @click="goTpage(item.market, item.code, changeDate(expiryDate), item)">{{ item.code }}</span>
        <span :class="{ red: item.call , green: item.put }"
          @click="goTpage(item.market, item.code, expiryDate, item)">{{ item.price }}</span>
        <span :class="{ red: item.call , green: item.put }"
          @click="detailedPrice(item.code)">{{ item.buy.toString() == "NaN"?"--":item.buy }}</span>
        <span :class="{ red: item.call , green: item.put }"
          @click="detailedPrice(item.code)">{{ item.sale.toString() == "NaN"?"--":item.sale }}</span>
      </Row>
    </Row>
    <Modal title="操作提示" v-model="modalPrompt" :footer-hide="true" class-name="vertical-center-modal">
      <p>点击代码和价格一栏进入T型报价</p>
      <p>点击买价和卖价一栏进入详细价格界面</p>
      <p>pc端建议打开F12进入手机浏览模式</p>
    </Modal>
    <Modal :title="Title" v-model="drawerModal" :footer-hide="true" class-name="vertical-center-modal">
      <Row>
        <Col span="12" class="modal-row">
        <p>挂扣标的</p>
        <p> {{ detailedData.code }} </p>
        </Col>
        <Col span="12" class="modal-row">
        <p>到期日期</p>
        <p>{{ changeDate(expiryDate) }}</p>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>期权类型</p>
        <p class="sele-p">
          <Select v-model="direction" @on-change="priceChange(detailedData)">
            <Option v-for="item in optionDirection" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </p>
        </Col>
        <Col span="12" class="modal-row">
        <p>标的价格</p>
        <p class="sele-p">
          <InputNumber v-model="detailedData.thePrice" placeholder="0" @on-change="priceChange(detailedData)">
          </InputNumber>
        </p>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>执行价</p>
        <p class="sele-p">
          <InputNumber v-model="detailedData.strikePrice" placeholder="0" @on-change="priceChange(detailedData)">
          </InputNumber>
        </p>
        </Col>
        <Col span="12" class="modal-row">
        <p>成交数量</p>
        <p class="sele-p">
          <InputNumber v-model="detailedData.volume" :max="detailedData.tradeMaxVolume"
            :min="detailedData.tradeMinVolume" placeholder="0" @on-change="numberChange"></InputNumber>
        </p>
        </Col>
      </Row>
      <Row>
        <Col span="11" class="modal-buy">
          <div @click="detailedPriceBuy">
            <p> {{ detailedData.salePrice }} | {{ detailedData.salePercent }} </p>
            <p> 买入 </p>
            <p> {{ "vol:" + testpercent(detailedData.buyVol) }} </p>
          </div>
        </Col>
        <Col span="11" offset="2" class="modal-sale">
        <div @click="detailedPriceBuy">
          <p> {{ detailedData.buyPrice }} | {{ detailedData.buyPercent }} </p>
          <p> 卖出 </p>
          <p> {{ "vol:" + testpercent(detailedData.saleVol) }} </p>
        </div>
        </Col>
      </Row>
      <Row style="margin-top:5px;text-align:center">
        <Col span="11">
        <Alert>
          <p>{{ "权利金:" + detailedData.royalties }}</p>
        </Alert>
        </Col>
        <Col span="11" offset="2">
        <Alert>
          <p>{{ "保证金:" + detailedData.margin }}</p>
        </Alert>
        </Col>
      </Row>
    </Modal>
    <BottonTab></BottonTab>

    <!-- 风险揭示书 -->
    <el-dialog title="风险揭示书" :visible.sync="dialogVisible" width="80%" :show-close="false"
      :close-on-press-escape="false" :close-on-click-modal="false">
      <el-input type="textarea" :rows="20" v-model="book" disabled>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import BottonTab from '@/components/BottonTab'
  import global_ from '@/components/Global'
  import bus from '@/assets/eventBus'
  import axios from '@/axios'

  export default {
    data() {
      return {
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
        Title: 'test',
        drawerModal: false,
        direction: 'C',
        optionDirection: [{
            value: 'C',
            label: '看涨'
          },
          {
            value: 'P',
            label: '看跌'
          }
        ],
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
        buyLabel: '买价',
        saleLabel: '卖价',
        daochuFlag: true,
        dialogVisible: false,
        book: '',
        nameOptions: [], //获取品种名称

        fluctuationTimer: null,
      }
    },
    components: {
      BottonTab,

    },
    created: function () {
      this.getRestDay().then(() => { //获取节假日
        this.getCodeList() //获取代码表
      })
      this.getFestival() //节假日扣减天数

      let stateus = window.localStorage.getItem("stateus")
      let login = window.sessionStorage.getItem("login")
      if (!stateus && !login) {
        this.read()
      }

      let that = this
      //  tDefinedEvent bus总线从tPage传来打开详细价格界面
      bus.$on('tDefinedEvent', function (msg) {
        that.drawerModal = true
        that.expiryDate = msg.expiryDate
        that.expiryDateChange()
        that.direction = msg.direction
        that.detailedData.thePrice = msg.thePrice
        that.detailedData.strikePrice = msg.strikePrice
        console.log(that.detailedData.strikePrice)
        that.Title = msg.code + 'C' + that.changeDate(that.expiryDate) + 'M' + msg.thePrice
        for (var i = 0; i < that.$store.state.codeListStore.length; i++) {
          if (msg.code === that.$store.state.codeListStore[i].code) {
            if (msg.strikePrice === '--') {
              return false
            }
            that.detailedData.code = msg.code
            that.detailedData.market = that.$store.state.codeListStore[i].market
            that.detailedData.interestRate = that.$store.state.codeListStore[i].interest_rate
            that.detailedData.volume = that.$store.state.codeListStore[i].trade_min_volume
            that.detailedData.tradeMinVolume = that.$store.state.codeListStore[i].trade_min_volume
            that.detailedData.tradeMaxVolume = that.$store.state.codeListStore[i].trade_max_volume
            that.detailedData.marginRate = that.add(that.$store.state.instrumentStore[i].margin_rate[0]
              .long_margin_ratio_by_money, 0.01)
          }
        }
        // that.priceChange()
        that.detailedPrice()

      })
    },
    destroyed() {
      if (this.fluctuationTimer) {
        clearTimeout(this.fluctuationTimer)
      }
    },
    methods: {
      getCodeList() { //替换websocket的代码表请求
        axios.get("client/inner/quoteconfig/queryAll.do").then(result => {
          let list = result.data.quoteConfigs
          let codeList = []
          list.forEach(item => {
            let obj = {
              id: item.id,
              market: item.exchange,
              code: item.instrument,
              deadline: this.timeFormat(new Date(Number(item.deadline))),
              interest_rate: item.interestRate,
              min_days: item.minDays,
              strike_price_change: item.strikePriceChange,
              strike_price_count: item.strikePriceCount,
              trade_max_volume: item.tradeMaxVolume,
              trade_min_volume: item.tradeMinVolume,
              yearSession: item.yearSession,
              buyCpsDays: item.buyCpsDays,
              sellCpsDays: item.sellCpsDays,
              subAccountNo: item.subAccountNo,
              name: item.productName,
            }
            codeList.push(obj)
          })

          this.$store.dispatch('changeCodeList', codeList)
          let minDaysArr = []
          let arr = []
          for (let i = 0; i < codeList.length; i++) {
            let obj = {}
            obj['market'] = codeList[i].market
            obj['code'] = codeList[i].code
            arr.push(obj)
            let newObj = {}
            newObj['id'] = codeList[i].id
            newObj['market'] = codeList[i].market
            newObj['code'] = codeList[i].code
            newObj['name'] = codeList[i].name
            newObj['price'] = ''
            newObj['buy'] = ''
            newObj['sale'] = ''
            newObj['strike_price_change'] = codeList[i].strike_price_change
            newObj['ask_volatility'] = ''
            newObj['bid_volatility'] = ''
            newObj['interest_rate'] = codeList[i].interest_rate
            // 新增年交易日数计算和买卖补偿天数、子账、保证金类型、品种名称、特别保证金率
            newObj["yearSession"] = codeList[i].yearSession ? codeList[i].yearSession : 365 //年交易日数为0时为365天
            newObj["buyCpsDays"] = codeList[i].buyCpsDays ? codeList[i].buyCpsDays : 0 //买卖补偿天数      
            newObj["sellCpsDays"] = codeList[i].sellCpsDays ? codeList[i].sellCpsDays : 0 //买卖补偿天数
            newObj["subAccountNo"] = codeList[i].subAccountNo

            if (Math.floor(Math.random() * 2) === 0) {
              newObj['call'] = true
              newObj['put'] = false
            } else {
              newObj['call'] = false
              newObj['put'] = true
            }
            minDaysArr.push(codeList[i].min_days)
            this.newData.push(newObj)
          }


          let _this = this
          let that = this
          // 声明公共函数

          function OptionsQuoteSessionCodeList(url) {
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
              }, 10000)
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
              let queryCodeInfoReqPack = makeParcel(optionsQuote.kOutQueryMarketCodeReq, {
                'code_list': that.marketCode
              })
              if (!this.send(queryCodeInfoReqPack)) {
                return false
              }
            }
            this.jichushujv = function () {
              let queryCodeInfoReqPack = makeParcel(optionsQuote.kOutQueryHangQingReq, {
                'code_list': that.marketCode
              })
              if (!this.send(queryCodeInfoReqPack)) {
                return false
              }
            }
            this.dingyue = function () {
              let queryCodeInfoReqPack = makeParcel(optionsQuote.kOutQueryDingYueReq, {
                'code_list': that.marketCode
              })
              if (!this.send(queryCodeInfoReqPack)) {
                return false
              }
            }

            function onMessage(evt) {
              let parcel = JSON.parse(evt.data)
              switch (parcel.f) {
                case optionsQuote.kOutQueryHangQingResp: //获取行情相关
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
                    // that.newData[z].name = that.zifuchan(parcel.b.instrument[z].instrument_name)
                    // that.newData[z].name = parcel.b.instrument[z].product_id
                  }
                  that.$store.dispatch('changeInstrument', parcel.b.instrument)
                  break
                default:
                  console.log('Retrieved resp info:' + evt.data)
                  break
              }
            }
          }

          function Parcel(msgType, body) {
            this.f = msgType
            this.r = global_.generate_rid()
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
          this.marketCode = arr
          let mindays = Math.min.apply(Math, minDaysArr)
          let DayArr = this.ThirdDate(this.restDay, 30)
          this.expiryDate = DayArr[0]
          this.nowDate = DayArr[2]
          let DayArrMin = this.ThirdDate(this.restDay, mindays)
          this.minDays = DayArrMin[0]
          let locaOpArr = JSON.parse(localStorage.getItem('optionalCode')) || []
          for (var i = 0; i < locaOpArr.length; i++) {
            if (locaOpArr[i].opExpiryDate < this.expiryDate) {
              locaOpArr.splice(i, 1)
              i--
            } else {}
          }

          this.fluctuation() //获取波动度

          let optionsQuoteServerMarket = global_.optionsQuoteServerMarket
          let optionsQuoteServer = global_.optionsQuoteServer
          localStorage.setItem('optionalCode', JSON.stringify(locaOpArr))
          this.$store.dispatch('changeOptional', locaOpArr)

          let optionsQuoteSesseionJichu = new OptionsQuoteSessionCodeList(optionsQuoteServerMarket)
          optionsQuoteSesseionJichu.reconnect()
          // let optionsQuoteSesseion = new OptionsQuoteSession(optionsQuoteServer)
          // optionsQuoteSesseion.reconnect()


          //  每过3秒刷新一次最新报价
          setInterval(() => {
            if (this.FlatVolatility.vol && this.FlatVolatility.pri) {
              this.FlatVolatility.vol = false
              this.$Loading.finish()
              return false
            }
            this.getNewPriceFun()
          }, 10000)
        })
      },

      getRestDay() { //获取节假日
        return new Promise((reslove, reject) => {
          axios.get("client/inner/festivalconfig/queryFestivalList.do").then(result => {
            let restDays = JSON.parse(result.data.festivalConfig).exchange_rest_day[0].rest_day
            this.restDay = restDays
            this.$store.dispatch('changeRestDate', this.restDay)
            reslove()
          })
        })
      },
      getFestival() { //节假日扣减天数
        return new Promise((reslove, reject) => {
          axios.get("client/inner/festivalconfig/queryAll.do").then(result => {
            if (result.data.success) {
              let data = result.data.festivalConfigs
              let arr = []
              data.forEach(item => {
                let obj = {
                  ask_deduction: item.askDeduction,
                  bid_deduction: item.bidDeduction,
                  business_type: item.businessType,
                  festival_date: this.timeFormat(new Date(item.festivalDate)),
                  id: item.id,
                }
                arr.push(obj)
              })
              this.festivalList = arr
              this.$store.dispatch('changeFestList', this.festivalList)
              let dce = this.Deduction(this.nowDate, this.expiryDate, this.festivalList)
              this.bid_deduction = dce[0]
              this.ask_deduction = dce[1]
            }
          })
        })
      },
      fluctuation() { //获取全部波动度
        return new Promise((reslove, reject) => {
          axios.post("client/inner/quoteconfig/getTradeVolatilityVOList.do", this.qs.stringify({
            expiringDate: this.expiryDate,
          })).then(result => {
            if (result.data.success) {
              let data = result.data.tvs
              this.FlatVolatility.vol = true
              this.sucOrEee = true
              for (let j = 0; j < data.length; j++) {
                if (data.length) {
                  this.newData[j].ask_volatility = data[j].askVolatility
                  this.newData[j].bid_volatility = data[j].bidVolatility
                } else {
                  this.newData[j].ask_volatility = ''
                  this.newData[j].bid_volatility = ''
                }
              }
              reslove()
              this.fluctuationTimer = setTimeout(() => {
                this.fluctuation()
              }, 300000);
              this.getNewPriceFun()
            }
          })
        })
      },
      fluctuationOnlyOne(exchange, underlying, expiringDate, lastPrice, strikePrice, subAccountNo) { //获取单个的买卖波动度
        return new Promise((reslove, reject) => {
          axios.post("client/inner/quoteconfig/getTradeVolatilityVO.do", this.qs.stringify({
            exchange,
            underlying,
            lastPrice,
            strikePrice,
            expiringDate,
            subAccountNo,
          })).then(result => {
            if (result.data.success) {
              reslove(result.data.tradeVolatilityVO)
            } else {
              reslove([])
            }
          })
        })
      },


      getInfo() {
        axios.post('client/queryClientBaseInfo.do').then(result => {
          if (result.data.success) {
            this.$store.commit('changeUserName', result.data.client.username)
          }
        })
      },
      handleStart() {
        this.$Modal.info({
          title: 'Bravo',
          content: 'Now, enjoy the convenience of iView.'
        })
      },
      bottom() {
        console.log(this.$refs.dialog)
      },
      expiryDateChange: function (val) {
        console.log(val)
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
        this.fluctuation()
        // let websockObj = {}
        // websockObj['f'] = 265
        // websockObj['r'] = this.generateRid()
        // websockObj['b'] = {}
        // websockObj.b['query_list'] = arr
        // let that = this
        // that.websock.send(JSON.stringify(websockObj))
        // that.websock.onmessage = function (evt) {
        //   let parcel = JSON.parse(evt.data)
        //   for (let j = 0; j < parcel.b.volatility_list.length; j++) {
        //     if (parcel.b.ret === 0) {
        //       that.newData[j].ask_volatility = parcel.b.volatility_list[j].ask_volatility[0]
        //       that.newData[j].bid_volatility = parcel.b.volatility_list[j].bid_volatility[0]
        //     } else {
        //       that.newData[j].ask_volatility = ''
        //       that.newData[j].bid_volatility = ''
        //     }
        //   }
        //   that.getNewPriceFun()
        // }
      },
      goTpage: function (m, c, e, item) {
        console.log(item)
        let date = this.changeDate(e)
        this.$router.push({
          path: '/TPage',
          name: 'TPageHome',
          params: {
            market: m,
            code: c,
            expiryDate: date,
            nowDate: this.nowDate,
            yearSession: item.yearSession,
            buyCpsDays: item.buyCpsDays,
            sellCpsDays: item.sellCpsDays,
            subAccountNo: item.subAccountNo,
          }
        })
      },
      detailedPrice: function (c) {
        debugger
        console.log(c)
        // let dtBuy = ((dateNum - this.bid_deduction) / 365)
        // let dtSale = ((dateNum - this.ask_deduction) / 365)
        this.direction = 'C'
        for (var i = 0; i < this.newData.length; i++) {
          if (c === this.newData[i].code) {
            if (this.newData[i].buy === '--') {
              return false
            }
            // salePrice
            let dateNum = this.DateDiff(this.nowDate, this.changeDate(this.expiryDate), this.newData[i].buyCpsDays,
              this.newData[i].sellCpsDays)
            let dtBuy = ((dateNum[0] - this.bid_deduction) / this.newData[i].yearSession)
            let dtSale = ((dateNum[1] - this.ask_deduction) / this.newData[i].yearSession)
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
            this.detailedData.marginRate = this.add(this.$store.state.instrumentStore[i].margin_rate[0]
              .long_margin_ratio_by_money, 0.01)
            // 新增年交易日数和买卖补偿天数
            this.detailedData.yearSession = this.newData[i].yearSession
            this.detailedData.buyCpsDays = this.newData[i].buyCpsDays
            this.detailedData.sellCpsDays = this.newData[i].sellCpsDays
            this.detailedData.subAccountNo = this.newData[i].subAccountNo
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
      priceChange(data) {
        console.log(data)
        this.Title = this.detailedData.code + this.direction + this.changeDate(this.expiryDate) + 'M' + this
          .detailedData.strikePrice
        if (this.detailedData.strikePrice === '--') {
          return false
        }
        let dateNum = this.DateDiff(this.nowDate, this.changeDate(this.expiryDate), data.buyCpsDays, data.sellCpsDays)
        let dtBuy = ((dateNum[0] - this.bid_deduction) / data.yearSession)
        let dtSale = ((dateNum[1] - this.ask_deduction) / data.yearSession)
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

        // that.websock.send(JSON.stringify(websockObj))
        // that.websock.onmessage = function (evt) {
        //   if (JSON.parse(evt.data).b.ret !== 0) {
        //     return false
        //   }
        var volatilityList = [] //买卖波动度
        // 所需参数交易所，标的代码，到期日，标的价格，执行价
        this.fluctuationOnlyOne(obj.market, obj.code, obj.expiring_date, this.detailedData.thePrice, this.detailedData
          .strikePrice, this.detailedData.subAccountNo).then((result => {
          let obj = {
            ask_volatility: [result.askVolatility],
            bid_volatility: [result.bidVolatility],
            code: result.underlying,
            expiring_date: result.expiringDate,
            market: result.exchange,
          }
          volatilityList = [obj]

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
            that.detailedData.salePrice = that.CalcCall(that.detailedData.thePrice, bidVolatility, that
              .detailedData
              .interestRate, that.detailedData.strikePrice, dtBuy).toFixed(2)
            that.detailedData.buyPrice = that.CalcCall(that.detailedData.thePrice, askVolatility, that
              .detailedData
              .interestRate, that.detailedData.strikePrice, dtSale).toFixed(2)
            that.detailedData.delta = that.CalcCallDelta(that.detailedData.thePrice, askVolatility, that
              .detailedData.interestRate, that.detailedData.strikePrice, dtSale)
            that.detailedData.delta = that.detailedData.delta.toFixed(4)


            var VirtualValue = Math.max(that.sub(that.detailedData.thePrice, that.detailedData.strikePrice), 0),
              VirtualValue = that.mul(VirtualValue, that.detailedData.volume);
          } else {
            that.detailedData.salePrice = that.CalcPut(that.detailedData.thePrice, bidVolatility, that
              .detailedData
              .interestRate, that.detailedData.strikePrice, dtBuy).toFixed(2)
            that.detailedData.buyPrice = that.CalcPut(that.detailedData.thePrice, askVolatility, that.detailedData
              .interestRate, that.detailedData.strikePrice, dtSale).toFixed(2)
            that.detailedData.delta = that.CalcPutDalta(that.detailedData.thePrice, askVolatility, that
              .detailedData
              .interestRate, that.detailedData.strikePrice, dtSale)
            that.detailedData.delta = that.detailedData.delta.toFixed(4)


            var VirtualValue = Math.max(that.sub(that.detailedData.strikePrice, that.detailedData.thePrice), 0),
              VirtualValue = that.mul(VirtualValue, that.detailedData.volume);
          }
          that.detailedData.buyPercent = ((that.detailedData.buyPrice / that.detailedData.thePrice) * 100)
            .toFixed(
              2) + '%'
          that.detailedData.salePercent = ((that.detailedData.salePrice / that.detailedData.thePrice) * 100)
            .toFixed(2) + '%'
          that.detailedData.buyVol = bidVolatility
          that.detailedData.saleVol = askVolatility
          that.detailedData.royalties = that.mul(that.detailedData.salePrice, that.detailedData.volume)

          // that.detailedData.margin = that.mul(that.detailedData.tradingMargin, Math.max(that.detailedData.delta, 0.2)).toFixed(2)
          that.detailedData.margin = Math.max(that.sub(that.detailedData.tradingMargin, (that.mul(0.5,
            VirtualValue))), (that.mul(0.5, VirtualValue)));
          // }
        }))
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
      loginSys: function () {
        this.drawerBtn = false
        if (this.username == "请登录") {
          this.$router.push('/login')
        }

      },
      //  计算最新价格
      getNewPriceFun: function () {
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
            if (!this.CacheData[a]) {
              return
            }

            let dateNum = this.DateDiff(this.nowDate, this.changeDate(this.expiryDate), this.newData[a].buyCpsDays,
              this.newData[a].sellCpsDays)
            let dtBuy = ((dateNum[0] - this.bid_deduction) / this.newData[a].yearSession)
            let dtSale = ((dateNum[1] - this.ask_deduction) / this.newData[a].yearSession)

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
      //  切换报价模式
      priceTypeChange: function () {
        switch (this.buyLabel) {
          case '买价':
            this.buyLabel = '买价%'
            this.saleLabel = '卖价%'
            for (var i = 0; i < this.newData.length; i++) {
              this.newData[i].buy = ((this.newData[i].buy / this.newData[i].price) * 100).toFixed(2) + '%'
              this.newData[i].sale = ((this.newData[i].sale / this.newData[i].price) * 100).toFixed(2) + '%'
            }
            this.$Message.info({
              content: '百分比报价',
              duration: 1
            })
            break
          case '买价%':
            this.buyLabel = '买价vol'
            this.saleLabel = '卖价vol'
            for (var j = 0; j < this.newData.length; j++) {
              this.newData[j].buy = (this.newData[j].bid_volatility * 100).toFixed(2) + '%'
              this.newData[j].sale = (this.newData[j].ask_volatility * 100).toFixed(2) + '%'
            }
            this.$Message.info({
              content: '波动度报价',
              duration: 1
            })
            break
          case '买价vol':
            this.buyLabel = '买价'
            this.saleLabel = '卖价'
            this.getNewPriceFun()
            break
        }
      },
      read() {
        let _this = this
        let xhr = new XMLHttpRequest()
        xhr.open("GET", "RiskDisclosure.txt")
        xhr.setRequestHeader("contentType", "application/x-www-form-urlencoded; charset=utf-8")
        xhr.send()
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            _this.book = xhr.responseText
            window.localStorage.setItem("stateus", '1')
          }
        }
        this.dialogVisible = true
      },
      changeVarietyName(obj) {
        let str = ''
        this.nameOptions.forEach(item => {
          if (item.product.toLowerCase() == obj.name.toLowerCase() && item.exchange.toLowerCase() == obj.market
            .toLowerCase()) {
            str = item.instrumentName
          }
        })
        if (str) {
          return str
        } else {
          return '--'
        }
      }
    },
    watch: {
      $route(to, from) {
        if (to.name == "Home") {
          this.drawerModal = false
          let login = window.sessionStorage.getItem("login")
          if (login) {
            this.getInfo()
          }
        }
      },
      expiryDate(newValue, oldValue) {
        if (newValue.toString().length > 10) {
          this.expiryDate = this.changeDate(newValue)
        }
      }
    },
    computed: {
      username() {
        return this.$store.state.username
      },
      baseurl() {
        return this.$store.state.baseurl
      },
      gsName() {
        return this.$store.state.gsName
      },

    }
  }
</script>