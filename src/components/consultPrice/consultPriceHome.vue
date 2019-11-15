<template>
  <div class="consu-container">
    <!-- <p class="top">询价</p> -->
    <div class="header">
      <HeadBack title="询价"></HeadBack>
    </div>
    
    <Row class="consu-item">
      <Col span="12" class="con-item">
      <p>交易所</p>
      <Select v-model="market" @on-change="marketChange">
        <Option v-for="item in marketArr" :value="item" :key="item">{{ item }}</Option>
      </Select>
      </Col>
      <Col span="12" class="con-item">
      <p>代码</p>
      <Select v-model="code" @on-change="codeChange">
        <Option v-for="item in codeSelect" :value="item" :key="item">{{ item }}</Option>
      </Select>
      </Col>
    </Row>
    <Row class="consu-item">
      <Col span="12" class="con-item">
      <p>到期日</p>
      <DatePicker type="date" v-model="expiryDate" format="yyyy-MM-dd" @on-change="tShow = false" :options="options3"
        placeholder="Select date" placement="bottom-end" :clearable="false" :editable="false">
      </DatePicker>
      </Col>
      <Col span="12" class="con-item" style="text-align:center">
      <p>最新价</p>
      <Input v-model="latestPrice" placeholder="0" class="text-center" disabled></Input>
      </Col>
    </Row>
    <Row class="consu-item">
      <Col span="12" class="con-item">
      <p>进场价</p>
      <InputNumber v-model="thePrice" placeholder="0" @on-change="tShow = false"></InputNumber>
      </Col>
      <Col span="12" class="con-item">
      <p>执行价</p>
      <InputNumber v-model="strikePrice" placeholder="0" @on-change="tShow = false"></InputNumber>
      </Col>
    </Row>
    <Row class="consu-item">
      <Col span="12" class="con-item">
      <p>方向</p>
      <Select v-model="direction" @on-change="tShow = false">
        <Option v-for="item in optionDirection" :value="item" :key="item">{{ item }}</Option>
      </Select>
      </Col>
      <Col span="12" class="con-item">
      <p>期权类型</p>
      <Select value="欧式期权">
        <Option value="欧式期权">欧式期权</Option>
        <Option value="亚式期权" disabled>亚式期权</Option>
        <Option value="美式期权" disabled>美式期权</Option>
      </Select>
      </Col>
    </Row>
    <Row v-show="tShow" class="queryRow" id="queryInterface">
      <Alert>
        <p>询价时间: {{ nowTime }}</p>
        <p>标的: {{ market }} / {{ code }}</p>
        <p>进场价: {{ thePrice }} </p>
        <p>期权: {{ codeinfo }} </p>
        <p>行权方向: {{ direction }} / 欧式期权 </p>
        <p>卖出报价: {{ buyPrice }} </p>
        <p>买入报价: {{ salePrice}} </p>
      </Alert>
      <textarea id="hiddleInput">copytext</textarea>
    </Row>
    <Row class="con-btn">
      <Col span="8"> <span class="con-btn-left" @click="makeInquiry"> 询价 </span> </Col>
      <Col span="8"> <span class="con-btn-mid" @click="copyInfo"> 复制信息 </span> </Col>
      <Col span="8"> <span class="con-btn-right" @click="addOptional"> 添加自选 </span> </Col>
    </Row>
    <BottonTab></BottonTab>
  </div>
</template>

