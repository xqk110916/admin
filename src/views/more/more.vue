<template>
  <div class="more">
    <header>
      <p>更多</p>
    </header>
    <div class="content">
      <router-link to="/ConsultPrice" tag="p"> 询价 </router-link>
      <p @click="forward">远期业务</p>
      <!-- <router-link to="/forward" tag="p"> 远期交易配置信息 </router-link> -->
    </div>

    <BottonTab></BottonTab>

    <!-- dialog -->
    <div>
      <el-dialog title="远期业务" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
        <div class="gotoDia">
          <p>
            <span>子账业务：</span>
            <el-select v-model="account" placeholder="请选择你需要查看的子账" size="mini" @change="changeSub">
              <el-option v-for="item in subOptions" :key="item.value" :value="item.value" :label="item.name"></el-option>
            </el-select>
          </p>
          <p>
            <span>线下账户：</span>
            <el-select v-model="clientBindId" placeholder="请选择你需要进行交易的线下账户" size="mini" :disabled="!account">
              <el-option v-for="item in clientOptions" :key="item.id" :value="item.id" :label="item.companyNameInner"></el-option>
            </el-select>
          </p>
          <p>
            <span>交易密码：</span>
            <el-input v-model="tradePassword" type="password"  placeholder="请输入交易密码" size="small" style="width:193px;" @keyup.native.enter="goTo"></el-input>
          </p>
          <p style="color:red;margin-top:15px;">注意：如您不进行交易，仅仅只是查看报价可通过左下角的按钮直接进入，不需要选择和输入任何数据。</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="direct" size="mini" style="float:left;">不交易直接进入</el-button>
          <el-button @click="handleClose" size="mini">取 消</el-button>
          <el-button type="primary" @click="goTo" size="mini">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import BottonTab from '../../components/BottonTab'
  import axios from '../../axios'
  import { Base64 } from 'js-base64'

  export default {
    name: 'more',
    data() {
      return {
        dialogVisible: false,
        account: '',
        subOptions: [],
        clientOptions: [],
        subNoArr: [],
        // BDdatas:[],
        userData: [],
        tradePassword: '',
        clientBindId: '',
        id:'',   //登陆账号的ID
      }
    },
    created() {
      // this.getSubNo().then(() => {
      //   this.getAll()
      // })
      // this.getUserData()
      // this.getUserName()
    },
    methods: {
      forward() {
        this.dialogVisible = true
      },
      getAll() {
        return new Promise((reslove, reject) => {
          axios.post('client/inner/forwardconfig/queryAll.do').then(result => {
            if(result.data.success) {
              this.subOptions = []
              let arr = result.data.ForwardConfigs
              let subNo = []
              arr.forEach(item => {
                subNo.push(item.subAccountNo)
              })
              subNo = [...new Set(subNo)]
              subNo.forEach(no => {
                 this.subNoArr.forEach(item => {
                  if(no == item.value) {
                    let obj = {
                      value: no,
                      name: item.name
                    }
                    this.subOptions.push(obj)
                  }
                })
              })
              reslove()
            }
          })
        })
      },
      getSubNo() {
        this.subNoArr = []
        return new Promise((reslove, reject) => {
          axios.post('client/inner/subaccount/queryAll.do').then(result => {
            if (result.data.success) {
              let arr = result.data.subAccountInfos
              arr.forEach(item => {
                let obj = {
                  value: item.subAccountNo,
                  label: item.subAccountName,
                  name: item.subAccountBusinessName,
                }
                this.subNoArr.push(obj)
              })
            }
            reslove()
          })
        })
      },
      getUserData(){
        return new Promise((reslove, reject) => {
          axios.post('client/queryClientBinds.do').then(result => {
            if(result.data.success) {
              this.userData = result.data.clientBindsList
              reslove()
            }
          })
        })
      },
      getUserName(){
        return new Promise((reslove, reject) => {
          axios.post('client/queryClientBaseInfo.do').then(result => {
            if(result.data.success) {
              this.id = result.data.client.id
              reslove()
            }
          })
        })
      },
      changeSub(sub){
        axios.post('client/bind/bindsubaccount/queryClientBindsBySubAccountNo.do', this.qs.stringify({
          subAccountNo: sub
        })).then(result => {
          if(result.data.success) {
            this.clientOptions = []
            let arr = result.data.clientBinds    //subAccountAgreement 为子账审核状态 为0代表审核中 为1代表审核成功 为-1代表已被拒绝
            arr.forEach(item => {
              if(item.subAccountAgreement == 1) {
                this.clientOptions.push(item)
              }
            })
          }
        })
      },
      // filterOptions(){       //过滤为自己有权限的子账
      //   return new Promise((reslove, reject) => {
      //     let arr = []
      //     this.subOptions.forEach(sub => {
      //       this.BDdatas.forEach(list => {
      //         if(sub.value == list.subAccountNo) {
      //           arr.push(sub)
      //         }
      //       })
      //     })
      //     this.subOptions = arr
      //     console.log(this.subOptions)
      //     reslove()
      //   })
        
      // },
      // 获取已绑定子账
      // getBDData() {
      //   return new Promise((reslove, reject) => {
      //     axios.post('client/bind/bindsubaccount/queryAll.do', this.qs.stringify({
      //       clientBindId: this.userID,
      //     })).then(result => {
      //       if (result.data.success) {
      //         this.BDdatas = result.data.clientBindSubAccounts
      //       }
      //     })
      //   })
      // },
      goTo(){
        if(this.clientBindId == '' || this.tradePassword == '') {
          this.$message({
            type:"error",
            message:"请选择你需要交易的线下账户且输入交易密码后再进行提交！如无需交易功能可直接通过左下角按钮进入。",
            showClose: true
          })
          return
        }
        axios.post('clientbind/checkTradePassword.do', this.qs.stringify({
          clientBindId: this.clientBindId,
          tradePassword: Base64.encode(this.tradePassword),
        })).then(result => {
          if(result.data.success) {
            this.dialogVisible = false
            window.sessionStorage.setItem("token", result.data.FORWARD_TRADE_TOKEN)
            // window.sessionStorage.setItem("token", "Bearer " + result.data.FORWARD_TRADE_TOKEN)
            this.$router.push(`/forwardType?id=${this.clientBindId}&sub=${this.account}&user=${this.id}`)
            this.tradePassword = ''
            this.clientBindId = ''
            this.account = ''
            this.password = ''
            this.clientOptions = []
          }
        })
      },
      direct(){
        this.dialogVisible = false
        this.$router.push(`/forwardType?dis=1&id=${this.clientBindId}&sub=${this.account}&user=${this.id}`)
      },

      handleClose(){
        this.dialogVisible = false
        this.clientBindId = ''
        this.account = ''
        this.password = ''
        this.tradePassword = ''
        this.clientOptions = []
      },
    },
    computed: { 
      bdID() {
        return this.$store.state.bdID
      },
      userID() {
        return this.$store.state.userID
      },
    },
    components: {
      BottonTab
    },
    watch: {
      $route: {
        handler(to, from) {
          if(to.name == 'more') {
            this.account = ''
            this.getSubNo().then(() => {
              this.getAll()
            })
            this.getUserData()
            this.getUserName()
            
            let reselection = to.query.reselection
            if(reselection) {
              this.forward()
            }
          }
        },
        immediate: true
      }
    },
  }

</script>

<style>
  .more header {
    height: 40px;
    font-size: 12px;
    text-align: center;
    line-height: 40px;
    box-sizing: border-box;
    box-shadow: 1px 1px 1px #ddd;
  }

  .more .content {
    padding: 0 10px;
    font-size: 14px;
    margin-top: 2px;
  }

  .more .content p {
    padding: 10px 20px;
    margin-bottom: 1px;
    background: #fff;
    color: #000;
    border-bottom: 1px solid #ccc;
  }

  .more .el-dialog {
    max-width: 550px !important;
  }

  .gotoDia p{
    margin-top: 10px;
  } 

</style>
