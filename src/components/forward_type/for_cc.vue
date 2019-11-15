<template>
  <div>
    <div>
      <el-table :data="PositionData" border :height="250" style="width: 100%;" highlight-current-row>
        <el-table-column prop="exchange" label="交易所"> </el-table-column>
        <el-table-column prop="underlying" label="标的代码"> </el-table-column>
        <el-table-column prop="" label="买卖方向">
          <template slot-scope="scope">
            <span> {{ scope.row.buySell == "B"?"买":"卖" }} </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="多头方向"> </el-table-column> -->
        <el-table-column prop="contractNo" label="持仓编号"> </el-table-column>
        <el-table-column prop="subAccountNo" label="子账业务" :formatter="changeSubNo"> </el-table-column>
        <el-table-column prop="originalPrice" label="标的进场价"> </el-table-column>
        <el-table-column prop="positionVolume" label="持仓数量(手)"> </el-table-column>
        <el-table-column prop="remainCloseVolume" label="剩余可平仓量"> </el-table-column>
        <!-- <el-table-column prop="" label="开平方向"> 
          <template slot-scope="scope">
            <span> {{ scope.row.openClose == "O"?"开":"平" }} </span>
          </template>
        </el-table-column> -->
        <el-table-column label="持仓市值" :formatter="marketCC"> </el-table-column>
        <el-table-column label="开仓日期"> 
          <template slot-scope="scope">
            <span> {{ changeTime(scope.row.createTime) }} </span>
          </template>
        </el-table-column>
         <el-table-column label="结算日期"> 
          <template slot-scope="scope">
            <span> {{ changeTime(scope.row.expiringDate) }} </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="!dis">
          <template slot-scope="scope">
            <!-- <span style="color:red;" @click="check(scope.row.contractNo)"> 平仓 </span> -->
            <el-button type="danger" @click="check(scope.row)" :disabled="scope.row.status != 0 || scope.row.remainCloseVolume <= 0" size="mini">平仓</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <el-input-number v-model="close.orderPrice" controls-position="right" :min="1" size="small"></el-input-number>
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
  </div>
</template>

<script>
  import axios from '@/axios'
  import g from '@/components/Global.vue'
  import bus from '@/assets/eventBus'
  export default {
    name: 'for_cc',
    data() {
      return {
        sub: '',
        id: '',
        user: '',
        dis: false,   //用于代表是否是输入交易密码进入的
        PositionData: [],
        socketData: [],
        dialogVisible: false,
        precision: 2,

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

        // 页码
        page: 1,
        total: 0,
        pageSize: 50,
      }
    },
    created() {
      bus.$on("daochuCCNow", this.daochu)
      bus.$on("retryClose", this.retryClose)
      bus.$on("reload", this.reload)    //定时刷新
    },
    destroyed() {
      bus.$off("reload", this.reload)
      this.PositionData = []
    },
    methods: {
      reload(arr){
        if(arr[0] == 'for_cc' || arr[1] == 'for_cc') {
          this.PositionChange()
        } 
        
      },
      //委托单分页
      PositionChange() {
        axios.post('client/forward/forwardcontract/queryPage.do', this.qs.stringify({
          clientBindId: this.id,
          pageno: this.page,
          pagesize: this.pageSize,
          expirStatus: 0,
          'subAccountNos[]': this.sub,
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
            
            let num = this.pageSize * this.page
            if(data.data.page.totalsize > num) {
              this.pageSize = data.data.page.totalsize;
              this.PositionChange()
            }
          }

        })
      },
      daochu() {
        // window.open(`${g.baseURL}client/forward/excel/exportForwardContracts.do?clientBindId=${this.id}&subAccountNos=[${this.sub}]`)
        this.postDown(`${g.baseURL}client/forward/excel/exportForwardContracts.do`, {
          'clientBindId': this.id,
          'subAccountNos[]': this.sub,
          'expirStatus': 0,
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
          this.close.orderPrice = row.price
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
        if (this.close.orderVolume == 0 || this.close.orderPrice == 0) {
          this.$message({
            type: "error",
            message: "请输入平仓信息",
            showClose: true
          })
          return
        }
        this.dialogVisible = false
        this.closeData = {}
        return new Promise((reslove, reject) => {
          axios.post('client/forward/forwardorderlog/requestClose.do', this.qs.stringify({
            clientId: this.user,
            clientBindId: this.id,
            // tradePassword: this.close.tradePassword,
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
              let obj = {
                id: this.id,
                type: 'close'
              }
              bus.$emit("checkPass", obj)
            }
            if (result.data.success) {
              this.$message({
                type: "success",
                message: "平仓请求已发送",
                showClose: true,
              })
              setTimeout(() => {
                bus.$emit("anewGet")   //刷新页面数据
              }, 1000)
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
        let positionVolume = obj.positionVolume   //持仓手数
        let price = 0   //最新价格
        this.socketData.forEach(item => {
          if(item.market == obj.exchange && item.code == obj.underlying && item.subAccountNo == obj.subAccountNo) {
            price = Number(item.price).toFixed(this.precision) * a
            obj['price'] = price / a
          }
        })
        let cc = (futuresMultiple * positionVolume * price) / a
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
      changeOrderVolume(val){
        if(val > this.maxOrderVolume) {
          this.$message({
            type:"error",
            message:"平仓数量不能大于剩余可平仓量，请重新输入"
          })
          this.close.orderVolume = 0
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
      }
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

</style>
