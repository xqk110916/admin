<template>
  <div class="for_cc">
    <HeadBack title="查看远期持仓明细">
      <el-button @click="daochu" class="daochu" size="mini" type="primary" :disabled="daochudisabled" slot="btn"
        style="position:absolute;right:5px;top:6px;">导出持仓</el-button>
    </HeadBack>
    <el-table :data="PositionData" row-key="Index" :expand-row-keys="entexpands" border @row-click="rowExpand">
      <el-table-column type="expand" class="for_inner" :width="0">
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
              <span> {{ changeSubNo(props.row) }}</span>
            </el-form-item>
            <el-form-item label="标的进场价：">
              <span> {{ props.row.originalPrice }}</span>
            </el-form-item>
            <el-form-item label="持仓数量(手)：">
              <span> {{ props.row.positionVolume }}</span>
            </el-form-item>
            <el-form-item label="剩余可平仓量：">
              <span> {{ props.row.remainCloseVolume }}</span>
            </el-form-item>
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
      <el-table-column type="index" :width="widths[0]"> </el-table-column>
      <el-table-column label="标的代码" prop="underlying" :width="widths[1]"> </el-table-column>
      <el-table-column label="持仓数量" prop="positionVolume" :width="widths[1]"> </el-table-column>
      <el-table-column label="标的进场价" prop="originalPrice" :width="widths[1]"> </el-table-column>
      <el-table-column label="方向" :width="widths[1]">
        <template slot-scope="scope">
          <span> {{ direction(scope.row.openClose, scope.row.buySell) }} </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="widths[1]">
        <template slot-scope="scope">
          <div>
            <el-button type="danger" @click="check(scope.row)" :disabled="scope.row.status != 0 || scope.row.remainCloseVolume <= 0" size="mini">平仓</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="display:flex;justify-content:center;">
      <el-pagination @size-change="handleSizeChange" @current-change="current" :current-page.sync="page" background
        :page-size="10" layout="total, prev, pager, next" :total="total" @prev-click="prev" @next-click="next">
      </el-pagination>
    </div>

    <!-- 平仓 -->
    <el-dialog title="平仓" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" v-dialogDrag>
      <p class="dia_text">
        <span style="width:130px">标的代码:</span>
        <span> {{ close.underlying }} </span>
      </p>
      <p class="dia_text">
        <span style="width:130px">持仓编号：</span>
        <span> {{ close.contractNo }} </span>
      </p>
      <p class="dia_text"><span style="width:130px">平仓价：</span>
        <!-- <el-input v-model="close.orderPrice" size="mini"></el-input> -->
        <el-input-number v-model="close.orderPrice" controls-position="right" :min="0" size="small"></el-input-number>
      </p>
      <p class="dia_text"><span style="width:130px">平仓数量：</span>
        <!-- <el-input v-model="close.orderVolume" size="mini"></el-input> -->
        <el-input-number v-model="close.orderVolume" controls-position="right" :min="0" size="small" @change="changeOrderVolume"></el-input-number>
      </p>
      <p class="dia_text">
        <span style="width:130px">场内开平方向：</span>
        <el-select v-model="close.offsetFlag" size="mini">
          <el-option v-for="item in offsetFlagOptions" :value="item.value" :key="item.value" :label="item.label">
          </el-option>
        </el-select>
      </p>
      <p class="dia_text">
        <span style="width:130px">投机套保标识：</span>
        <el-select v-model="close.hedgeFlag" size="mini">
          <el-option v-for="item in hedgeFlagOptions" :value="item.value" :key="item.value" :label="item.label">
          </el-option>
        </el-select>
      </p>
      <p class="dia_text"><span style="width:130px">平仓描述信息：</span>
        <el-input v-model="close.description" size="mini"></el-input>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeOut">确 定</el-button>
      </span>
    </el-dialog>

    <changeToken :id="userID" @retry="retryClose" :dialogVisible="dialogPassword"></changeToken>
  </div>
</template>

