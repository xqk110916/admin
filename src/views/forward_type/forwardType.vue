<template>
  <div id="forwardType">
    <header>
      <div class="title">
        <img src="../../public/logo.png" alt="南华资本" @click="goIndex">
      </div>
      <h4 @dblclick="dialogSubDetails = true" title="该位置只显示3条子账，如最后显示省略号则代表有部分子账没有显示完全，如需全部子账业务，可以双击该段文字进行查看。">{{title}}</h4>
      <p style="font-size:12px;">{{ userName }}</p>
      <div class="hint">
        <el-button type="primary" size="mini" @click="back">重选远期业务</el-button>
        <el-button type="primary" size="mini" @click="dialogVisible = true">提示信息</el-button>
      </div>
    </header>
    <div class="content">
      <nav>
        <left_exchange></left_exchange>
      </nav>
      <section>
        <for_content @newPrice="getNewPrice" @get:forwardconfig="getForward"></for_content>
      </section>
      <section>
        <right_details :configs="forwardconfigs"></right_details>
      </section>
      
    </div>
    <div class="cc">
      <div class="head">
        <span style="padding: 0 10px;margin-left:5px;" @click="all" :class="[iscc == 'for_cc'?'':'active']">当前合约持仓汇总</span>
        <span style="padding: 0 10px;margin-left:5px;" @click="details" :class="[iscc == 'for_cc'?'active':'']">当前合约持仓明细</span>
        <el-button type="primary" @click="daochuCC" size="mini" style="float:right;margin-top:1px;" :disabled="daochuCCFlag">导出</el-button>
      </div>
      <component :is="iscc" :subNos="subNos" :socketData="socketData"></component>

    </div>
    <div class="entrust">
      <div class="head">
        <span style="padding: 0 10px;margin-left:5px;" @click="entrustNow" :class="[isentrust == 'for_entrustNow'?'active':'']">当前委托</span>
        <span style="padding: 0 10px;margin-left:5px;" @click="entrustHis" :class="[isentrust == 'for_entrustHis'?'active':'']">历史委托</span>
        <span style="padding: 0 10px;margin-left:5px;" @click="mab" :class="[isentrust == 'for_mab'?'active':'']">成交信息</span>
        <el-button type="primary" @click="daochuEntrust" size="mini" style="float:right;margin-top:1px;" :disabled="daochuEntrustFlag">导出</el-button>
      </div>
      <component :is="isentrust" :subNos="subNos" :tradingDay="tradingDay"></component>
      
    </div>

    <!-- dialog -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handlerClose">
        <p style="text-align:center;">操作提示：</p>
        <p v-if="dis">0、标题只显示三个子账，如你所有的子账多余三个。可双击查看全部子账。(只会在不需要交易的情况下显示多个子账)</p>
        <p>1、在输入框中输入代码后按回车键即可进行精确查询</p>
        <P>2、鼠标双击即可进行快速下单</P>
        <P>3、鼠标右键点击即可快速加入自选</P>
        <p>4、页面每1分钟会自动刷新数据，如果刷新时你正在进行下单/平仓/撤单操作，这个是取得值是动态的</p>
        <p>5、如果你想看到最新的数据，可以重复点击已选中的标签</p>
        <p style="text-align:center;">字段解释与计算公式</p>
        <P>6、持仓明细中：持仓市值 = 持仓手数 * 合约乘数 * 最新价</P>
        <P>7、浮动盈亏是总的浮动盈亏。买 + 卖 </P>
        <p> 7.1、买持仓盈亏（浮）= 持仓手数 * 最新价 * 合约乘数 - 买期初成交价持仓市值(逐笔) </p>
        <p> 7.2、卖持仓盈亏（浮）= 买期初成交价持仓市值(逐笔) - 持仓手数 * 最新价 * 合约乘数 </p> 
        <p> 7.3、买持仓盈亏（盯市）= 最新价 * 持仓数量 * 合约乘数 - 买持仓市值(盯市) </p>
        <p> 7.4、卖持仓盈亏（盯市）= 买持仓市值(盯市) - 最新价 * 持仓数量 * 合约乘数 </p> 
        <!-- <p>8、净头持仓成本 = 多头与空头之间的轧差 * 持仓均价(多边均价)</p> -->
        <p>8、平仓盈亏是总的盈亏</p>
        <p>9、成交信息中手续费显示的是总的手续费（平仓+开仓），该手续费只有历史单才会有</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 验证交易密码 -->
      <el-dialog title="请输入交易密码" :visible.sync="dialogPassword" width="50%" :before-close="handlerClose">
        <el-input v-model="tradePassword" type="password" placeholder="请输入交易密码" @keyup.native.enter="checkPass"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkPass">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 查看全部子账 -->
      <el-dialog title="查看全部子账" :visible.sync="dialogSubDetails" width="50%" :before-close="handlerClose">
        <p> {{ allTitle }} </p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogSubDetails = false">确 定</el-button>
        </span>
      </el-dialog>
  </div> 
