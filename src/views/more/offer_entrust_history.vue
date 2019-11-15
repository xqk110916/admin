<template>
  <div id="for_entrust" class="Transactions_contrnt">
    <HeadBack title="查看历史委托">
            <el-button @click="daochu" class="daochu" size="mini" type="primary" :disabled="daochudisabled" slot="btn"
        style="position:absolute;right:5px;top:6px;">导出</el-button>
    </HeadBack>
    <el-row style="padding: 5px 10px;">
      <el-date-picker v-model="beginDate" type="date" placeholder="请选择开始的日期" value-format="yyyyMMdd" :picker-options="pickerOptions"> </el-date-picker>
      <el-date-picker v-model="endDate" type="date" placeholder="请选择结束的日期" value-format="yyyyMMdd" :picker-options="pickerOptions"> </el-date-picker>
      <el-button type="primary" @click="PositionChange" size="mini" style="margin-left:5px;">查询</el-button>
    </el-row>
    <el-table :data="PositionData" row-key="orderNo" :expand-row-keys="entexpands" border @row-click="rowExpand" style="width:100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand cicang" style="border-top:1px solid white;">
            <el-form-item prop="orderNo" label="委托编号：">
              <span>{{ props.row.orderNo }}</span>
            </el-form-item>
            <el-form-item prop="subAccountNo" label="子账业务：">
              <span>{{ changeSubNo(props.row) }}</span>
            </el-form-item>
            <el-form-item prop="exchange" label="交易所：">
              <span>{{ props.row.exchange }}</span>
            </el-form-item>
            <el-form-item prop="underlying" label="标的代码：">
              <span>{{ props.row.underlying }}</span>
            </el-form-item>
            <el-form-item prop="orderVolume" label="委托数量(手)：">
              <span>{{ props.row.orderVolume }}</span>
            </el-form-item>
            <el-form-item prop="orderPrice" label="委托价：">
              <span>{{ props.row.orderPrice }}</span>
            </el-form-item>
            <el-form-item prop="tradeVolume" label="成交数量：">
              <span>{{ props.row.tradeVolume }}</span>
            </el-form-item>
            <el-form-item label="委托挂单数量：">
              <span>{{ guadan(props.row) }}</span>
            </el-form-item>
            <el-form-item prop="tradeValue" label="成交金额：">
              <span>{{ props.row.tradeValue }}</span>
            </el-form-item>
            <el-form-item label="场外开平方向：">
              <span> {{ props.row.openClose == "O"?"开":"平" }} </span>
            </el-form-item>
            <el-form-item label="买卖方向：">
              <span> {{ props.row.buySell == "B"?"买":"卖" }} </span>
            </el-form-item>
            <el-form-item label="委托状态：">
              <span> {{ changeStatus(props.row.status) }} </span>
            </el-form-item>
            <el-form-item label="开仓日期：">
              <span> {{ changeTime(props.row.createTime) }} </span>
            </el-form-item>
            <el-form-item label="结算日期：">
              <span> {{ changeTime(props.row.expiringDate) }} </span>
            </el-form-item>
            <el-form-item prop="statusMsg" label="错误信息：">
              <span>{{ errorMsg(props.row) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <div class="fengexian"></div>
      <el-table-column label="标的代码" prop="underlying"> </el-table-column>
      <el-table-column label="委托数量" prop="orderVolume"> </el-table-column>
      <el-table-column label="委托价" prop="orderPrice"> </el-table-column>
      <el-table-column label="方向">
        <template slot-scope="scope">
          <span> {{ direction(scope.row.openClose, scope.row.buySell) }} </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;justify-content:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="current" :current-page.sync="page" background
        :page-size="10" layout="total, prev, pager, next" :total="total" @prev-click="prev" @next-click="next">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import HeadBack from '@/components/HeadBack.vue'
  import axios from '@/axios' 
  import $ from 'jquery'
  import g from '@/components/Global.vue'
  export default {
    name: 'offer_entrust',
    data() {
      return {
        PositionData: [],
        dialogVisible: false,
        orderNo: '',
        beginDate: '',
        endDate: '',
        daochudisabled: true,
        subNos: [],
        tradingDay: '',
        precision: 2,

        // 页码
        page: 1,
        total: 10,
        pageSize: 10,

        entexpands: [],   //用于实现点击整行显示数据
        widths:[],  //用于存放根据浏览器窗口大小改变宽度

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
        },
        

        // 转化数据
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
      }
    },
    created() {
      this.getSubNos().then(subNos => { this.subNos = subNos })
      this.getPresent().then(tradingDay => {
        this.tradingDay = tradingDay
        this.getTime()
      })
      if(window.addEventListener) {
        window.addEventListener("resize",this.reSize, true)
      } else {
        window.attachEvent("onresize", this.reSize)
      }
      this.reSize()
    },
    computed: {
      userID() {
        return this.$store.state.userID
      },
    },
    methods: {
      getTime(){
        let time = this.timeFormat(new Date(Number(this.tradingDay)))
        this.beginDate = time 
        this.endDate = time
        this.PositionChange()
      },
      reload(arr){
        if(arr[0] == 'for_entrustHis' || arr[1] == 'for_entrustHis') {
          this.PositionChange()
        }
      },
      
      //委托单分页
      PositionChange() {
        axios.post('client/forward/forwardorderlog/queryPage.do', this.qs.stringify({
          clientBindId: this.userID,
          pageno: this.page,
          pagesize: this.pageSize,
          beginDate: this.beginDate,
          endDate: this.endDate,
          // 'subAccountNos[]': this.sub,
        })).then(data => {

          if (!data) {
            this.PositionData = []
            this.total = 1
            return
          }
          if (data.data.success) {
            this.PositionData = data.data.page.datas
            // this.total = data.data.page.totalsize
            // this.page = data.data.page.pageno
            let num = this.pageSize * this.page
            if(data.data.page.totalsize > num) {
              this.pageSize = data.data.page.totalsize;
              this.PositionChange()
            }
          } else {
            this.PositionData = []
          }

        })
      },
      daochu() {
        this.postDown(`${g.baseURL}client/forward/excel/exportForwardOrderLogs.do`, {
          'clientBindId': this.userID,
          'beginDate': this.beginDate,
          'endDate': this.endDate,
          // 'subAccountNos[]': this.sub
        })
      },
      handleClose() {
        this.dialogVisible = false
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
      changeoffsetFlag(val) {
        let str = ''
        this.offsetFlagOptions.forEach(item => {
          if (item.value == val) {
            str = item.label
          }
        })
        return str
      },
      changehedgeFlag(val) {
        let str = ''
        this.hedgeFlagOptions.forEach(item => {
          if (item.value == val) {
            str = item.label
          }
        })
        return str
      },
      changeMarginType(val) {
        let str = ''
        this.marginTypeOptions.forEach(item => {
          if (item.value == val) {
            str = item.label
          }
        })
        return str
      },
      guadan(obj){
        return obj.orderVolume - obj.tradeVolume
      },
      changeStatus(val) {
        let str = ''
        switch (val) {
          case 0:
            str = '委托正常（未报入）'
            break;
          case -1:
            str = '失效'
            break;
          case -2:
            str = '场内下单失败'
            break;
          case -2:
            str = '场内下单失败'
            break;
          case -3:
            str = '完全撤单'
            break;
          case -4:
            str = '部成部撤'
            break;
          case 1:
            str = '未完成'
            break;
          case 2:
            str = '报入'
            break;
          case 3:
            str = '完全成交'
            break;
          case 4:
            str = '部分成交'
            break;
          case 5:
            str = '等待撤单'
            break;
        }
        return str
      },
      changeSubNo(obj) {
        let arr = this.subNos.filter((item) => {
          return item.subAccountNo == obj.subAccountNo
        })
        return arr[0].subAccountBusinessName
      },
      errorMsg(obj) {
        if(obj.orderNo) {
          return obj.status >= 0?'':obj.statusMsg
        } else {
          return obj.failInfo
        }
      },
      // 将点击箭头显示事件注册为点击整行显示
      rowExpand(row, event, column) {
        Array.prototype.remove = function (val) {
          let index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };
        if (this.entexpands.indexOf(row.orderNo) < 0) {
          this.entexpands = [];
          this.entexpands.push(row.orderNo);
        } else {
          this.entexpands.remove(row.orderNo);
        }
      },
      // 根据窗口大小改变宽度
      reSize(){
        let dom = document.documentElement
        let width = dom.getBoundingClientRect().width
        if(width > 750) {
          width = 750
        }
        let arr = [ width * 0.07 , width * 0.18 ]
        this.widths = arr
      },

      // 检测时间，开始时间不能大于结束时间
      changeStart(val){
        let start = val.getTime()
        let end = this.endDate.getTime()
        if(start > end) {
          this.hint()
          this.flag = true
        } else {
          this.flag = false
        }
      },
      changeEnd(val){
        let start = this.beginDate.getTime()
        let end = val.getTime()
        if(start > end) {
          this.hint()
          this.flag = true
        } else {
          this.flag = false
        }
      },
       hint(){
        this.$message({
          type:"error",
          message:"开始日期不能大于结束日期，请重新选择",
          showClose: true,
        })
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
        if (to.name == "offer_entrust") {
          this.PositionChange()
        }
      },
      PositionData(newValue, oldValue){
        if(newValue.length > 0) {
          this.daochudisabled = false
        } else {
           this.daochudisabled = true
        }
      },
    },
  }

</script>

<style>
  .el-table__expanded-cell {
    border-bottom: 1px solid #ccc !important;
  }

  #for_entrust {
    margin-top: 42px;
  }


  #for_entrust .cell {
    padding: 0 5px;
  }

  .el-form-item {
    margin-right: 20px;
  }

</style>