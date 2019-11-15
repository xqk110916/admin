<template>
  <div class="my">
    <header>
      <div>
        <div class="imgbox">
          <img src="../public/nanhuaciben.jpg" alt="">
        </div>
        <p class="username">{{username}}</p>
      </div>
    </header>
    <section>
      <ul>
        <li>
          <p @click="user">
            <Icon type="md-pricetag" />
            <span class="text">{{company}}</span>
          </p>
        </li>
        <li>
          <p @click="seeMoney">
            <Icon type="ios-information-circle-outline" />
            <span class="text">查看资金</span>
          </p>
        </li>
      </ul>
    </section>
    <!-- 期权界面 -->
    <section>
      <ul>
        <li>
          <p @click="seeShare">
            <Icon type="ios-arrow-forward" />
            <span class="text">查看期权信息</span>
          </p>
        </li>
      </ul>
    </section>
    <section class="share_child1">
      <ul>
        <li>
          <p @click="goOld">
            <Icon type="md-eye" />
            <span class="text">查看前收盘日持仓</span>
          </p>
        </li>
        <li>
          <p @click="goNew">
            <Icon type="md-eye" />
            <span class="text">查看实时持仓</span>
          </p>
        </li>
        <li>
          <p @click="nowEntrust">
            <Icon type="ios-pulse-outline" />
            <span class="text">查看当日委托</span>
          </p>
        </li>
        <li>
          <p @click="hisEntrust">
            <Icon type="ios-pulse" />
            <span class="text">查看历史委托</span>
          </p>
        </li>
        <li>
          <p @click="nowMAB">
            <Icon type="md-checkmark" />
            <span class="text">查看当日成交</span>
          </p>
        </li>
        <li>
          <p @click="hisMAB">
            <Icon type="md-done-all" />
            <span class="text">查看历史成交</span>
          </p>
        </li>
      </ul>
    </section>
        <!-- 远期界面 -->
    <section>
      <ul>
        <li>
          <p @click="seeForword">
            <Icon type="ios-arrow-forward" />
            <span class="text">查看远期信息</span>
          </p>
        </li>
      </ul>
    </section>
    <section class="share_child2">
      <ul>
        <li>
          <p @click="foroldcc">
            <Icon type="md-eye" />
            <span class="text">查看前收盘日持仓</span>
          </p>
        </li>
        <li>
          <p @click="forCC">
            <Icon type="md-eye" />
            <span class="text">查看实时持仓</span>
          </p>
        </li>
        <li>
          <p @click="forCCS">
            <Icon type="md-eye" />
            <span class="text">查看持仓汇总</span>
          </p>
        </li>
        <li>
          <p @click="fornowEntrust">
            <Icon type="ios-pulse-outline" />
            <span class="text">查看当日委托</span>
          </p>
        </li>
        <li>
          <p @click="fornowEntrust_history">
            <Icon type="ios-pulse" />
            <span class="text">查看历史委托</span>
          </p>
        </li>
        <li>
          <p @click="forMAB">
            <Icon type="md-checkmark" />
            <span class="text">查看成交</span>
          </p>
        </li>
      </ul>
    </section>

    <section>
      <ul>
        <li>
          <p @click="info">
            <Icon type="md-person" />
            <span class="text">个人资料</span>
          </p>
        </li>
        <li>
          <p @click="bang">
            <Icon type="logo-octocat" />
            <span class="text">绑定开户信息</span>
          </p>
        </li>
        <li>
          <p @click="lianxi">
            <Icon type="ios-call" />
            <span class="text">反馈建议</span>
          </p>
        </li>
        <li class="bottom">
          <p @click="quit">
            <Icon type="ios-undo" />
            <span class="text">退出登录</span>
          </p>
        </li>
      </ul>
    </section>
    <BottonTab></BottonTab>
    <Modal v-model="modal1" title="资金情况" @on-ok="cancel" @on-cancel="cancel">
      <p>可用余额：<span>{{keyong}}</span></p>
      <p>保证金：<span>{{baozhengjin}}</span></p>
      <p>权利金：<span>{{quanlijin}}</span></p>
      <p>冻结保证金：<span>{{dongjiebaozheng}}</span></p>
      <p>冻结权利金：<span>{{dongjiequanli}}</span></p>
      <p>普通冻结：<span>{{putongdongjie}}</span></p>
      <p>授信余额：<span>{{shouxinyue}}</span></p>
      <p>授信额度：<span>{{shouxinedu}}</span></p>
    </Modal>
    <Modal v-model="modal2" title="选择绑定账户" @on-ok="ok" @on-cancel="cancel">
      <Select v-model="copyID" style="width:200px" @on-change="changeValue" label-in-value>
        <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.companyNameInner }}</Option>
      </Select>
    </Modal>
  </div>

