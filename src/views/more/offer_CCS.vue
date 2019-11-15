<template>
  <div id="for_chicang" class="Transactions_contrnt">
    <HeadBack title="查看远期持仓汇总">
      <!-- <el-button @click="daochu" class="daochu" size="mini" type="primary" :disabled="daochudisabled" slot="btn"
        style="position:absolute;right:5px;top:6px;">导出持仓</el-button> -->
    </HeadBack>
    <el-table :data="PositionData" row-key="Index" :expand-row-keys="entexpands" border class="cc_table" @row-click="rowExpand" style="width:100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand cicang" style="border-top:1px solid white;">
            <el-form-item prop="exchange" label="交易所：">
              <span> {{ props.row.exchange }}</span>
            </el-form-item>
            <el-form-item prop="underlying" label="标的代码：">
              <span> {{ props.row.underlying }}</span>
            </el-form-item>
            <el-form-item prop="subAccountNo" label="子账业务：" :formatter="changeSubNo">
              <span> {{ changeSubNo(props.row) }}</span>
            </el-form-item>
            <el-form-item prop="buyContractVolume" label="当前买持仓量(手)：">
              <span> {{ props.row.buyContractVolume }}</span>
            </el-form-item>
            <el-form-item prop="buyTodayOpenVolume" label="今日开仓数量(买)：">
              <span> {{ props.row.buyTodayOpenVolume }}</span>
            </el-form-item>
            <el-form-item prop="buyTodayCloseVolume" label="今日平仓数量(买)：">
              <span> {{ props.row.buyTodayCloseVolume }}</span>
            </el-form-item>
            <el-form-item prop="buyAveragePrice" label="持仓均价(买)(手)：">
              <span> {{Number(props.row.buyAveragePrice).toFixed(2)}} </span>
            </el-form-item>
            <el-form-item prop="sellContractVolume" label="当前卖持仓量(手)：">
              <span> {{ props.row.sellContractVolume }}</span>
            </el-form-item>
            <el-form-item label="净头寸持仓(手)：">
              <span> {{ net(props.row) }}</span>
            </el-form-item>
            <el-form-item prop="sellTodayOpenVolume" label="今日开仓数量(卖)：">
              <span> {{ props.row.sellTodayOpenVolume }}</span>
            </el-form-item>
            <el-form-item prop="sellTodayCloseVolume" label="今日平仓数量(卖)：">
              <span> {{ props.row.sellTodayCloseVolume }}</span>
            </el-form-item>
            <el-form-item prop="sellAveragePrice" label="持仓均价(卖)(手)：">
              <span> {{Number(props.row.sellAveragePrice).toFixed(2)}} </span>
            </el-form-item>
            <el-form-item label="持仓盈亏(浮)：" :formatter="float">
              <span> {{ float(props.row) }}</span>
            </el-form-item>
            <el-form-item label="持仓盈亏(盯)：" :formatter="floatF">
              <span> {{ floatF(props.row) }}</span>
            </el-form-item>
            <el-form-item label="平仓盈亏(逐笔)：" :formatter="closeOutLossZ">
              <span> {{ closeOutLossZ(props.row) }}</span>
            </el-form-item>
            <el-form-item label="平仓盈亏(盯)：" :formatter="closeOutLoss">
              <span> {{ closeOutLoss(props.row) }}</span>
            </el-form-item>
            <el-form-item label="持仓成本(买)：">
              <span> {{ props.row.buyOriginalPriceContractValue }}</span>
            </el-form-item>
            <el-form-item label="持仓成本(卖)：">
              <span> {{ props.row.sellOriginalPriceContractValue }}</span>
            </el-form-item>
            <!-- <el-form-item label="净头持仓成本：" :formatter="cost">
              <span> {{ cost(props.row) }}</span>
            </el-form-item> -->
          </el-form>
        </template>
      </el-table-column>
      <div class="fengexian"></div>
      <el-table-column label="标的代码" prop="underlying"> </el-table-column>
      <el-table-column label="子账业务" prop="subAccountBusinessName"> </el-table-column>
      <el-table-column label="净头寸持仓(手)" :formatter="net"> </el-table-column>
    </el-table>
    <!-- <div class="block" style="display:flex;justify-content:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="current" :current-page.sync="page" background
        :page-size="10" layout="total, prev, pager, next" :total="total" @prev-click="prev" @next-click="next">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
  import HeadBack from '@/components/HeadBack.vue'
  import axios from '@/axios'
  import bus from '@/assets/eventBus'
  export default {
    name: 'offer_cicang',
    data() {
      return {
        PositionData: [],
        subNos: [],
        socketData: [],
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

        entexpands: [], //用于实现点击整行显示数据
        widths: [], //用于存放根据浏览器窗口大小改变宽度
        precision: 2,

        // 页码
        page: 1,
        total: 10,
        pageSize: 10,
      }
    },
    created() {
      this.PositionChange()
      this.getSubNos().then(subNos => {this.subNos = subNos})
      if (window.addEventListener) {
        window.addEventListener("resize", this.reSize, true)
      } else {
        window.attachEvent("onresize", this.reSize)
      }
      this.reSize()

      bus.$on("socketArray", this.getSocketArray)
    },
    computed: {
      userID() {
        return this.$store.state.userID
      },
      bdObj() {
        return this.$store.state.bdobj
      },
    },
    methods: {
      PositionChange(val) {
        axios.post('client/forward/forwardcontract/queryTotals.do', this.qs.stringify({
          clientBindId: this.userID,
          expirStatus: 0,
          // 'subAccountNos[]': this.sub,
        })).then(data => {
          if (data.data.success) {
            this.PositionData = data.data.fcts
            let arr = data.data.fcts
            arr.forEach((item, index) => {
              item['Index'] = index
            })
          } else {
            this.PositionData = []
          }
        })
      },
      getSocketArray(arr){
        this.socketData = arr
      },
      daochu() {
        this.postDown(`${g.baseURL}client/forward/excel/exportForwardContractTotals.do`, {
          'clientBindId': this.userID,
          // 'subAccountNos[]': this.sub,
          'expirStatus': 0,
        })
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
      // 买持仓盈亏（浮）= 持仓手数 * 最新价 * 合约乘数 - 持仓市值
      // 卖持仓盈亏（浮）= 持仓市值 - 持仓手数 * 最新价 * 合约乘数
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

        let buyPosition = Number(obj.buyContractValue).toFixed(this.precision) * a     //买持仓市值
        let sellePosition = Number(obj.sellContractValue).toFixed(this.precision) * a    //卖持仓市值
        // 通过标的和子账获取最新价格
        this.socketData.forEach(item => {
          if(item.market == obj.exchange && item.code == obj.underlying && item.subAccountNo == obj.subAccountNo) {
            price = Number(item.price).toFixed(this.precision) * a
          }
        })
        let buy = price * futuresMultiple * buyNum - buyPosition
        let sell = sellePosition - price * futuresMultiple * selleNum 

        let float = (buy + sell) / a
        return float
      },
      // 买持仓盈亏 （盯）= (持仓数量 - 今开手数) * (最新价 - 昨日结算价)* 合约乘数  + (实时价格 * 今开手数 * 合约乘数 - 今开仓期初成交价市值)
      // 卖持仓盈亏 （盯）= (持仓数量 - 今开手数) * (昨日结算价 - 最新价)* 合约乘数  + (今开仓期初成交价市值 - 实时价格 * 今开手数 * 合约乘数)
      floatF(obj){
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)     //用于将小数转化成整数进行计算，最后再转化回来

        let price = 0   //实时价格
        let futuresMultiple = obj.futuresMultiple   //合约乘数

        let buyNum = obj.buyContractVolume    //买持仓数量
        let selleNum = obj.sellContractVolume   //卖持仓数量

        let buyTodayOpen = obj.buyTodayOpenVolume    //今日买开数量
        let sellTodayOpen = obj.sellTodayOpenVolume   //今日卖开数量

        let buyPosition = Number(obj.buyContractValue).toFixed(this.precision) * a     //买持仓市值
        let sellePosition = Number(obj.sellContractValue).toFixed(this.precision) * a    //卖持仓市值

        let preSettlementPrice = Number(obj.preSettlementPrice).toFixed(this.precision) * a    //前收盘价

        let buyOriginal = Number(obj.buyOpenOriginalPriceContractValue).toFixed(this.precision) * a   //今买开仓期初成交市值
        let sellOriginal = Number(obj.sellOpenOriginalPriceContractValue).toFixed(this.precision) * a   //今卖开仓期初成交市值

        // 通过标的和子账获取最新价格
        this.socketData.forEach(item => {
          if(item.market == obj.exchange && item.code == obj.underlying && item.subAccountNo == obj.subAccountNo) {
            price = Number(item.price).toFixed(this.precision) * a
          }
        })
        let buy = (buyNum - buyTodayOpen) * (price - preSettlementPrice) * futuresMultiple  + (price * buyTodayOpen * futuresMultiple - buyOriginal)
        let sell = (buyNum - buyTodayOpen) * (preSettlementPrice - price) * futuresMultiple  + (buyOriginal - price * buyTodayOpen * futuresMultiple)

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
      },

      // 将点击箭头显示事件注册为点击整行显示
      rowExpand(row, event, column) {
        Array.prototype.remove = function (val) {
          let index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };
        if (this.entexpands.indexOf(row.Index) < 0) {
          this.entexpands = [];
          this.entexpands.push(row.Index);
        } else {
          this.entexpands.remove(row.Index);
        }
      },
      // 根据窗口大小改变宽度
      reSize() {
        let dom = document.documentElement
        let width = dom.getBoundingClientRect().width
        if (width > 750) {
          width = 750
        }
        let arr = [width * 0.07, width * 0.18, width * 0.18, width * 0.18, width * 0.18]
        this.widths = arr
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
      // 分页器的事件处理函数
      current(page) {
        this.page = page
      },
      prev(page) {
        this.page = page
      },
      next(page) {
        this.page = page
      },
      handleSizeChange(page) {
        this.pageSize = page
      },
    },
    components: {
      HeadBack
    },
    watch: {
      page() {
        this.PositionChange()
      },
      pageSize() {
        this.PositionChange()
      },
      $route(to, from) {
        if (to.name == "offer_cicang") {
          this.PositionChange()
        }
      }
    },
  }

</script>

<style scoped>
  .el-table__expanded-cell {
    border-bottom: 1px solid #ccc !important;
  }

  #for_chicang {
    margin-top: 42px;
  }

  .dia_text {
    display: flex;
    margin-top: 5px;
  }
/* 
  #for_chicang .el-icon {
    display: none !important;
  } */

  #for_chicang .cell {
    padding: 0 5px;
  }

</style>