<script>
  import HeadBack from '@/components/HeadBack.vue'
  import axios from '@/axios'
  import g from '@/components/Global.vue'
  import bus from '@/assets/eventBus'
  import changeToken from '@/components/changeToken.vue'
  export default {
    name: 'offer_cicang',
    data() {
      return {
        PositionData: [],
        socketData: [],
        dialogVisible: false,
        precision: 2,
        dialogPassword: false,
        subNos: [],

        close: {
          underlying: '',
          orderPrice: '',
          orderVolume: '',
          contractNo: '',
          offsetFlag: '',
          hedgeFlag: '',
          description: '',
        },
        maxOrderVolume: 1,
        closeData: {},    //用于存储由于交易密码token失效重新验证后自己平仓所用的数据


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
        precision: 2,

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
      //委托单分页
      PositionChange() {
        axios.post('client/forward/forwardcontract/queryPage.do', this.qs.stringify({
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
            this.PositionData = data.data.page.datas
            this.PositionData.forEach((item, index) => {
              item['Index'] = index
            })
            this.total = data.data.page.totalsize
          }

        })
      },
      getSocketArray(arr){
        this.socketData = arr
      },
      daochu() {
        this.postDown(`${g.baseURL}client/forward/excel/exportForwardContracts.do`, {
          'clientBindId': this.userID,
          // 'subAccountNos[]': this.sub
        })
      },
      check(row) {
        this.setDefaultClose(row).then(() => {
          this.dialogVisible = true
        })
        
      },
      // 给平仓操作赋所需的默认值
      setDefaultClose(row){
        return new Promise((reslove, reject) => {
          this.close.contractNo = row.contractNo
          this.close.underlying = row.underlying
          // this.close.orderPrice = row.price
          this.close.orderPrice = 0
          this.close.orderVolume = Number(row.remainCloseVolume)
          this.maxOrderVolume = row.remainCloseVolume   //最大平平仓数量不能超过剩余可平仓量
          this.close.offsetFlag = 1
          this.close.hedgeFlag = 1
          if(row.exchange == 'SHFE' || row.exchange == 'INE') {   //上期所和原油中心存在平今操作
            let createTime = this.timeFormat(new Date(Number(row.createTime)))
            let timeNow = this.timeFormat()   //获取现在时间判断创建时间是否为今天，如果为今天则平仓类型为今平
            if(createTime == timeNow) {
              this.close.offsetFlag = 3
            }
          }
          reslove()
        })
      },
      closeOut() {
        if (this.orderVolume == 0 || this.orderPrice == 0) {
          this.$message({
            type: "error",
            message: "平仓价和平仓数量不能为0",
            showClose: true
          })
          return
        }
        this.dialogVisible = false
        this.closeData = {}
        return new Promise((reslove, reject) => {
          axios.post('client/forward/forwardorderlog/requestClose.do', this.qs.stringify({
            clientId: this.bdObj.id,
            clientBindId: this.userID,
            closeContractNo: this.close.contractNo,
            orderPrice: this.close.orderPrice,
            orderVolume: this.close.orderVolume,
            offsetFlag: this.close.offsetFlag,
            hedgeFlag: this.close.hedgeFlag,
            description: this.close.description,
            tradeToken: window.sessionStorage.getItem("token")
          })).then(result => {
            if(result == 'token' ) {
              this.closeData = this.close
              this.dialogPassword = true
              return
            }
            if (result.data.success) {
              this.$message({
                type: "success",
                message: "平仓请求已发送",
                showClose: true,
              })
              this.PositionChange()
              if(result.data.FORWARD_TRADE_TOKEN) {
                window.sessionStorage.setItem("token", result.data.FORWARD_TRADE_TOKEN)
              }
              
            }
            // 清空弹框中的数据
            for (let item in this.close) {
              this.close[item] = ''
            }
            
          })
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
      // 继续之前的平仓操作
      retryClose(){
        this.close = this.closeData
        this.closeOut()
      },
      handleClose() {
        this.dialogVisible = false
        for (let item in this.close) {
          this.close[item] = ''
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
      HeadBack,
      changeToken
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

</style>
