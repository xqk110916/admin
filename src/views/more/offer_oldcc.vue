<template>
  <div class="for_cc">
    <HeadBack title="查看远期前收盘日持仓">
      <el-button @click="daochu" class="daochu" size="mini" type="primary" :disabled="daochudisabled" slot="btn"
        style="position:absolute;right:5px;top:6px;">导出持仓</el-button>
    </HeadBack>
    <el-table :data="PositionData" row-key="Index" :expand-row-keys="entexpands" border @row-click="rowExpand" style="width:100%;">
      <el-table-column type="expand" class="for_inner">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand cicang" style="border-top:1px solid white;">
            <el-form-item label="交易所：">
              <span> {{ props.row.exchange }}</span>
            </el-form-item>
            <el-form-item label="标的代码：">
              <span> {{ props.row.underlying }}</span>
            </el-form-item>
            <el-form-item label="买卖方向：">
              <span> {{ props.row.buySell == "B"?"买":"卖" }} </span>
            </el-form-item>
            <el-form-item label="持仓编号：">
              <span> {{ props.row.contractNo }}</span>
            </el-form-item>
            <el-form-item label="子账业务：" :formatter="changeSubNo">
              <span> {{ props.row.subAccountBusinessName }}</span>
            </el-form-item>
            <el-form-item label="标的进场价：">
              <span> {{ props.row.originalPrice }}</span>
            </el-form-item>
            <el-form-item label="持仓数量(手)：">
              <span> {{ props.row.positionVolume }}</span>
            </el-form-item>
            <!-- <el-form-item label="剩余可平仓量：">
              <span> {{ props.row.remainCloseVolume }}</span>
            </el-form-item> -->
            <el-form-item label="持仓市值：">
              <span> {{ marketCC(props.row) }}</span>
            </el-form-item>
            <el-form-item label="开仓日期：">
              <span> {{ changeTime(props.row.createTime) }} </span>
            </el-form-item>
            <el-form-item label="结算日期：">
              <span> {{ changeTime(props.row.expiringDate) }} </span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="标的代码" prop="underlying"> </el-table-column>
      <el-table-column label="持仓数量" prop="positionVolume"> </el-table-column>
      <el-table-column label="标的进场价" prop="originalPrice"> </el-table-column>
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
  import g from '@/components/Global.vue'
  import bus from '@/assets/eventBus'
  export default {
    name: 'offer_cicang',
    data() {
      return {
        PositionData: [],
        precision: 2,
        subNos: [],
        maxOrderVolume: 1,
        precision: 2,
        socketData: [],

        offsetFlagOptions: [{
            value: 1,
            label: "平仓"
          },
          {
            value: 3,
            label: "平今"
          },
          {
            value: 4,
            label: "平昨"
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

        // 页码
        page: 1,
        total: 0,
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
      PositionChange() {
        axios.post('client/forward/settleforwarddailyprofit/queryPage.do', this.qs.stringify({
          clientBindId: this.userID,
          pageno: this.page,
          pagesize: this.pageSize,
          expirStatus: 0,
          // 'subAccountNos[]': this.sub,
        })).then(data => {

          if (!data) {
            this.daochudisabled = true
            this.PositionData = []
            this.total = 1
            return
          } else {
            this.daochudisabled = false
          }
          if (data.data.success) {
            this.PositionData = []
            let arr = data.data.page.datas
            arr.forEach((item, index) => {
              let obj = Object.assign({},item, item.fc, item.sa)
              obj['Index'] = index
              item = obj
              this.PositionData.push(obj)
            })
            this.total = data.data.page.totalsize
          }

        })
      },
      getSocketArray(arr){
        this.socketData = arr
      },
      daochu() {
        this.postDown(`${g.baseURL}client/forward/excel/exportSettleForwardDailyProfits.do`, {
          'clientBindId': this.userID,
          'pageno': 1,
          'pagesize': 65000,
          // 'subAccountNos[]': this.sub
        })
      },

      marketCC(obj){
        let a = '1'
        for(let i=0;i<this.precision;i++) {
          a+=0
        }
        a = Number(a)

        let futuresMultiple = obj.futuresMultiple   //合约乘数
        let remainCloseVolume = obj.remainCloseVolume   //剩余可平仓量
        let price = 0   //最新价格
        this.socketData.forEach(item => {
          if(item.market == obj.exchange && item.code == obj.underlying && item.subAccountNo == obj.subAccountNo) {
            price = Number(item.price).toFixed(this.precision) * a
            obj['price'] = price / a
          }
        })
        let cc = (futuresMultiple * remainCloseVolume * price) / a
        return cc
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
      // changeSubNo(obj) {
      //   console.log(this.subNos)
      //   let arr = this.subNos.filter((item) => {
      //     return item.subAccountNo == obj.subAccountNo
      //   })
      //   console.log(arr)
      //   return arr[0].subAccountBusinessName
      // },

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
          width = 750 - 48
        }
        let arr = [width * 0.07, width * 0.18]
        this.widths = arr
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
      },
      PositionData(newValue, oldValue) {
        if (newValue.length > 0) {
          this.daochudisabled = false
        } else {
          this.daochudisabled = true
        }
      }
    },
  }

</script>

<style>
  .el-table__expanded-cell {
    border-bottom: 1px solid #ccc !important;
  }

  .dia_text {
    display: flex;
    margin-top: 5px;
  }

  .for_cc .cell {
    padding: 0 5px;
  }

  .for_cc .el-table {
    margin-top: 43px;
  }

  .for_cc .el-form-item {
    margin-bottom: 10px !important;
  }

  .cicang {
    padding: 0 20px;
  }

</style>