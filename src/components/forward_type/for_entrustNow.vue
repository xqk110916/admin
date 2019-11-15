<template>
  <div class="entrustNow">
    <header class="entrustNowHeader">
      <el-select v-model="isFilterFailOrder" placeholder="是否过滤无效单" filterable clearable @change="PositionChange">
        <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
      <el-select v-model="isFilterFailOrder" filterable clearable @change="changeTableDate">
        <el-option v-for="item in ValueOptions" :key="item.value" :value="item.value" :label="item.label">
        </el-option>
      </el-select>
      <!-- <el-button type="primary" size="small" @click="PositionChange">查询</el-button> -->
    </header>
    <el-table :data="tableData" border :height="210" style="width: 100%;" highlight-current-row :row-class-name="statusClass">
      <el-table-column prop="orderNo" label="委托编号"> </el-table-column>
      <el-table-column prop="subAccountNo" label="子账业务" :formatter="changeSubNo"> </el-table-column>
      <el-table-column prop="exchange" label="交易所"> </el-table-column>
      <el-table-column prop="underlying" label="标的代码"> </el-table-column>
      <el-table-column prop="orderVolume" label="委托数量(手)"> </el-table-column>
      <el-table-column prop="orderPrice" label="委托价"> </el-table-column>
      <el-table-column label="最新价" :formatter="newPrice"> </el-table-column>
      <el-table-column prop="tradeVolume" label="成交数量"> </el-table-column>
      <el-table-column label="委托挂单数量" :formatter="guadan"> </el-table-column>
      <el-table-column prop="tradeValue" label="成交金额"> </el-table-column>
      <el-table-column label="场外开平方向">
        <template slot-scope="scope">
          <span> {{ scope.row.openClose == "O"?"开":"平" }} </span>
        </template>
      </el-table-column>
      <el-table-column label="买卖方向">
        <template slot-scope="scope">
          <span> {{ scope.row.buySell == "B"?"买":"卖" }} </span>
        </template>
      </el-table-column>
      <el-table-column label="委托来源">
        <template slot-scope="scope">
          <span> {{ scope.row.sourceType == '0'?'电话接单':'web来单' }} </span>
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
      <el-table-column label="操作" v-if="!dis">
        <template slot-scope="scope">
          <div>
            <el-button type="danger" size="mini" @click="open(scope.row.orderNo)" :disabled="scope.row.status < 0 || scope.row.status == 3">撤单</el-button>
          </div>
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
        dis: false,

        tableData: [],  
        PositionData: [],
        sockets: [],
        beginDate: '',
        endDate: '',
        orderNo: '',    //用于存储由于交易密码token失效重新验证后自己撤单所用的数据

        // 页码
        page: 1,
        total: 50,
        pageSize: 50,

        entexpands: [], //用于实现点击整行显示数据
        widths: [], //用于存放根据浏览器窗口大小改变宽度
        daochudisabled: true,
        isFilterFailOrder: 0,
        isFilterOperate: 0,
        filterFlag: false,
        

        // 转化数据
        options: [{
            value: 0,
            label: "包含无效单"
          },
          {
            value: 1,
            label: "不包含无效单"
          },
        ],
        ValueOptions: [{
          value: 0,
          label: "查看全部委托"
        }, {
          value: 1,
          label: "只查看可操作委托单"
        }],
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
      bus.$on('retryRepeal', this.retryRepeal)
      bus.$on("daochuEntrustNow", this.daochu)
      bus.$on("reload", this.reload)    //定时刷新
      bus.$on("reloadEntrust", this.reloadEntrust)    //下单成功后重新请求
      bus.$on('sockets', this.getSockets)
    },
    destroyed() {
      bus.$off("reload", this.reload)
      this.PositionData = []
    },
    computed: {
      tableFilter(){
        this.PositionData.filter( item => {
          return item.status >= 0 && item.status != 3
        }) 
      }
    },
    methods: {
      reload(arr){
        if(arr[0] == 'for_entrustNow' || arr[1] == 'for_entrustNow') {
          this.PositionChange()
        }
      },
      getSockets(sockets) {
        this.sockets = sockets
      },
      reloadEntrust(){
        this.PositionChange()
      },
      changeTableDate(val) {
        if(val) {
          this.filterFlag = true
          this.tableData = this.tableFilter
        } else {
          this.filterFlag = false
          this.tableData = this.PositionData
        }
      },
      //委托单分页
      PositionChange() {
        axios.post('client/forward/forwardorderlog/queryCurrentTradingDayPage.do', this.qs.stringify({
          clientBindId: this.id,
          pageno: this.page,
          pagesize: this.pageSize,
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
            if (data.data.page.totalsize > num) {
              this.pageSize = data.data.page.totalsize;
              this.PositionChange()
            }
          } else {
            this.PositionData = []
          }
          if(this.filterFlag) {
             this.tableData = this.tableFilter
          } else {
            this.tableData = this.PositionData
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
        // )
        this.postDown(`${g.baseURL}client/forward/excel/exportCurrentTradingDayForwardOrderLogs.do`, {
          'clientBindId': this.id,
          'subAccountNos[]': this.sub,
          'isFilterFailOrder': this.isFilterFailOrder,
        })
      },
      open(no) {
          this.$confirm('此操作将撤销该笔订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.repeal(no)
          }).catch(() => {
            this.$message({
              type:"warning",
              message:"已取消",
              showClose: true
            })
          });
        },
      // 撤单
      repeal(no) {
        this.orderNo = ''
        let orderNo = no
        let clientBindId = this.id
        
        return new Promise((reslove, reject) => {
          axios.post('client/forward/forwardorderlog/requestCancelOrder.do', this.qs.stringify({
            orderNo,
            clientBindId,
            tradeToken: window.sessionStorage.getItem("token")
          })).then(result => {
            if (result == 'token') {
              let obj = {
                id: this.id,
                type: 'repeal'
              }
              bus.$emit("checkPass", obj)
            }
            if (result.data.success) {
              this.$message({
                type: "success",
                message: "撤单请求已发送",
                showClose: true,
              })
              setTimeout(() => {
                bus.$emit("anewGet")   //刷新页面数据
              }, 1000)
              this.PositionChange()
              if (result.data.FORWARD_TRADE_TOKEN) {
                window.sessionStorage.setItem("token", result.data.FORWARD_TRADE_TOKEN)
              }

              reslove()
            }

          })
        })
      },
      // 重复之前的撤单操作
      retryRepeal(){
        this.repeal(this.orderNo)
      },
      handleClose() {
        this.dialogVisible = false
      },
      // 处理表格状态切换class类名，改变单元行颜色
      statusClass({row}){
        if(row.status > 0 ) {
          return 'success-row'
        } else if(row.status < 0) {
          return 'warning-row'
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
      newPrice(obj) {
        let underlying = obj.underlying
        let exchange = obj.exchange
        let price = ''
        this.sockets.forEach(item => {
          if(item.exchange_id == exchange && item.instrument_id == underlying) {
            price = item.price
          }
        })
        return price
      },
      guadan(obj) {
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
      }
    },

    watch: {
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
            this.tableData = []
          }
        },
        immediate: true
      },
      tableData(newValue, oldValue) {
        if (newValue.length > 0) {
          this.daochudisabled = false
          bus.$emit("changeEntrustFlag", false)
        } else {
          this.daochudisabled = true
          bus.$emit("changeEntrustFlag", true)
        }
      },
    },
    props: ['subNos']
  }

</script>

<style>
.success-row {
  background: #acf2c6 !important;
}
.warning-row {
  background: #f49a9a !important;
}
.entrustNowHeader {
  height: 40px;
}
td {
  padding: 0 !important;
}
</style>
