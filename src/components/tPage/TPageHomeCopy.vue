<template>
  <div class="t-top">
    <HeadBack :title="title"></HeadBack>
    <Row class="sele-class">
      <Col span="6" class="selec">
      <Select v-model="market" size="small" @on-change="marketChange">
        <Option v-for="item in marketArr" :value="item" :key="item">{{ item }}</Option>
      </Select>
      </Col>
      <Col span="6" class="selec">
      <Select v-model="code" size="small" @on-change="codeChange">
        <Option v-for="(item, index) in codeSelect" :value="item" :key="index">{{ item }}</Option>
      </Select>
      </Col>
      <Col span="6" class="selec">
      <Select v-model="optionType" size="small">
        <Option value="欧式期权">欧式期权</Option>
        <Option value="亚式期权" disabled>亚式期权</Option>
        <Option value="美式期权" disabled>美式期权</Option>
      </Select>
      </Col>
      <Col span="6" class="selec">
      <DatePicker size="small" type="date" v-model="expiryDate" format="yyyy-MM-dd" :options="options3"
        placeholder="Select date" placement="bottom-end" :clearable="false" :editable="false" @on-change="dateChange">
      </DatePicker>
      </Col>
    </Row>
    <Row class="call-put">
      <Col span="9" class="look-call">看涨</Col>
      <Col span="6" class="look-price">{{ price }}</Col>
      <Col span="9" class="look-put">看跌</Col>
    </Row>
    
    <Row class="market">
      <span @click="tPriceTypeChange">{{ buyLabel }}</span>
      <span @click="tPriceTypeChange">{{ saleLabel }}</span>
      <span>价格</span>
      <span @click="tPriceTypeChange">{{ buyLabel }}</span>
      <span @click="tPriceTypeChange">{{ saleLabel }}</span>
    </Row>
    <div class="box">
      <Row class="code" v-for="item in records" v-bind:key="item.id">
        <span style="color: #16d397" @click="homeBus('C', item.price, item.BuyCall)">{{ item.BuyCall.toString() == "NaN"?"--":item.BuyCall }}</span>
        <span style="color: #e75563" @click="homeBus('C', item.price, item.BuyCall)">{{ item.SaleCall.toString() == "NaN"?"--":item.SaleCall }}</span>
        <span>{{ item.price }}</span>
        <span style="color: #16d397" @click="homeBus('P', item.price, item.BuyCall)">{{ item.BuyPut.toString() == "NaN"?"--":item.BuyPut }}</span>
        <span style="color: #e75563" @click="homeBus('P', item.price, item.BuyCall)">{{ item.SalePut.toString() == "NaN"?"--":item.SalePut }}</span>
      </Row>
    </div>
    
  </div>
</template>

