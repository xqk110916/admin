<template>
  <div>
    <!-- 下单弹框 -->
    <Modal title="远期下单" v-model="drawerModal" :footer-hide="true" class-name="vertical-center-modal">
      <Row>
        <Col span="12" class="modal-row">
        <p>挂扣标的</p>
        <p> {{ entrust.underlying }} </p>
        </Col>
        <Col span="12" class="modal-row">
        <p>交易所</p>
        <p>{{ entrust.exchange }}</p>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>子账业务</p>
        <!-- <p>{{ entrust.subAccountNo }}</p> -->
        <p>{{ changeSub(sub) }}</p>
        </Col>
        <Col span="12" class="modal-row">
        <p>场内开平方向</p>
        <p class="sele-p">
          <el-select v-model="entrust.offsetFlag" size="mini" disabled>
            <el-option v-for="item in offsetFlagOptions" :value="item.value" :key="item.value" :label="item.label">
            </el-option>
          </el-select>
        </p>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>投机套保标识</p>
        <el-select v-model="entrust.hedgeFlag" size="mini">
          <el-option v-for="item in hedgeFlagOptions" :value="item.value" :key="item.value" :label="item.label">
          </el-option>
        </el-select>
        </Col>
        <Col span="12" class="modal-row">
        <p>到期日期</p>
        <el-date-picker v-model="entrust.expiringDate" type="date" placeholder="选择到期日期" size="mini" @change="detection"
          :picker-options="pickerOptions">
        </el-date-picker>
        </Col>
      </Row>
      <Row>
        <Col span="12" class="modal-row">
        <p>委托价</p>
        <p class="sele-p">
          <!-- <InputNumber v-model="entrust.orderPrice"></InputNumber> -->
          <el-input v-model="entrust.orderPrice"></el-input>
        </p>
        </Col>
        <Col span="12" class="modal-row">
        <p>委托数量(手)</p>
        <InputNumber v-model="entrust.orderVolume" :min="0" :max="maxOrderVolume" v-focus> </InputNumber>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
        <div class="enter" @click="buy"> 买入 </div>
        </Col>
        <Col :span="12">
        <div class="enter" @click="sell"> 卖出 </div>
        </Col>
      </Row>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import bus from '@/assets/eventBus'
  import axios from '@/axios'
  import global_ from '@/components/Global'
  import Jq from 'jquery'
  export default {
    name: "xiadan",
    data() {
      return {
        datas: [],
        subNos: [],
        sub: '',
        userID: '',
        bdID: '',
        ForwardConfigs: [],
        drawerModal: false,
        restDay: [],
        // 下委托单数据
        entrust: {
          clientId: '',
          clientBindId: '',
          // tradePassword: '',
          // openClose: '',
          buySell: '',
          exchange: '',
          underlying: '',
          subAccountNo: '',
          startingDate: '',
          expiringDate: '',
          orderDate: '',
          orderPrice: 0,
          orderVolume: 0,
          offsetFlag: '',
          hedgeFlag: '',
          days: '',
          yearTradeDays: '',

        },
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
        maxDate: '', //用于判断选择结束日期是否大于最晚日期
        maxOrderVolume: 0, //用于判断下单量是否大于最大下单量
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now()
            // return this.getTime() < 
          },
        },
        orderFlag: true,
        dialogVisible: false,
        payData: {}, //用于存储下单数据，防止token过期后下单输入密码后自动下单
      }
    },
    created() {
      bus.$on("xiadan", this.order)
      bus.$on('retryPay', this.retryPay)
      bus.$on('restDay', this.restData)
    },
    methods: {
      getAll() {
        return new Promise((reslove, reject) => {
          axios.post('client/inner/forwardconfig/queryAll.do').then(result => {
            if (result.data.success) {
              let arr = result.data.ForwardConfigs
              this.ForwardConfigs = arr
              arr.forEach(item => {
                if (item.subAccountNo == this.sub) {
                  this.datas.push(item)
                }
              })
              reslove()
            }
          })
        })
      },
      getSubNos() {
        return new Promise((reslove, reject) => {
          axios.post('client/inner/subaccount/queryAll.do').then(result => {
            if (result.data.success) {
              this.subNos = result.data.subAccountInfos
            }
          })
        })
      },
      restData(arr){
        if(!arr.length) return
        this.restDay = arr
      },


      // 下委托单
      buy() {
        if (!this.entrust.orderVolume || !this.entrust.orderPrice) {
          this.$message({
            type: "error",
            message: "请输入委托数量",
            showClose: true,
          })
          return
        }
        if (!this.entrust.expiringDate) {
          this.$message({
            type: "error",
            message: "请选择到期日期",
            showClose: true,
          })
          return
        }
        this.entrust.buySell = "B"
        this.drawerModal = false
        this.weituo()
      },
      sell() {
        if (!this.entrust.orderVolume || !this.entrust.orderPrice) {
          this.$message({
            type: "error",
            message: "请输入委托数量",
            showClose: true,
          })
          return
        }
        if (!this.entrust.expiringDate) {
          this.$message({
            type: "error",
            message: "请选择到期日期",
            showClose: true,
          })
          return
        }
        this.entrust.buySell = "S"
        this.drawerModal = false
        this.weituo()
      },
      setEntrustDefault(item) {
        return new Promise((reslove, reject) => {
          this.entrust.exchange = item.market
          this.entrust.underlying = item.code
          this.entrust.clientId = this.bdID
          this.entrust.clientBindId = this.userID
          this.entrust.subAccountNo = this.sub
          this.entrust.orderPrice = item.price
          this.entrust.startingDate = this.getNext() //获取交易日
          this.entrust.expiringDate = new Date(Number(item.expiringDate))
          this.entrust.orderDate = this.getNext() //获取交易日
          this.entrust.yearTradeDays = item.yearTradeDays
          this.entrust.hedgeFlag = 1
          this.entrust.offsetFlag = 0

          this.entrust.days = 0   //现默认选择最远到到期日，故days赋值为0
          this.maxDate = new Date(Number(item.expiringDate)) //将得到的最远到期日存起来方便校验
        })

      },
      weituo() {
        let token = window.sessionStorage.getItem('token')
        let data = {}
        for (let item in this.entrust) { //如因交易密码失效导致的下单失败，会将其数据拷贝一份
          this.payData[item] = this.entrust[item]
        }
        for (let item in this.entrust) {
          data[item] = this.entrust[item]
        }
        data["tradeToken"] = token
        let _this = this
        _this.drawerModal = false
        return new Promise((reslove, reject) => {
          Jq.ajax({
            type: "post",
            url: `${global_.baseURL}client/forward/forwardorderlog/doAdd.do`,
            data,
            success(result) {
              // 请求成功后清除其数据

              if (result.success) {
                reslove()
                _this.$message({
                  type: "success",
                  message: "下单请求已发送",
                })
                setTimeout(() => {
                  bus.$emit("reloadEntrust")
                }, 1000)
                
                if (result.FORWARD_TRADE_TOKEN) {
                  window.sessionStorage.setItem("token", result.FORWARD_TRADE_TOKEN)
                }

              } else {
                _this.$message({
                  type: "error",
                  message: result.errorInfo,
                  showClose: true
                })
                if (result.errorNo == 11056) {
                  let obj = {
                    id: _this.userID,
                    type: 'xiadan'
                  }
                  bus.$emit("checkPass", obj)
                  return
                }
              }
              for (let item in _this.entrust) {
                _this.entrust[item] = 0
              }
            }
          })
        })
      },
      retryPay() {
        this.entrust = this.payData
        this.weituo()
      },
      order(item) {
        this.setEntrustDefault(item)
        this.drawerModal = true
        this.maxOrderVolume = item.maxOrderVolume
      },
      // 获取下一个交易日（默认传入当天），
      getNext(time = new Date()) {
        let day = this.timeFormat(time)
        let one = 1000 * 60 * 60 * 24
        let restDay = this.restDay
        let week = time.getDay()
        if (week == 6 || week == 0) {
          let sj = time.getTime() + one
          this.getNext(sj)
          return
        }
        for (let i = 0; i < restDay.length; i++) {
          if (restDay[i] == day) {
            let sj = time.getTime() + one
            this.getNext(sj)
            return
          }
        }
        return time //结果为格林威治时间
      },
      // 检测时间是否大于最远交易日
      detection(val) {
        let max = this.maxDate.getTime()
        let maxDate = this.timeFormat(this.maxDate, '-')
        let active = val.getTime()
        if (active > max) {
          this.$message({
            type: "error",
            message: `你所选的时间已超过最远交易日${maxDate}`,
          })
          this.entrust.expiringDate = this.maxDate
          this.entrust.days = 0
        } else {
          this.calDays(val)
        }
      },
      // 计算间隔日期
      calDays(val){
        let restDay = this.restDay
        let big = Number(this.timeFormat(this.maxDate))
        let small = Number(this.timeFormat(val))
        let arr = []
        restDay.forEach(item => {
          if (Number(item) < big && Number(item) > small) {
            arr.push(item)
          }
        })
        let c = this.getRestDays(active, max)
        let num = (max - active) / 1000 / 60 / 60 / 24
        this.entrust.days = num - arr.length - c
      },
      // 计算星期天
      getRestDays(bd, ed) {
        var d1 = new Date(bd),
          d2 = new Date(ed);
        var dateSpan = d2 - d1;
        var days = parseInt(dateSpan / (24 * 3600 * 1000)) + 1; //计算两个日期间的天数差，加1是为了把起始日期计算在内
        var weeks = parseInt(days / 7, 10);
        var result = weeks * 2;
        if (days % 7 > 0) {
          var leftdays = days % 7;
          var week1 = d1.getDay(); //周日=0，周一=1，依次。。       
          if (week1 == 0) //如果第一个日期从周日开始，剩余天数不足一周（7天）
          {
            result += 1;
          } else if (week1 + leftdays > 7) //如果第一个日期从周一到周六，加上剩余天数大于7，表示包含周六和周日，所以有两天
          {
            result += 2;
          } else if (week1 + leftdays == 7) //如果刚好到周六，有一天休息日
          {
            result += 1;
          }
        }
        return result;
      },
      handleClose() {
        this.dialogVisible = false
      },
      // 转化子账
      changeSub(val) {
        let str = ''
        this.subNos.forEach(item => {
          if (item.subAccountNo == val) {
            str = item.subAccountBusinessName
          }
        })
        return str
      },
    },
    watch: {
      $route: {
        handler(to, from) {
          if (to.path == '/forwardType') {
            this.sub = to.query.sub
            this.userID = to.query.id
            this.bdID = to.query.user
            this.getAll()
            this.getSubNos()
          }
        },
        immediate: true
      }
    },
  }