</template>

<script>
import left_exchange from '@/components/forward_type/left_exchange'
import right_details from '@/components/forward_type/right_details'
import for_content from '@/components/forward_type/for_content'
import for_cc from '@/components/forward_type/for_cc'
import for_allCC from '@/components/forward_type/for_allCC'
import for_entrustNow from '@/components/forward_type/for_entrustNow'
import for_entrustHis from '@/components/forward_type/for_entrustHis'
import for_mab from '@/components/forward_type/for_mab'

import bus from '@/assets/eventBus'
import axios from '@/axios'
import { Base64 } from 'js-base64'
export default {
  name:'forwardType',
  data(){
    return {
      dialogVisible: false,
      iscc: 'for_allCC',
      isentrust: 'for_entrustNow',
      daochuEntrustFlag: true,
      daochuCCFlag: true,
      daochuMabFlag: true,
      dialogPassword: false,
      dialogSubDetails: false,
      tradePassword: '',
      ids: '',
      type:'',  //用于区别是下单还是平仓还是撤单
      title: '远期业务',
      allTitle: '',
      subNos: [],
      time: 30000,  //页面定时刷新时间
      timer: '',
      socketData: [],   //从content组件中获取最新价格用于实时计算
      tradingDay: '',
      userName: '',   //当前线下账户名称
      forwardconfigs: [],   //远期配置

      sub: '',
      id: '',
      user: '',
      dis: '',
    }
  },
  destroyed() {
    
  },
  created(){
    // this.getSubNos()

    bus.$on("changeCCFlag", this.changeCCFlag)
    bus.$on("changeEntrustFlag", this.changeEntrustFlag)
    bus.$on("checkPass", this.changeToken)
    bus.$on("anewGet", this.anewGet)    //平仓或撤单成功后刷新界面

  },
  methods: {
    periodic(){
      this.timer = setTimeout(() => {
        this.reload().then(() => {
          this.periodic()
        })
      }, this.time)
    },
    reload(){
      return new Promise((reslove, reject) => {
        let active = [this.iscc, this.isentrust]
        bus.$emit('reload',active)
        reslove()
      })
    },
    anewGet(){
      clearTimeout(this.timer)
      this.reload()
      this.periodic()
    },
    // 从content组件中获取最新价格用于实时计算
    getNewPrice(arr){
      this.socketData = arr
    },
    getForward(arr){
      this.forwardconfigs = arr
    },
    handlerClose(){
      this.dialogVisible = false
      this.dialogPassword = false
      this.dialogSubDetails = false
      this.tradePassword = ''
    },
    details(){
      if(this.iscc == 'for_cc') {
        this.anewGet()
      }
      this.iscc = 'for_cc'
    },
    all(){
      if(this.iscc == 'for_allCC') {
        this.anewGet()
      }
      this.iscc = 'for_allCC'
    },
    entrustNow(){
      if(this.isentrust == 'for_entrustNow') {
        this.anewGet()
      }
      this.isentrust = 'for_entrustNow'
    },
    entrustHis(){
      if(this.isentrust == 'for_entrustHis') {
        this.anewGet()
      }
      this.isentrust = 'for_entrustHis'
    },
    mab(){
      if(this.isentrust == 'for_mab') {
        this.anewGet()
      }
      this.isentrust = "for_mab"
    },
    daochuEntrust(){
      if(this.isentrust == 'for_entrustNow') {
        bus.$emit('daochuEntrustNow')
      } else if(this.isentrust == 'for_entrustHis') {
        bus.$emit('daochuEntrustHis')
      } else if(this.isentrust == "for_mab") {
        bus.$emit("daochuMab")
      }
    },
    daochuCC(){
      if(this.iscc == 'for_cc') {
        bus.$emit('daochuCCNow')
      } else {
        bus.$emit('daochuCCAll')
      }
    },
    changeCCFlag(flag){
      this.daochuCCFlag = flag
    },
    changeEntrustFlag(flag){
      this.daochuEntrustFlag = flag
    },
    changeDaochuMab(flag) {
      this.daochuMabFlag = flag
    },
    changeToken(params){
      let {id, type} = params
      this.dialogPassword = true
      this.ids = id
      this.type = type  
    },
    changeTitle(){
      let str = ''
      let allStr = ''
      let flag = true
      this.subNos.forEach((item, index) => {
        if(this.sub) {
          if(item.subAccountNo == this.sub) {
            str = item.subAccountBusinessName
          }
        } else {
          if(index < 3) {
            str += item.subAccountBusinessName + '、'
            flag = false
          }
        }
        allStr += item.subAccountBusinessName + '、'
      })
      
      if(!flag) {
        str += '...'
      }
      this.title = "远期业务(" + str + ")"
      this.allTitle = allStr
    },
    back(){
      this.$router.replace("/more?reselection=true")
    },
    goIndex(){
      this.$router.replace('/')
    },
    checkPass() {
      axios.post("clientbind/checkTradePassword.do", this.qs.stringify({
        clientBindId: this.ids,
        tradePassword: Base64.encode(this.tradePassword)
      })).then(result => {
        if(result.data.success) {
          window.sessionStorage.setItem("token", result.data.FORWARD_TRADE_TOKEN)
          // window.sessionStorage.setItem("token", "Bearer " + result.data.FORWARD_TRADE_TOKEN)
          this.dialogPassword = false
          this.tradePassword = ''
          // 重新验证过交易密码后重复之前的操作
          switch(this.type) {
            case 'xiadan':
              bus.$emit('retryPay')
              break;
            case 'close':
              bus.$emit('retryClose')
              break;
            case 'repeal':
              bus.$emit('retryRepeal')
              break;
            case 'AllClose':
              bus.$emit('retryAllClose')
          }
        }
      })
    },
    getSubNos(){
      axios.post('client/inner/subaccount/queryAll.do').then(result => {
        if(result.data.success) {
          this.subNos = result.data.subAccountInfos
          this.changeTitle()
        }
      })
    },
    getPresent() {     //获取最近交易日
      axios.post('client/inner/businessinfo/query.do').then(result => {
        if(result.data.success) {
          let info = result.data.businessInfo
          let tradingDay = info.tradingDay  
          this.tradingDay = tradingDay
        }
      })
    },
    getUser() {   //获取该账号下的线下账户集合
      return new Promise((reslove, reject) => {
        axios.post('client/queryClientBinds.do').then(result => {
          if (result.data.success) {
            let arr = result.data.clientBindsList
            this.userName = ''    //当前交易的线下账户名称
            arr.forEach(item => {
              if(item.id == this.id) {
                this.userName = item.companyNameInner
              }
            })
            reslove()
          }
        })
      })   
    },
    clear(){
      if(this.timer) {
        clearTimeout(this.timer)
      }
    }
  },
  components: {
    left_exchange,
    right_details,
    for_content,
    for_cc,
    for_allCC,
    for_entrustNow,
    for_entrustHis,
    for_mab,
  },
  watch: {
    $route:{
      handler(to, from) {
        if(to.path == "/forwardType") {
          this.sub = to.query.sub
          this.id = to.query.id
          this.user = to.query.user
          this.dis = to.query.dis
          this.getSubNos()
          this.getPresent()
          this.getUser()
          if(this.sub && this.id) {
            console.log("开启定时器")
            // 定时刷新数据
            this.periodic()
          }
        } else {
          this.clear()
        }
      },
      immediate: true
    },
  },
  destroyed() {
    this.clear()
    console.log('清除定时器')
  },
}
</script>

