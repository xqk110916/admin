<template>
  <div>
    <header>
      <el-date-picker v-model="beginDate" type="date" placeholder="请选择开始的日期" value-format="yyyyMMdd"> </el-date-picker>
      <el-date-picker v-model="endDate" type="date" placeholder="请选择结束的日期" value-format="yyyyMMdd"> </el-date-picker>
      <el-button type="primary" size="small" @click="PositionChange">查询</el-button>
    </header>
    <el-table :data="PositionData" border :height="210" style="width: 100%;" highlight-current-row>
      <el-table-column prop="underlying" label="标的代码"> </el-table-column>
      <el-table-column prop="contractNo" label="持仓编号"></el-table-column>
      <el-table-column prop="subAccountNo" label="子账业务" :formatter="changeSubNo"> </el-table-column>
      <el-table-column prop="orderNo" label="委托号"></el-table-column>
      <el-table-column label="买卖方向">
        <template slot-scope="scope">
          <span> {{ scope.row.buySell == "B"?"买":"卖" }} </span>
        </template>
      </el-table-column>
      <el-table-column label="场外开平方向">
        <template slot-scope="scope">
          <span> {{ scope.row.openClose == "O"?"开":"平" }} </span>
        </template>
      </el-table-column>
      <el-table-column label="成交日期">
        <template slot-scope="scope">
          <span> {{ changeTime(scope.row.tradeDate) }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="tradePrice" label="成交价"></el-table-column>
      <el-table-column prop="tradeVolume" label="成交手数"></el-table-column>
      <el-table-column label="手续费">
        <template slot-scope="scope">
          <span> {{ (Number(scope.row.closeCollectCommission).toFixed(2) * 100 + Number(scope.row.openCollectCommission).toFixed(2) * 100) / 100 }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="投机套保标识">
        <template slot-scope="scope">
          <span> {{ changehedgeFlag( scope.row.hedgeFlag ) }} </span>
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
  </div>
</template>

<script>
  import axios from '@/axios'
  import $ from 'jquery'
  import g from '@/components/Global.vue'
  import bus from '@/assets/eventBus'
  import Jq from 'jquery'
  export default {
    name: 'offer_mab',
    data() {
      return {
        sub: '',
        id: '',
        user: '',
        dis: false,

        PositionData: [],
        beginDate: new Date(),
        endDate: new Date(),
        flag: false,
        // 页码
        page: 1,
        total: 50,
        pageSize: 50,

        entexpands: [], //用于实现点击整行显示数据
        widths: [], //用于存放根据浏览器窗口大小改变宽度

        daochudisabled: true,

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
      bus.$on("daochuMab", this.daochu)
      bus.$on("reload", this.reload)    //定时刷新
    },
    destroyed() {
      bus.$off("reload", this.reload)
      this.PositionData = []
    },
    methods: {
      reload(arr){
        if(arr[0] == 'for_mab' || arr[1] == 'for_mab') {
          this.PositionChange()
        }
      },
      getTime() {
        let time = this.timeFormat(new Date())
        this.beginDate = time
        this.endDate = time
        this.PositionChange()
      },
      //成交单分页
      PositionChange(val) {
        if (this.flag) {
          this.hint()
          return
        }
        // let data = this.qs.stringify({
        //   clientBindId: this.userID,
        //   pageno: this.page,
        //   pagesize: this.pageSize,
        // })
        // let str = `&beginDate=${this.beginDate}&endDate=${this.endDate}`
        // data = data + str
        // axios.post('client/forward/forwardtrade/queryPage.do', data).then(data => {
        //   if(data.data.success) {
        //     this.PositionData = data.data.page.datas
        // let num = this.pageSize * this.page
        // if(data.data.page.totalsize > num) {
        //   this.pageSize = data.data.page.totalsize;
        //   this.PositionChange()
        // }
        //   } else {
        //     this.PositionData = []
        //     this.total = 1
        //   }

        // })
        let _this = this
        Jq.ajax({
          type: "post",
          url: `${g.baseURL}client/forward/forwardtrade/queryPage.do`,
          data: {
            clientBindId: _this.id,
            pageno: _this.page,
            pagesize: _this.pageSize,
            beginDate: _this.beginDate,
            endDate: _this.endDate,
            'subAccountNos[]': this.sub,
          },
          success(result) {
            if (result.success) {
              _this.PositionData = result.page.datas
              // _this.total = result.page.totalsize
              // _this.page = result.page.pageno
              let num = _this.pageSize * _this.page
              if (result.page.totalsize > num) {
                _this.pageSize = result.page.totalsize;
                _this.PositionChange()
              }
            } else {
              _this.PositionData = []
              _this.$message({
                type: 'error',
                message: result.errorInfo,
                showClose: true,
              })
            }
          }
        })
      },
      daochu() {
        // window.open(`${g.baseURL}client/forward/excel/exportForwardTrades.do?clientBindId=${this.id}&beginDate=${this.beginDate}&endDate=${this.endDate}&subAccountNos=${[this.sub]}`)
        this.postDown(`${g.baseURL}client/forward/excel/exportForwardTrades.do`, {
          'clientBindId': this.id,
          'beginDate': this.beginDate,
          'endDate': this.endDate,
          'subAccountNos[]': this.sub
        })
      },

      // 检测时间，开始时间不能大于结束时间
      changeStart(val) {
        let start = val.getTime()
        let end = this.endDate.getTime()
        if (start > end) {
          this.hint()
          this.flag = true
        } else {
          this.flag = false
        }
      },
      changeEnd(val) {
        let start = this.beginDate.getTime()
        let end = val.getTime()
        if (start > end) {
          this.hint()
          this.flag = true
        } else {
          this.flag = false
        }
      },
      hint() {
        this.$message({
          type: "error",
          message: "开始日期不能大于结束日期，请重新选择",
          showClose: true,
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
      changehedgeFlag(val) {
        let str = ''
        val = String.fromCharCode(val)
        this.hedgeFlagOptions.forEach(item => {
          if (item.value == val) {
            str = item.label
          }
        })
        return str
      },
      changeSubNo(obj) {
        let arr = this.subNos.filter((item) => {
          return item.subAccountNo == obj.subAccountNo
        })
        return arr[0].subAccountBusinessName
      },
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
    props:['subNos']
  }

</script>

<style scoped>
header {
  height: 40px;
}
</style>
