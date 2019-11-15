<template>
  <div id="for_mab" class="Transactions_contrnt">
    <HeadBack title="查看远期成交信息">
       <el-button @click="daochu" class="daochu" size="mini" type="primary" :disabled="daochudisabled" slot="btn"
        style="position:absolute;right:5px;top:6px;">导出</el-button>
    </HeadBack>
    <el-row style="padding: 5px 10px;">
      <el-date-picker v-model="beginDate" type="date" size="mini" placeholder="请选择开始日期" @change="changeStart" :picker-options="pickerOptions" style="width:120px;margin-left:5px;" value-format="yyyyMMdd"> </el-date-picker>
      <el-date-picker v-model="endDate" type="date" size="mini" placeholder="请选择结束日期" @change="changeEnd" :picker-options="pickerOptions" style="width:120px;margin-left:5px;" value-format="yyyyMMdd"> </el-date-picker>
      <el-button type="primary" @click="PositionChange" size="mini" style="margin-left:5px;">查询</el-button>
    </el-row>
    <el-table :data="PositionData" row-key="orderNo" :expand-row-keys="entexpands" border @row-click="rowExpand"  class="cc_table">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand cicang" style="border-top:1px solid white;">
            <el-form-item label="持仓编号:">
              <span>{{ props.row.contractNo }}</span>
            </el-form-item>
            <el-form-item label="子账标号:">
              <span>{{ props.row.subAccountNo }}</span>
            </el-form-item>
            <el-form-item label="委托号：">
              <span>{{ props.row.orderNo }}</span>
            </el-form-item>
            <el-form-item label="买卖方向:">
              <span>{{ props.row.buySell == "B"?"买":"卖" }}</span>
            </el-form-item>
            <el-form-item label="场外开平方向:">
              <span>{{ props.row.openClose == "O"?"开":"平" }}</span>
            </el-form-item>
            <el-form-item label="成交日期:">
              <span>{{ changeTime(props.row.tradeDate) }}</span>
            </el-form-item>
            <el-form-item label="成交价：">
              <span>{{ props.row.tradePrice }}</span>
            </el-form-item>
            <el-form-item label="成交手数：">
              <span>{{ props.row.tradeVolume }}</span>
            </el-form-item>
            <el-form-item label="投机套保标识：">
              <span>{{ changehedgeFlag( props.row.hedgeFlag ) }}</span>
            </el-form-item>
            <el-form-item label="手续费：">
              <span> {{ (Number(props.row.closeCollectCommission).toFixed(2) * 100 + Number(props.row.openCollectCommission).toFixed(2) * 100) / 100 }} </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <div class="fengexian"></div>
      <el-table-column label="标的代码" prop="underlying"> </el-table-column>
      <el-table-column label="成交数量" prop="tradeVolume"> </el-table-column>
      <el-table-column label="成交价" prop="tradePrice"> </el-table-column>
      <el-table-column label="方向">
        <template slot-scope="scope"> 
          <span> {{ direction(scope.row.openClose, scope.row.buySell) }} </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button type="danger" size="mini" @click="del(scope.row.orderNo)">撤单</el-button>
          </div>
        </template>
      </el-table-column> -->
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
  import Jq from 'jquery'
  export default {
    name: 'offer_mab',
    data() {
      return {
        PositionData: [],
        beginDate: '',
        endDate: '',
        flag: false,
        // 页码
        page: 1,
        total: 10,
        pageSize: 10,

        entexpands: [],   //用于实现点击整行显示数据
        widths:[],  //用于存放根据浏览器窗口大小改变宽度

        daochudisabled: true,
        subNos: [],
        precision: 2,

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
        },

        // 用于转化数据
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
      }
    },
    created() {
      this.getTime()
      this.getSubNos().then(subNos => {this.subNos = subNos})
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
        let time = this.timeFormat()
        this.beginDate = time
        this.endDate = time
        this.PositionChange()
      },
      //成交单分页
      PositionChange(val) {
        if(this.flag) {
          this.hint()
          return
        }

        let _this = this
        Jq.ajax({
          type:"post",
          url:`${g.baseURL}client/forward/forwardtrade/queryPage.do`,
          data:{
            clientBindId: _this.userID,
            pageno: _this.page,
            pagesize: _this.pageSize,
            beginDate: _this.beginDate,
            endDate: _this.endDate
          },
          success(result) {
            if(result.success) {
              _this.PositionData = result.page.datas
              _this.total = result.page.totalsize
              _this.page = result.page.pageno
            } else {
              _this.PositionData = []
              _this.$message({
                type:'error',
                message: result.errorInfo,
                showClose: true,
              })
            }
          }
        })
      },
      daochu(){
        // window.open(`${g.baseURL}client/forward/excel/exportForwardTrades.do?clientBindId=${this.userID}&beginDate=${this.beginDate}&endDate=${this.endDate}`)
        window.open(`${g.baseURL}client/forward/excel/exportForwardTrades.do?clientBindId=${this.userID}`)
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
        let start = this.timeyy(val).getTime()
        let end = this.timeyy(this.endDate).getTime()
        if(start > end) {
          this.hint()
          this.flag = true
        } else {
          this.flag = false
        }
      },
      changeEnd(val){
        let start = this.timeyy(this.beginDate).getTime()
        let end = this.timeyy(val).getTime()
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
      // 处理表单数据
      changeTime(val){
        return this.timeFormat(new Date(val), "-")
      },
      direction(open, buy) {
        let o = open == "O"?"开":"平"
        let b = buy == "B"?"买":"卖"
        return b + o
      },
      changehedgeFlag(val){
        let str = ''
        val = String.fromCharCode(val)
        this.hedgeFlagOptions.forEach(item => {
          if(item.value == val) {
            str = item.label
          }
        })
        return str
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
      $route (to , from) {
        if(to.name == "offer_mab") {
          this.getTime()    
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
  border-bottom:1px solid #ccc !important;
}

#for_mab {
  margin-top: 42px;
}

 .el-input--suffix .el-input__inner {
  padding-right:0 !important;
}
</style>