</template>

<script>
  import BottonTab from '../components/BottonTab'
  import axios from '../axios'
  import $ from 'jquery'

  export default {
    name: 'deal',
    data() {
      return {
        modal1: false,
        modal2: false,
        modal3: false,
        company: '请选择绑定账户',
        copyname: '',
        copyID: '',
        gsname: '',
        username: 'username',
        userList: [],
        userId: '1',
        money: {

        },
        size: '',
      }
    },
    created() {
      this.getInfo().then(() => {
        this.getUser()
      })
      // this.$store.commit("changeUserName",this.username)
    },
    methods: {
      ok() {
        if(!this.copyID) {
          return
        }
        this.company = this.copyname
        this.userId = this.copyID
        this.$store.commit('changeUserID', this.userId)
      },
      cancel() {

      },
      out() {
        axios.post("client/logout.do").then(res => {
          if (res.data.success) {
            this.$router.push('/Login')
            window.sessionStorage.removeItem("login")
            window.sessionStorage.removeItem("state")
            // 清除vuex中的绑定数据
            this.$store.commit('changeUserID', '')
            this.$store.commit('changebdID', '')
            this.$store.commit('changeUserName', '')
            this.$store.commit('changeSize', '')
            this.$store.commit('changebdObj', {})
          }
        })
      },
      changeValue(obj) {
        this.copyID = obj.value
        this.copyname = obj.label
        // this.$store.commit('changeUserID', this.copyID)
      },
      // 路由跳转
      goOld() {
        if (this.userList.length) {
          this.$router.push('/cicang')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
      },
      goNew() {
        if (this.userList.length) {
          this.$router.push('/newcicang')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
      },
      nowEntrust() {
        this.$Message.info('该功能暂不支持');
      },
      hisEntrust() {
        this.$Message.info('该功能暂不支持');
      },
      nowMAB() {
        this.$Message.info('该功能暂不支持');
      },
      hisMAB() {
        this.$Message.info('该功能暂不支持');
      },
      info() {
        this.$router.push('/personalIfo')
      },
      bang() {
        this.$router.push('/bangDing')
      },
      lianxi() {
        this.$router.push('/lianxi')
      },
      forMAB(){
        if (this.userList.length) {
          this.$router.push('/offer_mab')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
        
      },
      forCC(){
        if (this.userList.length) {
          this.$router.push('/offer_cicang')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
        
      },
      forCCS(){
        if (this.userList.length) {
          this.$router.push('/offer_CCS')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
        
      },
      foroldcc(){
        if (this.userList.length) {
          this.$router.push('/offer_oldcc')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
         
      },
      fornowEntrust(){
        if (this.userList.length) {
          this.$router.push('/offer_entrust')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
        
      },
      fornowEntrust_history(){
        if (this.userList.length) {
          this.$router.push('/offer_entrust_history')
        } else {
          this.$Message.info('请先选择绑定账户');
        }
      },

      seeMoney() {
        let _this = this
        if (!this.userList.length) {
          this.$Message.info('请先选择绑定账户');
          return
        }
        axios.post('client/account/query.do', this.qs.stringify({
          webClientBindId: this.userId
        })).then(data => {
          console.log(data)
          // 如果报错会axios响应拦截器会返回false
          if (!data) {
            return
          }
          this.modal1 = true
          _this.keyong = data.data.clientAccount.balance
          _this.baozhengjin = data.data.clientAccount.margin
          _this.quanlijin = data.data.clientAccount.premium
          _this.dongjiebaozheng = data.data.clientAccount.frozenMargin
          _this.dongjiequanli = data.data.clientAccount.frozenPremium
          _this.putongdongjie = data.data.clientAccount.frozenCommon
          _this.shouxinyue = data.data.clientAccount.creditBalances
          _this.shouxinedu = data.data.clientAccount.creditLine
        })
      },
      user() {
        if (!this.userList.length) {
          this.$Message.info('请先绑定开户信息');
          return
        }
        this.modal2 = true
      },
      quit() {
        this.modal3 = true
        this.$confirm('此操作将退出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.out()
        }).catch(() => {
          this.cancel(index, row)
        });
      },
      getUser() {
        return new Promise((reslove, reject) => {
          axios.post('client/queryClientBinds.do').then(result => {
          if (result.data.success) {
            
            this.userList = result.data.clientBindsList
            let index = 0;
            if (this.userList.length) {
              // if (this.flag) {
              // this.$store.commit('changeFlag', false)
              this.userList.forEach((item, idx) => {
                if (item.isChecked == 1) {
                  index = idx
                }
              });
              this.gsname = this.userList[index].companyNameInner
              this.userId = this.userList[index].id
              this.company = this.gsname
              this.size = this.userList.length
              this.$store.commit('changeSize', this.size)
              this.$store.commit('changeUserID', this.userId)
              // } else {

              // }
              reslove()
            } else {
              this.copyname = ""
              this.company = "请选择绑定账户"
            }
          }

        })
        })
        
      },
      getInfo() {
        return new Promise((reslove, reject) => {
          axios.post('client/queryClientBaseInfo.do').then(result => {
            if (result) {
              this.username = result.data.client.username
              this.$store.commit('changeUserName', this.username)
              this.$store.commit("changebdObj", result.data.client)
              reslove()
            } else {
              this.$router.replace('/Login')
            }
          })
        })
        
      },
      

      seeShare(){
        $('.share_child1').slideToggle()
      },
      seeForword(){
        $('.share_child2').slideToggle()
      }
    },
    components: {
      BottonTab
    },
    watch: {
      $route(to, from) {
        if (to.name == "deal") {
          this.getInfo()
          let login = window.sessionStorage.getItem("login")
          if(!login) {
            this.getUser()
            window.sessionStorage.setItem("login","true")
          }
        }
      }
    },
    computed: {
      flag() {
        return this.$store.state.flag
      }
    }
  }

</script>

<style scoped>
  .my {
    background: #f2f2f2;
  }

  .username {
    margin-top: .5rem;
    font-size: 14px;
  }

  header {
    background: #fff;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  header>div p {
    text-align: center;
  }

  section {
    background: #fff;
    margin-top: .5rem;
  }

  .imgbox {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    overflow: hidden;
  }

  img {
    width: 4rem;
    height: 4rem;
  }

  li {
    height: 2rem;
    border-bottom: 1px solid #f2f2f2;
    padding-left: 1rem;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  li a {
    color: #666;
  }

  .text {
    margin-left: .2rem;
  }

  .ivu-modal p {
    padding: 6px;
    font-size: 14px;
    /* border-bottom:1px solid #ccc; */
  }

  .bottom {
    margin-bottom: 60px;
  }

  .share_child1 li, .share_child2 li {
    padding-left: 40px;
  }

  .share_child1, .share_child2 {
    margin-top: 0;
    display: none;
  }

</style>