<script>
  import bus from '@/assets/eventBus'
  import HeadBack from '@/components/HeadBack'
  import global_ from '@/components/Global'
  import axios from '@/axios'
  export default {
    name: 'TPage',
    components: {
      HeadBack
    },
    data() {
      return {
        title: 'T型报价',
        optionType: '欧式期权',
        records: [],
        market: '',
        code: '',
        nowDate: '',
        expiryDate: '',
        price: '',
        websock: new WebSocket(global_.optionsQuoteServer),
        strikePriceChange: '',
        interestRate: '',
        deadline: '',
        minDaysNum: '',
        minDays: '',
        marketArr: [],
        codeArr: [],
        codeSelect: [],
        setIn: '',
        buyLabel: '买价',
        saleLabel: '卖价',
        options3: {
          disabledDate: date => {
            return date.getDay() === 0 || date.getDay() === 6 || this.$store.state.restDayStore.indexOf(Number(this
                .changeDate(date))) !== -1 || this.changeDate(date) < this.minDays || this.changeDate(date) > this
              .deadline
          }
        },
        buyCpsDays: '',
        sellCpsDays: '',
        yaerSession: '',
        subAccountNo: '',
      }
    },
    created () {
      this.getParams().then(() => {
        this.newCreat()
      })
    },
    destroyed() {
      clearTimeout(this.setIn)
    },
    methods: {
      newCreat() {
        this.$Loading.start()
        for (let j = 0; j < 11; j++) {
          let obj = {}
          obj['id'] = j
          obj['BuyCall'] = '---'
          obj['SaleCall'] = '---'
          obj['price'] = '---'
          obj['BuyPut'] = '---'
          obj['SalePut'] = '---'
          obj['ask_volatility'] = ''
          obj['bid_volatility'] = ''
          obj['market'] = ''
          obj['code'] = ''
          this.records.push(obj)
        }
        this.marketArr = this.marketCodeArr(this.$store.state.codeListStore)[0]
        this.codeArr = this.marketCodeArr(this.$store.state.codeListStore)[1]
        let codeIndex = this.marketArr.indexOf(this.market)
        this.codeSelect = this.codeArr[codeIndex]
        for (let i = 0; i < this.$store.state.CacheDataStore.length; i++) {
          if (this.$store.state.CacheDataStore[i].instrument_id === this.code) {
            this.price = Number(this.$store.state.CacheDataStore[i].last_price.toFixed(2))
          }
          if (this.$store.state.codeListStore[i].code === this.code) {
            this.strikePriceChange = this.$store.state.codeListStore[i].strike_price_change
            this.interestRate = this.$store.state.codeListStore[i].interest_rate
            this.deadline = this.$store.state.codeListStore[i].deadline
            this.minDaysNum = this.$store.state.codeListStore[i].min_days
          }
        }
        let DayArrMin = this.ThirdDate(this.$store.state.restDayStore, this.minDaysNum)
        this.minDays = DayArrMin[0]
        for (let z = 0; z < this.records.length; z++) {
          this.records[z].price = (this.price + (-5 + z) * this.strikePriceChange)
        }
        let strikePriceRatio = []
        for (let q = 0; q < this.records.length; q++) {
          let spr = Number((this.records[q].price / this.price).toFixed(8))
          strikePriceRatio.push(spr)
        }
        let expiryDateWebs = this.changeDate(this.expiryDate)
        let dT = this.DateDiff(this.nowDate, expiryDateWebs, this.buyCpsDays, this.sellCpsDays)

        let deduction = this.Deduction(this.nowDate, expiryDateWebs, this.$store.state.festivalListStore)

        let dBuy = ((dT[0] - deduction[0]) / 365)
        let dSale = ((dT[1] - deduction[1]) / 365)
        let that = this
        // let heartCheck = {
        //   timeout: 50000,
        //   timeoutObj: null,
        //   reset: function () {
        //     clearTimeout(this.timeoutObj)
        //     this.start()
        //   },
        //   start: function () {
        //     this.timeoutObj = setInterval(function () {
        //       that.websock.send('HeartBeat')
        //     }, this.timeout)
        //   }
        // }
        let arr = []
        let objt = {}
        objt['market'] = that.market
        objt['code'] = that.code
        objt['expiring_date'] = that.changeDate(that.expiryDate)
        objt['strike_price_ratio'] = strikePriceRatio
        arr.push(objt)
        let websockObj = {}
        websockObj['f'] = 265
        websockObj['r'] = that.generateRid()
        websockObj['b'] = {}
        websockObj.b['query_list'] = arr
        // that.websock.onopen = function (evt) {
        //   heartCheck.start()
        //   that.websock.send(JSON.stringify(websockObj))
        // }
        // that.websock.onmessage = function (evt) {
        //   let marketData = JSON.parse(evt.data)
        //   let volatilityList = marketData.b.volatility_list
        this.getFluctuation().then(result => {
          let volatilityList = result
          for (let i = 0; i < that.records.length; i++) {
            that.records[i].bid_volatility = volatilityList[0].bid_volatility[i]
            that.records[i].ask_volatility = volatilityList[0].ask_volatility[i]
            if (that.records[i].bid_volatility !== 0 && that.records[i].price !== 0) {
              that.records[i].SaleCall = that.CalcCall(that.price, that.records[i].bid_volatility, that.interestRate,
                that.records[i].price, dBuy)
              that.records[i].SaleCall = (that.records[i].SaleCall).toFixed(2)
              that.records[i].BuyCall = that.CalcCall(that.price, that.records[i].ask_volatility, that.interestRate,
                that.records[i].price, dSale)
              that.records[i].BuyCall = (that.records[i].BuyCall).toFixed(2)
              that.records[i].SalePut = that.CalcPut(that.price, that.records[i].bid_volatility, that.interestRate,
                that.records[i].price, dBuy)
              that.records[i].SalePut = (that.records[i].SalePut).toFixed(2)
              that.records[i].BuyPut = that.CalcPut(that.price, that.records[i].ask_volatility, that.interestRate,
                that.records[i].price, dSale)
              that.records[i].BuyPut = (that.records[i].BuyPut).toFixed(2)

            } else {
              that.records[i].BuyCall = '---'
              that.records[i].SaleCall = '---'
              that.records[i].BuyPut = '---'
              that.records[i].SalePut = '---'
            }
          }
          that.$Loading.finish()
        // }
        })
        that.setIn = setInterval(function () {
          that.getNewPrice()
        }, 30000)
      },
      getFluctuation() {
        return new Promise((reslove, reject) => {
          axios.post("client/inner/quoteconfig/getVolatility11VO.do", this.qs.stringify({
            exchange: this.market,
            underlying: this.code,
            lastPrice: this.price,
            expiringDate: this.expiryDate,
            subAccountNo: this.subAccountNo,
          })).then(result => {
            if(result.data.success) {
              let data = result.data.volatility11VO
              let obj = {
                ask_volatility: data.askVolatilitys,
                bid_volatility: data.bidVolatilitys,
                market: data.exchange,
                code: data.underlying,
                expiring_date: data.expiringDate,
              }
              reslove([obj])
            } else {
              reslove([])
            }
            
          })
        })
      },
      getParams: function () {
        return new Promise((reslove, reject) => {
          let routerParams = this.$route.params
          if (JSON.stringify(routerParams) === '{}') {
            this.$router.push('/')
            return false
          }
          this.market = routerParams.market
          this.code = routerParams.code
          this.expiryDate = routerParams.expiryDate
          this.nowDate = routerParams.nowDate
          this.buyCpsDays = routerParams.buyCpsDays
          this.sellCpsDays = routerParams.sellCpsDays
          this.yaerSession = routerParams.yaerSession
          this.subAccountNo = routerParams.subAccountNo
          reslove()
        })
      },
      marketChange: function () {
        let codeIndex = this.marketArr.indexOf(this.market)
        this.codeSelect = this.codeArr[codeIndex]
        this.code = this.codeSelect[0]
        this.deadlineLimit()
        this.getNewPrice()
      },
      codeChange: function () {
        for (let i = 0; i < this.$store.state.codeListStore.length; i++) {
          if (this.$store.state.codeListStore[i].code === this.code) {
            this.strikePriceChange = this.$store.state.codeListStore[i].strike_price_change
            this.interestRate = this.$store.state.codeListStore[i].interest_rate
          }
        }
        this.deadlineLimit()
        this.getNewPrice()
      },
      dateChange: function () {
        this.getNewPrice()
      },
      deadlineLimit: function () {
        for (let i = 0; i < this.$store.state.codeListStore.length; i++) {
          if (this.$store.state.codeListStore[i].code === this.code) {
            this.deadline = this.$store.state.codeListStore[i].deadline
            this.minDaysNum = this.$store.state.codeListStore[i].min_days
          }
        }
        let DayArrMin = this.ThirdDate(this.$store.state.restDayStore, this.minDaysNum)
        this.minDays = DayArrMin[0]
      },
      getNewPrice: function () {
        for (let i = 0; i < this.$store.state.CacheDataStore.length; i++) {
          if (this.$store.state.CacheDataStore[i].instrument_id === this.code) {
            this.price = Number(this.$store.state.CacheDataStore[i].last_price.toFixed(2))
          }
          if (this.$store.state.codeListStore[i].code === this.code) {
            this.strikePriceChange = this.$store.state.codeListStore[i].strike_price_change
            this.interestRate = this.$store.state.codeListStore[i].interest_rate
          }
        }
        let strikePriceRatio = []
        for (let z = 0; z < this.records.length; z++) {
          let spr = 0
          if (this.price !== 0) {
            this.records[z].price = (this.price + (-5 + z) * this.strikePriceChange)
            spr = Number((this.records[z].price / this.price).toFixed(8))
          } else {
            this.records[z].price = 0
            spr = 0
          }
          strikePriceRatio.push(spr)
        }
        let expiryDateWebs = this.changeDate(this.expiryDate)
        let dT = this.DateDiff(this.nowDate, expiryDateWebs, this.buyCpsDays, this.sellCpsDays)
        let deduction = this.Deduction(this.nowDate, expiryDateWebs, this.$store.state.festivalListStore)
        let dBuy = ((dT[0] - deduction[0]) / 365)
        let dSale = ((dT[1] - deduction[1]) / 365)
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
        // that.websock.send(JSON.stringify(websockObj))
        // that.websock.onmessage = function (evt) {
        //   let marketData = JSON.parse(evt.data)
        //   let volatilityList = marketData.b.volatility_list
        this.getFluctuation().then(result => {
          let volatilityList = result
          for (let i = 0; i < that.records.length; i++) {
            that.records[i].bid_volatility = volatilityList[0].bid_volatility[i]
            that.records[i].ask_volatility = volatilityList[0].ask_volatility[i]
            if (that.records[i].bid_volatility !== 0 && that.records[i].price !== 0) {
              that.records[i].SaleCall = that.CalcCall(that.price, that.records[i].bid_volatility, that
                .interestRate, that.records[i].price, dBuy)
              that.records[i].BuyCall = that.CalcCall(that.price, that.records[i].ask_volatility, that.interestRate,
                that.records[i].price, dSale)
              that.records[i].SalePut = that.CalcPut(that.price, that.records[i].bid_volatility, that.interestRate,
                that.records[i].price, dBuy)
              that.records[i].BuyPut = that.CalcPut(that.price, that.records[i].ask_volatility, that.interestRate,
                that.records[i].price, dSale)
              if (that.buyLabel === '买价') {
                that.records[i].SaleCall = that.records[i].SaleCall.toFixed(2)
                that.records[i].BuyCall = that.records[i].BuyCall.toFixed(2)
                that.records[i].SalePut = that.records[i].SalePut.toFixed(2)
                that.records[i].BuyPut = that.records[i].BuyPut.toFixed(2)
              } else if (that.buyLabel === '买价%') {
                that.records[i].SaleCall = ((that.records[i].SaleCall / that.price) * 100).toFixed(2) + '%'
                that.records[i].BuyCall = ((that.records[i].BuyCall / that.price) * 100).toFixed(2) + '%'
                that.records[i].SalePut = ((that.records[i].SalePut / that.price) * 100).toFixed(2) + '%'
                that.records[i].BuyPut = ((that.records[i].BuyPut / that.price) * 100).toFixed(2) + '%'
              } else {
                that.records[i].SaleCall = (that.records[i].bid_volatility * 100).toFixed(2) + '%'
                that.records[i].BuyCall = (that.records[i].ask_volatility * 100).toFixed(2) + '%'
                that.records[i].SalePut = (that.records[i].bid_volatility * 100).toFixed(2) + '%'
                that.records[i].BuyPut = (that.records[i].ask_volatility * 100).toFixed(2) + '%'
              }
            } else {
              that.records[i].BuyCall = '---'
              that.records[i].SaleCall = '---'
              that.records[i].BuyPut = '---'
              that.records[i].SalePut = '---'
            }
          }
        // }
        })
      },
      changeDate: function (e) {
        if (!e.getFullYear) {
          return e
        }
        let seperator1 = ''
        let year = e.getFullYear()
        let month = e.getMonth() + 1
        let strDate = e.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate
        return currentdate
      },
      tPriceTypeChange: function () {
        switch (this.buyLabel) {
          case '买价':
            this.buyLabel = '买价%'
            this.saleLabel = '卖价%'
            for (let i = 0; i < this.records.length; i++) {
              if (this.records[i].bid_volatility !== 0 && this.records[i].price !== 0) {
                this.records[i].SaleCall = ((this.records[i].SaleCall / this.price) * 100).toFixed(2) + '%'
                this.records[i].BuyCall = ((this.records[i].BuyCall / this.price) * 100).toFixed(2) + '%'
                this.records[i].SalePut = ((this.records[i].SalePut / this.price) * 100).toFixed(2) + '%'
                this.records[i].BuyPut = ((this.records[i].BuyPut / this.price) * 100).toFixed(2) + '%'
              } else {
                this.records[i].BuyCall = '---'
                this.records[i].SaleCall = '---'
                this.records[i].BuyPut = '---'
                this.records[i].SalePut = '---'
              }
            }
            this.$Message.info({
              content: '百分比报价',
              duration: 1
            })
            break
          case '买价%':
            this.buyLabel = '买价vol'
            this.saleLabel = '卖价vol'
            for (let i = 0; i < this.records.length; i++) {
              if (this.records[i].bid_volatility !== 0 && this.records[i].price !== 0) {
                this.records[i].SaleCall = (this.records[i].bid_volatility * 100).toFixed(2) + '%'
                this.records[i].BuyCall = (this.records[i].ask_volatility * 100).toFixed(2) + '%'
                this.records[i].SalePut = (this.records[i].bid_volatility * 100).toFixed(2) + '%'
                this.records[i].BuyPut = (this.records[i].ask_volatility * 100).toFixed(2) + '%'
              } else {
                this.records[i].BuyCall = '---'
                this.records[i].SaleCall = '---'
                this.records[i].BuyPut = '---'
                this.records[i].SalePut = '---'
              }
            }
            this.$Message.info({
              content: '波动度报价',
              duration: 1
            })
            break
          case '买价vol':
            this.buyLabel = '买价'
            this.saleLabel = '卖价'
            this.getNewPrice()
            break
        }
      },
      homeBus: function (e, p, b) {
        if (b === '---') {
          return false
        }
        let busObj = {
          code: this.code,
          expiryDate: this.expiryDate,
          direction: e,
          thePrice: this.price,
          strikePrice: p
        }

        bus.$emit('tDefinedEvent', busObj)
      }
    },
    watch: {
      expiryDate(newValue, oldValue) {
        if(newValue.toString().length > 10) {
          this.expiryDate = this.changeDate(newValue)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    padding-right: 8px !important
  }

  .t-top {
    position: relative;
    width: 100%;
    max-width: 750px;
    min-width: 320px;
    margin: 0 auto;
    padding-top: 2rem;
    border-left: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
  }

  .sele-class {
    height: 2rem;
    width: 100%;
    max-width: 750px;
    min-width: 320px;
  }

  .sele-class .selec {
    padding: 0 5px;
    margin-top: 8px;
  }

  .call-put {
    height: 2rem;
    width: 100%;
    max-width: 750px;
    min-width: 320px;
  }

  .call-put .look-call {
    background-color: #e75563;
    line-height: 2rem;
    color: white;
    text-align: center;
  }

  .call-put .look-put {
    background-color: #16d397;
    line-height: 2rem;
    color: white;
    text-align: center;
  }

  .call-put .look-price {
    background-color: rgb(245, 245, 245);
    line-height: 2rem;
    color: black;
    text-align: center;
  }

  .market {
    height: 2.25rem;
    line-height: 2.25rem;
    background-color: white;
    width: 100%;
    max-width: 750px;
    background-color: rgb(245, 245, 245);
    position:absolute;
    top: 6rem;
    left: 0;
    /* display: none; */
  }

  .market span {
    display: block;
    float: left;
    width: 20%;
    text-align: center;
  }

  .box {
    margin-top:45px;
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

  .code span:nth-child(3) {
    background-color: rgb(245, 245, 245) !important
  }

  .code:nth-child(10) span:nth-child(3) {
    color: black !important
  }
</style>