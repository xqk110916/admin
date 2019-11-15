<template>
  <div>
    <header>
      <el-date-picker v-model="beginDate" type="date" placeholder="请选择开始的日期" value-format="yyyyMMdd"> </el-date-picker>
      <el-date-picker v-model="endDate" type="date" placeholder="请选择结束的日期" value-format="yyyyMMdd"> </el-date-picker>
      <el-select v-model="isFilterFailOrder" placeholder="是否过滤无效单" filterable clearable>
          <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
          </el-option>
        </el-select>
      <el-button type="primary" size="small" @click="PositionChange">查询</el-button>
    </header>
    <el-table :data="PositionData" border :height="210" style="width: 100%;" highlight-current-row>
      <el-table-column prop="orderNo" label="委托编号"> </el-table-column>
      <el-table-column prop="subAccountNo" label="子账业务" :formatter="changeSubNo"> </el-table-column>
      <el-table-column prop="exchange" label="交易所"> </el-table-column>
      <el-table-column prop="underlying" label="标的代码"> </el-table-column>
      <el-table-column prop="orderVolume" label="委托数量(手)"> </el-table-column>
      <el-table-column prop="orderPrice" label="委托价"> </el-table-column>
      <el-table-column prop="tradeVolume" label="成交数量"> </el-table-column>
      <el-table-column label="委托挂单数量" :formatter="guadan"> </el-table-column>
      <el-table-column prop="tradeValue" label="成交金额"> </el-table-column>
      <el-table-column label="场外开平方向"> 
          <template slot-scope="scope">
            <span> {{ scope.row.openClose == "O"?"开":"平" }} </span>
          </template>
        </el-table-column>
        <el-table-column label="委托状态"> 
          <template slot-scope="scope">
            <span> {{ changeStatus(scope.row.status) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="开仓时间"> 
          <template slot-scope="scope">
            <span> {{ timestampToTime(scope.row.createTime) }} </span>
          </template>
        </el-table-column>
         <el-table-column label="结算日期"> 
          <template slot-scope="scope">
            <span> {{ changeTime(scope.row.expiringDate) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="statusMsg" label="错误信息" width="200" :formatter="errorMsg"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from '@/axios'
  import $ from 'jquery'
  import g from '@/components/Global.vue'
  import bus from '@/assets/eventBus'
  export default {
    name: 'for_entrustNow',
    data() {
      return {
        sub: '',
        id: '',
        user: '',

        PositionData: [],
        beginDate: '',
        endDate: '',

        // 页码
        page: 1,
        total: 50,
        pageSize: 50,

        entexpands: [], //用于实现点击整行显示数据
        widths: [], //用于存放根据浏览器窗口大小改变宽度
        daochudisabled: true,
        isFilterFailOrder: 0,

        // 转化数据
        options: [{
            value: 0,
            label: "包含无效单"
          },
          {
            value: 1,
            label: "不包含无效单"
          }
        ],
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
      // bus.$off("daochuEntrustHis")
      // bus.$off("reload")
      bus.$on("daochuEntrustHis", this.daochu)
      bus.$on("reload", this.reload)    //定时刷新
    },
    destroyed() {
      bus.$off("reload", this.reload)
      this.PositionData = []
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
          clientBindId: this.id,
          pageno: this.page,
          pagesize: this.pageSize,
          beginDate: this.beginDate,
          endDate: this.endDate,
          'subAccountNos[]': this.sub,
          isFilterFailOrder: this.isFilterFailOrder,
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
        // let _this = this
        // $.ajax({
        //   type:"post",
        //   url:`${g.baseURL}client/forward/forwardorderlog/queryPage.do`,
        //   data:{
        //     clientBindId: _this.id,
        //     pageno: _this.page,
        //     pagesize: _this.pageSize,
        //     beginDate: _this.beginDate,
        //     endDate: _this.endDate,
        //   },
        //   success(result) {
        //     if(result.success) {
        //       _this.PositionData = result.page.datas
        //       _this.total = result.page.totalsize
        //       _this.page = result.page.pageno
        //     } else {
        //       _this.$message({
        //         type:"error",
        //         message:result.errorInfo,
        //         showClose: true
        //       })
        //     }
        //   }
        // })
      },
      daochu() {
        // window.open(
        //   `${g.baseURL}client/forward/excel/exportForwardOrderLogs.do?clientBindId=${this.id}&beginDate=${this.beginDate}&endDate=${this.endDate}&subAccountNos=${[this.sub]}`
        //   )
        this.postDown(`${g.baseURL}client/forward/excel/exportForwardOrderLogs.do`, {
          'clientBindId': this.id,
          'beginDate': this.beginDate,
          'endDate': this.endDate,
          'subAccountNos[]': this.sub,
          isFilterFailOrder: this.isFilterFailOrder,
        })
      },

      // 撤单
      repeal(no) {
        let orderNo = no
        let clientBindId = this.id
        return new Promise((reslove, reject) => {
          axios.post('client/forward/forwardorderlog/requestCancelOrder.do', this.qs.stringify({
            orderNo,
            clientBindId,
            tradeToken: window.sessionStorage.getItem("token"),
          })).then(result => {
            if (result.data.success) {
              this.$message({
                type: "success",
                message: "撤单成功",
                showClose: true,
              })
              this.PositionChange()
              window.sessionStorage.setItem("token", result.data.FORWARD_TRADE_TOKEN)
              reslove()
            }
          })
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
    },
    watch: {
      $route: {
        handler(to, from) {
          let dis = to.query.dis
          let user = to.query.user
          let id = to.query.id
          let sub = to.query.sub
          if (to.path == '/forwardType' && user && id && sub) {
            this.sub = to.query.sub
            this.id = to.query.id
            this.user = to.query.user
            this.getTime()
          } else {
            this.PositionData = []
          }
        },
        immediate: true
      },
      PositionData(newValue, oldValue) {
        if (newValue.length > 0) {
          this.daochudisabled = false
          bus.$emit("changeEntrustFlag", false)
        } else {
          this.daochudisabled = true
          bus.$emit("changeEntrustFlag", true)
        }
      },
    },
    props:['subNos', 'tradingDay']
  }

</script>

<style scoped>
header {
  height: 40px;
}
</style>