<script>
  import BottonTab from '@/components/BottonTab'
  import HeadBack from '@/components/HeadBack'
  import global_ from '@/components/Global'
  import axios from '@/axios'
  import Jq from 'jquery'
  export default {
    name: 'ConsultPriceHome',
    components: {
      BottonTab,
      HeadBack
    },
    data() {
      return {
        msg: 0,
        formItem: '',
        marketArr: [],
        codeArr: [],
        codeSelect: [],
        direction: '看涨',
        optionDirection: ['看涨', '看跌'],
        market: '',
        code: '',
        codeinfo: '',
        expiryDate: '',
        nowDate: '',
        latestPrice: 0,
        thePrice: 0,
        strikePrice: 0,
        interestRate: '',
        deadline: '',
        minDaysNum: '',
        minDays: '',
        options3: {
          disabledDate: date => {
            return date.getDay() === 0 || date.getDay() === 6 || this.$store.state.restDayStore.indexOf(Number(this
                .changeDate(date))) !== -1 || this.changeDate(date) < this.minDays || this.changeDate(date) > this
              .deadline
          }
        },
        websock: new WebSocket(global_.optionsQuoteServer),
        nowTime: '',
        tShow: false,
        buyPrice: '',
        salePrice: '',
        optionalCode: [],
        codeIndex: 0,
        didx: 0,
      }
    },
    created() {

    },
    mounted: function () {
      this.marketArr = this.marketCodeArr(this.$store.state.codeListStore)[0]
      this.codeArr = this.marketCodeArr(this.$store.state.codeListStore)[1]
      this.market = this.marketArr[0]
      this.codeSelect = this.codeArr[0]
      let DayArr = this.ThirdDate(this.$store.state.restDayStore, 30)
      this.expiryDate = DayArr[0]
      this.nowDate = DayArr[2]
      // for (let i = 0; i < this.$store.state.CacheDataStore.length; i++) {
      //   if (this.$store.state.CacheDataStore[i].instrument_id === this.code) {
      //     this.latestPrice = this.$store.state.CacheDataStore[i].last_price
      //   }
      //   if (this.$store.state.codeListStore[i].code === this.code) {
      //     this.strikePriceChange = this.$store.state.codeListStore[i].strike_price_change
      //     this.interestRate = this.$store.state.codeListStore[i].interest_rate
      //     this.deadline = this.$store.state.codeListStore[i].deadline
      //     this.minDays = this.$store.state.codeListStore[i].min_days
      //   }
      // }
      var that = this
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
      that.websock.onopen = function (evt) {
        heartCheck.start()
      }
    },
    methods: {
      codeChange: function () {
        for (let i = 0; i < this.$store.state.CacheDataStore.length; i++) {
          if (this.$store.state.CacheDataStore[i].instrument_id === this.code) {
            this.didx = i
            this.latestPrice = this.$store.state.CacheDataStore[i].last_price
            this.thePrice = this.$store.state.CacheDataStore[i].last_price
            this.strikePrice = this.$store.state.CacheDataStore[i].last_price
          }
          if (this.$store.state.codeListStore[i].code === this.code) {
            // this.strikePriceChange = this.$store.state.codeListStore[i].strike_price_change
            this.interestRate = this.$store.state.codeListStore[i].interest_rate
            this.deadline = this.$store.state.codeListStore[i].deadline
            this.minDaysNum = this.$store.state.codeListStore[i].min_days
          }
        }
        let DayArrMin = this.ThirdDate(this.$store.state.restDayStore, this.minDaysNum)
        this.minDays = DayArrMin[0]
        this.tShow = false
      },
      marketChange: function (val) {
        let codeIndex = this.marketArr.indexOf(this.market)
        this.codeIndex = codeIndex + 1
        this.codeSelect = this.codeArr[codeIndex]
        this.code = this.codeSelect[0]
        this.codeChange()
        this.tShow = false
      },
      makeInquiry: function () {
        if (this.code === '') {
          this.$Modal.warning({
            title: '提示',
            content: '请选择标的!'
          })
        }
        let strikePriceRatio = []
        let spr = Number((this.strikePrice / this.thePrice).toFixed(8))
        strikePriceRatio.push(spr)
        let that = this
        let arr = []
        let obj = {}
        obj['market'] = that.market
        obj['code'] = that.code
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
          let volatilityList = JSON.parse(evt.data).b.volatility_list
          if (volatilityList[0].ask_volatility[0] === 0) {
            that.$Modal.warning({
              title: '提示',
              content: '无效报价!'
            })
            return false
          }
          let askVolatility = volatilityList[0].ask_volatility[0]
          let bidVolatility = volatilityList[0].bid_volatility[0]
          let myDate = new Date()
          let dat = myDate.toLocaleDateString()
          let house = myDate.getHours()
          let sc = myDate.getMinutes()
          let min = myDate.getSeconds()
          let time = dat + ' ' + house + ':' + sc + ':' + min
          let expiryDateWebs = that.changeDate(that.expiryDate)
          let dT = that.DateDiff(that.nowDate, expiryDateWebs)
          let deduction = that.Deduction(that.nowDate, expiryDateWebs, that.$store.state.festivalListStore)
          let biBBeduction = deduction[0]
          let askBeduction = deduction[1]
          let dBuy = ((dT - biBBeduction) / 365)
          let dSale = ((dT - askBeduction) / 365)
          that.codeinfo = that.code + ' / ' + expiryDateWebs + ' / ' + dT + '(天)' + ' / ' + that.strikePrice
          that.nowTime = time
          console.log(that.direction)
          if (that.direction === '看涨') {
            let QueryPriceBuy = that.CalcCall(that.thePrice, bidVolatility, that.interestRate, that.strikePrice,
              dBuy)
            let QueryPriceSale = that.CalcCall(that.thePrice, askVolatility, that.interestRate, that.strikePrice,
              dSale)
            let QueryPriceBuyPercentage = ((QueryPriceBuy / that.strikePrice) * 100).toFixed(2) + '%'
            let QueryPriceSalePercentage = ((QueryPriceSale / that.strikePrice) * 100).toFixed(2) + '%'
            let QueryPriceBuyt = QueryPriceBuy.toFixed(2)
            let QueryPriceSalet = QueryPriceSale.toFixed(2)
            that.buyPrice = QueryPriceBuyt + ' / ' + QueryPriceBuyPercentage + ' / ' + (bidVolatility * 100)
              .toFixed(2) + '%'
            that.salePrice = QueryPriceSalet + ' / ' + QueryPriceSalePercentage + ' / ' + (askVolatility * 100)
              .toFixed(2) + '%'
          } else {
            let QueryPriceBuy = that.CalcPut(that.thePrice, bidVolatility, that.interestRate, that.strikePrice,
              dBuy)
            let QueryPriceSale = that.CalcPut(that.thePrice, askVolatility, that.interestRate, that.strikePrice,
              dSale)
            let QueryPriceBuyPercentage = ((QueryPriceBuy / that.strikePrice) * 100).toFixed(2) + '%'
            let QueryPriceSalePercentage = ((QueryPriceSale / that.strikePrice) * 100).toFixed(2) + '%'
            let QueryPriceBuyt = QueryPriceBuy.toFixed(2)
            let QueryPriceSalet = QueryPriceSale.toFixed(2)
            that.buyPrice = QueryPriceBuyt + ' / ' + QueryPriceBuyPercentage + ' / ' + (bidVolatility * 100)
              .toFixed(2) + '%'
            that.salePrice = QueryPriceSalet + ' / ' + QueryPriceSalePercentage + ' / ' + (askVolatility * 100)
              .toFixed(2) + '%'
          }
          that.tShow = true
        }
      },
      // 查询自选信息
      getData() {
        console.log(this.expiryDate)
      },
      // 向后台添加自选
      addStart() {
        let codeList = this.$store.state.codeListStore
        let latest = this.thePrice
        let type = this.direction
        let NewPrice = this.latestPrice
        let sale = this.salePrice.split('/')
        let buy = this.buyPrice.split('/')
        let MCarr = this.marketCodeArr(codeList)
        let ArrCode = MCarr[1]
        let ArrMarket = MCarr[0]
        let daima = ArrCode[this.codeIndex][this.didx]
        let ma = ArrMarket[this.codeIndex]

        let nowDay = new Date()
        let NowDayCom = this.changeDate(nowDay)
        if (this.expiryDate.toString().length > 8 && this.expiryDate.toString().length != 10) {
          let time = this.expiryDate
          let y = time.getFullYear().toString();
          let m = time.getMonth() + 1;
          let d = time.getDate();
          m = m.toString().padStart(2, "0")
          d = d.toString().padStart(2, "0")
          let sj = y + '' + m + '' + d;
          var ThisTime = sj
        } else {
          var ThisTime = this.expiryDate.split("-").join('')
        }
        let subTime = ThisTime.substring(2, 8)
        let list = this.$store.state.festivalListStore
        let dateDiff = this.DateDiff(NowDayCom, ThisTime)
        let dce = this.Deduction(NowDayCom, ThisTime, list)
        let bid_deduction = dce[0]
        let ask_deduction = dce[1]
        let dam = daima + "-" + type + "-" + NewPrice + "-" + subTime

        var listSelfSelectionModel = [{
          detailsCode: dam,
          dueDate: dateDiff,
          newPrice: latest,
          strikePrice: NewPrice,
          ask_deduction: ask_deduction,
          ask_volatility: parseInt(sale[2]),
          bid_deduction: bid_deduction,
          bid_volatility: parseInt(buy[2]),
          buy: parseInt(buy[0]),
          code: daima,
          expiring_date: ThisTime,
          interest_rate: 0.06,
          market: ma,
          sale: parseInt(sale[0]),
          type: type
        }]
        // var postData = {}
        // listSelfSelectionModel.forEach((item, idx) => {
        //   for (var index in item) {
        //     postData[index + "[" + idx + "]"] = item[index]
        //   }
        // })

        // axios.post('client/addSelfSelectionList.do', this.qs.stringify({ 'listSelfSelectionModel':listSelfSelectionModel },{ arrayFormat: 'indices' })).then()
        let _this = this
        Jq.ajax({
          url: `${global_.baseURL}client/addSelfSelectionList.do`,
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(listSelfSelectionModel),
          type: "post",
          success(result) {
            if (result.success) {
              _this.$Message.info('添加自选成功')
            } else {
              _this.$Message.error(result.errorInfo)
            }
          }
        })
      },
      //  添加自选
      addOptional: function () {
        var login = window.sessionStorage.getItem("login")
        if (this.tShow) {
          let locaOpArr = JSON.parse(localStorage.getItem('optionalCode')) || []
          let optionalArr = {
            opMarket: this.market,
            opCode: this.code,
            opExpiryDate: this.changeDate(this.expiryDate),
            opThePrice: this.thePrice,
            opInfo: this.market + '-' + this.code + '-' + this.thePrice + '-' + this.changeDate(this.expiryDate)
          }
          if (locaOpArr.length !== 0) {
            if (localStorage.getItem('optionalCode').indexOf(optionalArr.opInfo) !== -1) {
              // this.$Message.warning('已存在相应目录')
            } else {
              locaOpArr.push(optionalArr)
              localStorage.setItem('optionalCode', JSON.stringify(locaOpArr))
              this.$store.dispatch('changeOptional', locaOpArr)
              // this.$Message.info('添加自选成功')
              if (login) {
                this.addStart()
              }

            }
          } else {
            locaOpArr.push(optionalArr)
            localStorage.setItem('optionalCode', JSON.stringify(locaOpArr))
            this.$store.dispatch('changeOptional', locaOpArr)
            // this.$Message.info('添加自选成功')
            if (login) {
              this.addStart()
            }
          }
        } else {
          this.$Modal.warning({
            title: '提示',
            content: '请询价后添加自选!'
          })
        }
      },
      //  复制信息
      copyInfo: function () {
        if (!this.tShow) {
          this.$Modal.warning({
            title: '提示',
            content: '请先询价'
          })
          return false
        }
        let text = document.getElementById('queryInterface').innerText
        for (let i = 0; i < 6; i++) {
          text = text.replace('\n\n', '\n')
        }
        let input = document.getElementById('hiddleInput')
        input.value = text
        input.select()
        document.execCommand('copy')
        this.$Message.info({
          content: '已复制到粘贴板',
          duration: 1
        })
      }
    },
    computed: {

    },

  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .consu-container {
    position: relative;
    width: 100%;
    max-width: 750px;
    min-width: 320px;
    margin: 0 auto;
    border-left: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
  }

  .header {
    height: 40px;
  }

  /* .top {
    height: 2rem;
    width: 100%;
    max-width: 750px;
    line-height: 2rem;
    text-align: center;
    border-bottom: 1px solid #ccc;
    box-shadow: 1px 1px 1px #ddd;
  } */

  .consu-item {
    margin-top: 5px;
    height: 2.5rem;
    text-align: center;
  }

  .con-item {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .con-btn {
    width: 100%;
    max-width: 750px;
    height: 2rem;
    line-height: 2rem;
    color: white;
    text-align: center;
    background-color: #fff;
    position: fixed;
    bottom: 2.5rem;
    z-index: 3;
  }

  .con-btn .con-btn-left {
    background-color: #e75563;
    display: block;
  }

  .con-btn .con-btn-mid {
    background-color: rgb(208, 159, 25);
    display: block;
  }

  .con-btn .con-btn-right {
    background-color: #16d397;
    display: block;
  }

  #hiddleInput {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
  }

  .text-center {
    text-align: center !important;
  }

  .queryRow {
    border-top: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
  }

  .queryRow p {
    padding: 2px
  }

</style>
