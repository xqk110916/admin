<template>
  <div id="chicang" class="Transactions_contrnt">
    <HeadBack title="查看前收盘持仓">
      <el-button @click="daochu" class="daochu" size="mini" type="primary" :disabled="daochudisabled" slot="btn"
        style="position:absolute;right:5px;top:6px;">导出前收盘持仓</el-button>
    </HeadBack>
    <el-table :data="PositionData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand cicang"
            v-for="(item,index) in props.row.webcontracts" :key="index" style="border-top:1px solid white;">
            <el-form-item label="合约代码：">
              <span>{{ item.underlyingNumber }}</span>
            </el-form-item>
            <el-form-item label="持仓编号：">
              <span>{{ item.productNo }}</span>
            </el-form-item>
            <el-form-item label="期权类型：">
              <span>{{ item.optionsType }}</span>
            </el-form-item>
            <el-form-item label="标的进场价：">
              <span>{{ item.underlyingPrice }}</span>
            </el-form-item>
            <el-form-item label="持仓数量：">
              <span>{{ item.volume + item.quoteUnitName }}</span>
            </el-form-item>
            <el-form-item label="可用：">
              <span>{{ item.usableVolume + item.quoteUnitName }}</span>
            </el-form-item>
            <el-form-item label="买卖方向：">
              <span>{{ item.buySell }}</span>
            </el-form-item>
            <el-form-item label="权利金：">
              <span>{{ item.premium }}</span>
            </el-form-item>
            <el-form-item label="保证金：">
              <span>{{ item.margin }}</span>
            </el-form-item>
            <el-form-item label="市价：">
              <span>{{ item.lastPrice }}</span>
            </el-form-item>
            <el-form-item label="市价损益：">
              <span>{{ item.lastPriceProfit }}</span>
            </el-form-item>
            <el-form-item label="看涨看跌">
              <span>{{ item.callPut }}</span>
            </el-form-item>
            <el-form-item label="开仓日期：">
              <span>{{ item.openDate }}</span>
            </el-form-item>
            <el-form-item label="结算日期：">
              <span>{{ item.expiringDate }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <div class="fengexian"></div>
      <el-table-column label="序号" type="index"> </el-table-column>
      <el-table-column label="持仓编号" prop="productNo"> </el-table-column>
      <el-table-column label="合约代码" prop="underlyingNumber"> </el-table-column>
      <el-table-column label="到期日" prop="expiringDate"> </el-table-column>
    </el-table>
    <div class="block" style="display:flex;justify-content:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="current" :current-page.sync="page" background
        :page-size="10" layout=" prev, pager, next" :total="total" @prev-click="prev" @next-click="next">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import HeadBack from '../components/HeadBack.vue'
  import axios from '../axios'
  export default {
    name: 'cicang',
    data() {
      return {
        PositionData: [],
        daochudisabled: false,
        // 页码
        page: 1,
        total: 10,
        pageSize: 10,
      }
    },
    created() {
      this.PositionChange()
    },
    computed: {
      userID() {
        return this.$store.state.userID
      },
    },
    methods: {
      //持仓分页
      PositionChange(val) {
        axios.post('trade/queryContract.do', this.qs.stringify({
          webClientBindId: this.userID,
          pageno: this.page,
          pagesize: this.pageSize
        })).then(data => {
          
          if (!data) {
            this.daochudisabled = true
            this.PositionData = []
            this.total = 1
            return 
          } else {
            this.daochudisabled = false
          }
          if(data.data.success) {
            this.PositionData = data.data.page.datas
            this.total = data.data.page.totalsize;
          }
          
        })
      },
      daochu() {
        window.open(`${g.baseURL}client/inner/excel/exportRepairClientContract.do?webClientBindId=${this.userID}`)
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
        console.log(to.name)
        if( to.name == 'cicang') {
          this.PositionChange()
        }
        
      }
    },
  }

</script>

<style scoped>
.el-table__expanded-cell {
  border-bottom:1px solid #ccc !important;
}

#chicang {
  margin-top: 42px;
}
</style>
