<template>
  <div>
    <div>
      <el-table :data="PositionData" border :height="250" style="width: 100%;" highlight-current-row>
        <el-table-column prop="exchange" label="交易所"> </el-table-column>
        <el-table-column prop="underlying" label="标的代码"> </el-table-column>
        <el-table-column prop="subAccountNo" label="子账业务" :formatter="changeSubNo"> </el-table-column>
        <el-table-column prop="buyContractVolume" label="当前买持仓量(手)"> </el-table-column>
        <el-table-column prop="buyTodayOpenVolume" label="今日开仓数量(买)"> </el-table-column>
        <el-table-column prop="buyTodayCloseVolume" label="今日平仓数量(买)"> </el-table-column>
        <!-- <el-table-column label="成交金额(买)" :formatter="buyMab"> </el-table-column> -->
        <el-table-column prop="buyAveragePrice" label="持仓均价(买)(手)"> 
          <template slot-scope="scope">
            <span> {{Number(scope.row.buyAveragePrice).toFixed(2)}} </span>
          </template>
        </el-table-column>
        <el-table-column prop="sellContractVolume" label="当前卖持仓量(手)"> </el-table-column>
        <el-table-column label="净头寸持仓(手)"  :formatter="net"> </el-table-column>
        <el-table-column prop="sellTodayOpenVolume" label="今日开仓数量(卖)"> </el-table-column>
        <el-table-column prop="sellTodayCloseVolume" label="今日平仓数量(卖)"> </el-table-column>
        <!-- <el-table-column label="成交金额(卖)" :formatter="sellMab"> </el-table-column> -->
        <el-table-column prop="sellAveragePrice" label="持仓均价(卖)(手)"> 
          <template slot-scope="scope">
            <span> {{Number(scope.row.sellAveragePrice).toFixed(2)}} </span>
          </template>
        </el-table-column>
        <el-table-column label="持仓盈亏(浮)" :formatter="float"> </el-table-column>
        <el-table-column label="持仓盈亏(盯)" :formatter="floatF"> </el-table-column>
        <el-table-column label="平仓盈亏(逐笔)" :formatter="closeOutLossZ"> </el-table-column>
        <el-table-column label="平仓盈亏(盯)" :formatter="closeOutLoss"> </el-table-column>
        <el-table-column prop="buyOriginalPriceContractValue" label="持仓成本(买)"> </el-table-column>
        <el-table-column prop="sellOriginalPriceContractValue" label="持仓成本(卖)"> </el-table-column>
        <!-- <el-table-column label="净头持仓成本"  :formatter="cost"> </el-table-column> -->
        <el-table-column label="操作" v-if="!dis"> 
          <template slot-scope="scope">
            <el-button size="mini" @click="closeOut(scope.row)"> 平仓 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="平仓" :visible.sync="dialogVisible" width="1350px" :before-close="handleClose" v-dialogDrag>
        <el-row>
          <el-col :span="12">
            <el-col :span="8">
              <span>交易所</span>
            </el-col>
            <el-col :span="16">
              <span> {{close.exchange}} </span>
            </el-col>
          </el-col>
          <el-col :span="12" style="padding-left: 50px;">
            <el-col :span="8">
              <span>标的代码</span>
            </el-col>
            <el-col :span="16">
              <span> {{close.underlying}} </span>
            </el-col>
          </el-col>
        </el-row>
        <p class="close_hint">如为单边持仓的话只填一项即可,如为多边持仓,买平和卖平的信息都要填写.数量为0则代表该单边不进行平仓操作.左边为买持,右边为卖持.如果为原油交易中心或上期所默认为平历史单,如需平今操作请自行切换</p>
        <el-row>
          <el-col :span="12">
            <el-col :span="8">
              <span>买卖方向</span>
            </el-col>
            <el-col :span="16">
              <el-select v-model="close.buy.buySell" sise="small">
                <el-option v-for="item in buySellOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="12" style="padding-left: 50px;">
            <el-col :span="8">
              <span>买卖方向</span>
            </el-col>
            <el-col :span="16">
              <el-select v-model="close.sell.buySell" sise="small">
                <el-option v-for="item in buySellOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-col :span="8">
              <span>场内开平方向</span>
            </el-col>
            <el-col :span="16">
              <el-select v-model="close.buy.offsetFlag" sise="small" @change="BuyChangeOffsetFlag">
                <el-option v-for="item in offsetFlagOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="12" style="padding-left: 50px;">
            <el-col :span="8">
              <span>场内开平方向</span>
            </el-col>
            <el-col :span="16">
              <el-select v-model="close.sell.offsetFlag" sise="small" @change="SellChangeOffsetFlag">
                <el-option v-for="item in offsetFlagOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-col :span="8">
              <span>投机套保标识</span>
            </el-col>
            <el-col :span="16">
              <el-select v-model="close.buy.hedgeFlag" sise="small">
                <el-option v-for="item in hedgeFlagOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-col>
          </el-col>
          <el-col :span="12" style="padding-left: 50px;">
            <el-col :span="8">
              <span>投机套保标识</span>
            </el-col>
            <el-col :span="16">
              <el-select v-model="close.sell.hedgeFlag" sise="small">
                <el-option v-for="item in hedgeFlagOptions" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-col :span="8">
              <span>平仓数量</span>
            </el-col>
            <el-col :span="16" style="position:reletive;">
              <el-input-number v-model="close.buy.orderVolume" controls-position="right" size="small" :min="0"></el-input-number>
              <!-- <el-input-number v-model="close.buy.orderVolume" controls-position="right" size="small" :min="0" :max="close.buy.copyNum"></el-input-number> -->
              <p style="display:inline-block;margin-left: 10px;color:red; position: absolute;"> {{ isShow(close.buy.copyNum, close.buy.offsetFlag, close.exchange)}} </p>
            </el-col>
          </el-col>
          <p></p>
          <el-col :span="12" style="padding-left: 50px;">
            <el-col :span="8">
              <span>平仓数量</span>
            </el-col>
            <el-col :span="16" style="position:reletive;">
              <el-input-number v-model="close.sell.orderVolume" controls-position="right" size="small" :min="0"></el-input-number>
              <!-- <el-input-number v-model="close.sell.orderVolume" controls-position="right" size="small" :min="0" :max="close.sell.copyNum"></el-input-number> -->
              <p style="display:inline-block;margin-left: 10px;color:red; position: absolute;"> {{ isShow(close.sell.copyNum, close.sell.offsetFlag, close.exchange)}} </p>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-col :span="8">
              <span>平仓价</span>
            </el-col>
            <el-col :span="16">
              <el-input-number v-model="close.buy.orderPrice" controls-position="right" size="small"></el-input-number>
            </el-col>
          </el-col>
          <el-col :span="12" style="padding-left: 50px;">
            <el-col :span="8">
              <span>平仓价</span>
            </el-col>
            <el-col :span="16">
              <el-input-number v-model="close.sell.orderPrice" controls-position="right" size="small"></el-input-number>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-col :span="8">
              <span>平仓描述</span>
            </el-col>
            <el-col :span="16">
              <el-input v-model="close.description" placegolder="请输入平仓描述" size="small"></el-input>
            </el-col>
          </el-col>
        </el-row>
        <div class="cut-off"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="enter">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import axios from '@/axios'
  import g from '@/components/Global.vue'
  import bus from '@/assets/eventBus'
  export default {
    name: 'for_allCC',
    data() {
      return {
        sub: '',
        id: '',
        user: '',
        PositionData: [{
          exchange: 'INE',
          sellTodayDayRemainCloseVolume: 1,
          sellHistoryDayRemainCloseVolume: 2,
          buyTodayDayRemainCloseVolume: 1,
          buyHistoryDayRemainCloseVolume: 2,
        }],
        precision: 0,
        dialogVisible: false,
        closeData: {},
        dis: false, //用于表示是否是输入交易密码进入的
        // socketData: [],

        close: {    //用于平仓
          exchange: '',
          underlying: '',
          subAccountNo: '',
          clientId: '',
          clientBindId: '',
          description: '',
          buy: {
            buySell: '',
            orderPrice: '',
            orderVolume: '',
            copuNum: 0,
            offsetFlag: '',
            hedgeFlag: '',
          },
          sell: {
            buySell: '',
            orderPrice: '',
            orderVolume: '',
            copuNum: 0,
            offsetFlag: '',
            hedgeFlag: '',
          },
        },  
        row: {},

        offsetFlagOptions: [{
            value: 1,
            label: "平仓"
          },
          {
            value: 3,
            label: "平今"
          },
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
        buySellOptions: [
          {
            value: 'B',
            label: '买'
          },
          {
            value: 'S',
            label: '卖'
          }
        ],

        // 页码
        page: 1,
        total: 0,
        pageSize: 50,
      }
    },
    created() {
      bus.$on("daochuCCAll", this.daochu)
      bus.$on("reload", this.reload)    //定时刷新
      bus.$on("retryAllClose", this.retryAllClose)
      // bus.$on("socketArray", this.getSocketArray)
    },
    destroyed() {
      bus.$off("reload", this.reload)
      this.PositionData = []
    },
    methods: {
      //委托单分页
      PositionChange(val) {
        axios.post('client/forward/forwardcontract/queryTotals.do', this.qs.stringify({
          clientBindId: this.id,
          expirStatus: 0,
          'subAccountNos[]': this.sub,
        })).then(data => {
          if (data.data.success) {
            this.PositionData = data.data.fcts
          } else {
            this.PositionData = []
          }

        })
      },

      daochu() {
        // window.open(`${g.baseURL}client/forward/excel/exportForwardContractTotals.do?clientBindId=${this.id}&subAccountNos=${this.sub}`)
        this.postDown(`${g.baseURL}client/forward/excel/exportForwardContractTotals.do`, {
          'clientBindId': this.id,
          'subAccountNos[]': this.sub,
          'expirStatus': 0,
        })
      },
      closeOut(row) {
        this.row = row
        this.close.exchange = row.exchange
        this.close.underlying = row.underlying
        this.close.subAccountNo = row.subAccountNo
        this.close.clientId = this.user
        this.close.clientBindId = this.id

        this.close.buy.buySell = 'S'
        this.close.sell.buySell = 'B'
        this.close.buy.orderVolume = row.buyContractVolume
        this.close.sell.orderVolume = row.sellContractVolume
        this.close.buy.copyNum = row.buyContractVolume
        this.close.sell.copyNum = row.sellContractVolume
        this.close.buy.offsetFlag = 1
        this.close.sell.offsetFlag = 1
        this.close.buy.hedgeFlag = 1
        this.close.sell.hedgeFlag = 1

        let price = 0
        // this.socketData.forEach(item => {
        //   if(item.market == row.exchange && item.code == row.underlying && item.subAccountNo == row.subAccountNo) {
        //     price = Number(item.price)
        //   }
        // })
        this.close.buy.orderPrice = price
        this.close.sell.orderPrice = price
        
        if(row.exchange == 'SHFE' || row.exchange == 'INE') { //上期所和原油中心存在平今操作,如没有历史仓则默认平今仓.有历史仓优先平历史仓
          this.close.buy.orderVolume = row.buyHistoryDayRemainCloseVolume
          this.close.sell.orderVolume = row.sellHistoryDayRemainCloseVolume
          this.close.buy.copyNum = row.buyHistoryDayRemainCloseVolume
          this.close.sell.copyNum = row.sellHistoryDayRemainCloseVolume

        }
        this.dialogVisible = true
      },
      getSocketArray(arr){
        this.socketData = arr
      },
      reload(arr){
        if(arr[0] == 'for_allCC' || arr[1] == 'for_allCC') {
          this.PositionChange()
        }
      },
      retryAllClose() {
        this.close = this.closeData
        this.enter()
      },
      enter() {
        let token = window.sessionStorage.getItem("token")
        let buyData = {
          exchange: this.close.exchange,
          underlying: this.close.underlying,
          subAccountNo: this.close.subAccountNo,
          clientId: this.close.clientId,
          clientBindId: this.close.clientBindId,
          description: this.close.description,
          buySell: this.close.buy.buySell,
          orderPrice: this.close.buy.orderPrice,
          orderVolume: this.close.buy.orderVolume,
          offsetFlag: this.close.buy.offsetFlag,
          hedgeFlag: this.close.buy.hedgeFlag,
          tradeToken: token
        }
        let sellData = {
          exchange: this.close.exchange,
          underlying: this.close.underlying,
          subAccountNo: this.close.subAccountNo,
          clientId: this.close.clientId,
          clientBindId: this.close.clientBindId,
          description: this.close.description,
          buySell: this.close.sell.buySell,
          orderPrice: this.close.sell.orderPrice,
          orderVolume: this.close.sell.orderVolume,
          offsetFlag: this.close.sell.offsetFlag,
          hedgeFlag: this.close.sell.hedgeFlag,
          tradeToken: token
        }
        if(buyData.orderVolume && sellData.orderVolume) {
          this.axios.post("client/forward/forwardorderlog/requestCloseBatch.do", this.qs.stringify(buyData)).then(result => {
            if(result == 'token' ) {
              this.closeData = this.close
              let obj = {
                id: this.id,
                type: 'AllClose'
              }
              this.dialogVisible = false
              bus.$emit("checkPass", obj)
            }
            if(result.data.success) {
              window.sessionStorage.setItem('token', result.data.FORWARD_TRADE_TOKEN)
              let sellData = {
                exchange: this.close.exchange,
                underlying: this.close.underlying,
                subAccountNo: this.close.subAccountNo,
                clientId: this.close.clientId,
                clientBindId: this.close.clientBindId,
                description: this.close.description,
                buySell: this.close.sell.buySell,
                orderPrice: this.close.sell.orderPrice,
                orderVolume: this.close.sell.orderVolume,
                offsetFlag: this.close.sell.offsetFlag,
                hedgeFlag: this.close.sell.hedgeFlag,
                tradeToken: result.data.FORWARD_TRADE_TOKEN
              }
              this.axios.post("client/forward/forwardorderlog/requestCloseBatch.do", this.qs.stringify(sellData)).then(result => {
                if(result.data.success) {
                  window.sessionStorage.setItem('token', result.data.FORWARD_TRADE_TOKEN)
                  this.$message({
                    type:"success",
                    message:"平仓请求发送成功",
                    showClose: true
                  })
                  this.dialogVisible = false
                  this.handleClose()
                }
              })
            }
          })
        }
        if(sellData.orderVolume && !buyData.orderVolume) {
          this.axios.post("client/forward/forwardorderlog/requestCloseBatch.do", this.qs.stringify(sellData)).then(result => {
            if(result == 'token' ) {
              this.closeData = this.close
              let obj = {
                id: this.id,
                type: 'AllClose'
              }
              this.dialogVisible = false
              bus.$emit("checkPass", obj)
            }
            if(result.data.success) {
              window.sessionStorage.setItem('token', result.data.FORWARD_TRADE_TOKEN)
              this.$message({
                type:"success",
                message:"平仓请求发送成功",
                showClose: true
              })
              this.dialogVisible = false
              this.handleClose()
            }
          })
        }
        if(buyData.orderVolume && !sellData.orderVolume) {
          this.axios.post("client/forward/forwardorderlog/requestCloseBatch.do", this.qs.stringify(buyData)).then(result => {
            if(result == 'token' ) {
              this.closeData = this.close
              let obj = {
                id: this.id,
                type: 'AllClose'
              }
              this.dialogVisible = false
              bus.$emit("checkPass", obj)
            }
            if(result.data.success) {
              window.sessionStorage.setItem('token', result.data.FORWARD_TRADE_TOKEN)
              this.$message({
                type:"success",
                message:"平仓请求发送成功",
                showClose: true
              })
              this.dialogVisible = false
              this.handleClose()
            }
          })
        }
        if(!buyData.orderVolume && !sellData.orderVolume) {
          this.$message({
            type:"warning",
            message:"两个平仓数量不能同时为0",
            showClose: true
          })
        }
      },
      handleClose() {
        this.dialogVisible = false
        this.close = {    
          exchange: '',
          underlying: '',
          subAccountNo: '',
          clientId: '',
          clientBindId: '',
          description: '',
          buy: {
            buySell: 'B',
            orderPrice: '',
            orderVolume: '',
            copuNum: 0,
            offsetFlag: '',
            hedgeFlag: '',
          },
          sell: {
            buySell: 'S',
            orderPrice: '',
            orderVolume: '',
            copuNum: 0,
            offsetFlag: '',
            hedgeFlag: '',
          },
        }
      },
      BuyChangeOffsetFlag(val) {
        if(val == 3 && this.row.exchange == "SHFE" || val == 3 && this.row.exchange == "INE") {
          this.close.buy.orderVolume = this.row.buyTodayDayRemainCloseVolume
          this.close.buy.copyNum = this.row.buyTodayDayRemainCloseVolume
        } else if( this.row.exchange == "SHFE" || this.row.exchange == "INE") {
          this.close.buy.orderVolume = this.row.buyHistoryDayRemainCloseVolume  
          this.close.buy.copyNum = this.row.buyHistoryDayRemainCloseVolume
        }
      },
      SellChangeOffsetFlag(val) {
        if(val == 3 && this.row.exchange == "SHFE" || val == 3 && this.row.exchange == "INE") {
          this.close.sell.orderVolume = this.row.sellTodayDayRemainCloseVolume
          this.close.sell.copyNum = this.row.sellTodayDayRemainCloseVolume
        } else if( this.row.exchange == "SHFE" || this.row.exchange == "INE") {
          this.close.sell.orderVolume = this.row.sellHistoryDayRemainCloseVolume
          this.close.sell.copyNum = this.row.sellHistoryDayRemainCloseVolume
        }
        
      },
      // 提示文字是否显示
      isShow(copyNum, offsetFlag, exchange) {
        if(!copyNum && offsetFlag == '1') {
          if(exchange == 'SHFE' || exchange == 'INE') {
            return '历史仓可平仓量为0,如需平今仓可自行切换'
          } else {
            return ''
          }
        } else {
          return ''
        }
      },

      // 处理表单数据
      changeTime(val) {
        return this.timeFormat(new Date(val), "-")
      },
      direction(open, buy) {
        let o = open == "O" ? "开" : "平"
        let b = buy == "B" ? "买" : "卖"
        return b + o
      },
      buyMab(obj){
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)
        let price = Number(obj.buyContractValue).toFixed(this.precision) * a
        let num = obj.buyContractVolume
        let mab = price * num / a
        // return mab
        return Number(obj.buyContractValue).toFixed(this.precision)
      },
      sellMab(obj){
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)
        let price = Number(obj.sellContractValue).toFixed(this.precision) * a
        let num = obj.sellContractVolume
        let mab = price * num / a
        // return mab
        return Number(obj.sellContractValue).toFixed(this.precision)
      },
      // 买持仓盈亏（浮）= 持仓手数 * 最新价 * 合约乘数 - 买期初成交价持仓市值(逐笔)
      // 卖持仓盈亏（浮）= 买期初成交价持仓市值(逐笔) - 持仓手数 * 最新价 * 合约乘数
      float(obj){
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)

        let price = 0   //实时价格
        let futuresMultiple = obj.futuresMultiple   //合约乘数

        let buyNum = obj.buyContractVolume    //买持仓数量
        let selleNum = obj.sellContractVolume   //卖持仓数量
        let buyPosition = Number(obj.buyOriginalPriceContractValue).toFixed(this.precision) * a     //买期初成交价持仓市值(逐笔)
        let sellePosition = Number(obj.sellOriginalPriceContractValue).toFixed(this.precision) * a    //卖期初成交价持仓市值(逐笔)
        // 通过标的和子账获取最新价格
        this.socketData.forEach(item => {
          if(item.market == obj.exchange && item.code == obj.underlying && item.subAccountNo == obj.subAccountNo) {
            price = Number(item.price) * a
          }
        })
        let buy = price * futuresMultiple * buyNum - buyPosition
        let sell = sellePosition - price * futuresMultiple * selleNum 
        let float = (buy + sell) / a
        return float
      },
      // 买持仓盈亏（盯市）= 最新价 * 持仓数量 * 合约乘数 - 买持仓市值(盯市)
      // 卖持仓盈亏（盯市）= 买持仓市值(盯市) - 最新价 * 持仓数量 * 合约乘数
      floatF(obj){
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)     //用于将小数转化成整数进行计算，最后再转化回来

        let price = 0   //实时价格
        let futuresMultiple = obj.futuresMultiple   //合约乘数

        let buyNum = obj.buyContractVolume    //买持仓数量
        let sellNum = obj.sellContractVolume   //卖持仓数量

        let buyContractValue = obj.buyContractValue    //买持仓市值(盯市)
        let sellContractValue = obj.sellContractValue   //卖持仓市值(盯市)
        // 通过标的和子账获取最新价格
        this.socketData.forEach(item => {
          if(item.market == obj.exchange && item.code == obj.underlying && item.subAccountNo == obj.subAccountNo) {
            price = Number(item.price) * a
          }
        })
        let buy = price * buyNum * futuresMultiple - buyContractValue
        let sell = sellContractValue - price * sellNum * futuresMultiple
        let float = (buy + sell) / a
        return float
        
      },
      // 持仓成本
      cost(obj){
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)
        let AveragePrice = 0
        let buy = obj.buyContractVolume
        let sell = obj.sellContractVolume
        let num = Math.abs(buy - sell)
        if(buy > sell) {
          AveragePrice = Number(obj.buyAveragePrice).toFixed(this.precision) * a
        } else {
          AveragePrice = Number(obj.sellAveragePrice).toFixed(this.precision) * a
        }

        let cost = AveragePrice * num / a
        return cost
      },
      // 平仓盈亏(盯)
      closeOutLoss(obj) {
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)
        let buy = Number(obj.buyTodayCloseProfit).toFixed(this.precision) * a
        let sell = Number(obj.sellTodayCloseProfit).toFixed(this.precision) * a

        let price = (buy + sell) / a
        return price
      },
      // 逐笔
      closeOutLossZ(obj) {
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)
        let buy = Number(obj.buyOriginalPriceTodayCloseProfit).toFixed(this.precision) * a
        let sell = Number(obj.sellOriginalPriceTodayCloseProfit).toFixed(this.precision) * a

        let price = (buy + sell) / a
        return price
      },
      // 净头寸持仓
      net(obj){
        let buy = obj.buyContractVolume
        let sell = obj.sellContractVolume
        let num = Math.abs(buy - sell)
        return num
      },
      changeSubNo(obj) {
        let arr = this.subNos.filter((item) => {
          return item.subAccountNo == obj.subAccountNo
        })
        return arr[0].subAccountBusinessName
      }
    },
    destroyed() {
    
    },
    watch: {

      PositionData(newValue, oldValue) {
        if (newValue.length > 0) {
          this.daochudisabled = false
          bus.$emit("changeCCFlag", false)
        } else {
          this.daochudisabled = true
          bus.$emit("changeCCFlag", true)
        }
      },

      $route: {
        handler(to, from) {
          this.dis = to.query.dis
          let user = to.query.user
          let id = to.query.id
          let sub = to.query.sub
          if (to.path == '/forwardType' && user && id && sub) {
            this.sub = to.query.sub
            this.id = to.query.id
            this.user = to.query.user
            this.PositionChange()
          } else {
            this.PositionData = []
          }
        },
        immediate: true
        
      }
    },
    props:['subNos', 'socketData']
  }

</script>

<style scoped>
.el-row {
  padding: 5px;
}
.el-row>.el-col {
  display: flex;
  align-items: center;
}
.close_hint {
  color: red;
  text-align: center;
  padding: 10px 0;
}

.cut-off {
  position: absolute;
  top: 160px;
  left: 50%;
  height: 230px;
  width: 1px;
  background: #000;
}

</style>