<style>
#forwardType>header {
  height: 45px;
  font-size: 18px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  box-shadow:1px 1px 1px #ddd;
  margin-bottom: 5px;
  position: relative;
}

#forwardType>header>.title {
  position: absolute;
  left: 10px;
  top: 0;
  height: 40px;
}
#forwardType>header>.title>img {
  height: 40px;
}



#forwardType .content {
  height: 300px;
  margin: 0;
  padding: 0;
}

#forwardType>.content nav {
  padding: 5px;
  border: 1px solid #ddd;
  float: left;
  height: 300px;
}

#forwardType>.content section {
  height: 300px;
  float: left;
}

#forwardType>.content>.right_detail {
  width: 400px;
  height: 300px;
  float: left;
}

#forwardType .hint {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

#forwardType .cc {
  margin-top: 10px;
}

#forwardType .head {
  background: #005780;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #fff;
}
#forwardType .head .active {
  color: #e84784;
}
#forwardType .head span {
  cursor: pointer;
}

#forwardType .mab .head {
  text-align: center;
}

#forwardType .entrust {
  height: 250px;
}
#forwardType .mab {
  height: 250px;
  margin-top: 40px;
}
#forwardType td {
  padding: 0 !important; 
}

#forwardType .current-row > td {
  background: #409EFF !important;
}

</style>