</script>

<style>
  .app {
    position: relative;
    width: 100%;
    max-width: 750px;
    min-width: 320px;
    margin: 0 auto;
    padding-top: 4.25rem;
    padding-bottom: 2.5rem;
    border-left: 1px solid #f2f2f2;
    border-right: 1px solid #f2f2f2;
  }

  .top {
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100%;
    max-width: 750px;
    height: 2rem;
    line-height: 2rem;
    padding-left: 5px;
    background-color: white;
    border-bottom: 1px solid #ccc;
    box-shadow: 1px 1px 1px #ddd;
  }

  .enter {
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    background: #f00;
    border-radius: 5px;
    text-align: center;
    color: #fff;
    font-size: 20px;
    margin: 10px;
  }


  .market {
    position: fixed;
    top: 2rem;
    z-index: 1;
    height: 2.25rem;
    line-height: 2.25rem;
    background-color: white;
    width: 100%;
    max-width: 750px;

  }

  .market span {
    display: block;
    float: left;
    width: 20%;
    text-align: center;
    border-bottom: 1px solid #ccc;
  }

  .claecla {
    height: calc(100% - 4.25rem);
  }

  .code {
    height: 2rem;
    max-height: 2rem;
    overflow: hidden;
    line-height: 2rem;
    width: 100%;
    border-bottom: 1px solid #eee;
  }

  .code span {
    color: #515a6e;
    display: block;
    float: left;
    width: 20%;
    text-align: center;

    border-bottom: 1px solid #eee;
  }

  .red {
    color: #e75563 !important;
  }

  .green {
    color: #16d397 !important;
  }

  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: -260px;
  }

  .vertical-center-modal .ivu-modal {
    top: 0;
  }

  .modal-row {
    padding-bottom: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    height: 3rem;
    line-height: 1rem;
  }

  .modal-row .sele-p {
    padding: 0 10px;
  }

  .modal-buy {
    padding: 5px;
    text-align: center;
    color: white;
    background-color: rgb(217, 84, 79);
    border-radius: 5px
  }

  .modal-sale {
    padding: 5px;
    text-align: center;
    color: white;
    background-color: rgb(91, 184, 93);
    border-radius: 5px
  }

  .el-date-editor {
    max-width: 120px;
  }
  .el-date-editor .el-input__inner {
    padding-right:0;
  }

</style>
