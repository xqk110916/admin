<template>
  <div class="consu-container">
    <HeadBack title="登陆"></HeadBack>
    <Row class="login-class">
      <Input type="text" v-model="formInline.user" placeholder="用户名/手机号码/邮箱" v-focus>
      <Icon type="ios-person-outline" slot="prepend"></Icon>
      </Input>
      <br />
      <Row class="pass">
        <Input type="password" v-model="formInline.password" placeholder="密码为8到16位的字母和数字组合">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
        <el-button class="reset" @click="resetPass" :tabindex="-1">忘记密码</el-button>
      </Row>
      <br />
      <Row>
        <Col span="12"> <Input type="text" v-model="formInline.yzm" placeholder="请输入验证码" @keyup.native.enter="handleSubmit"> </Input> </Col>
        <Col span="12"> <img src="" @click="changeImage" width="110" height="40" ref="img" /> </Col>
      </Row>
      <br />
      <Button type="primary" @click="handleSubmit" style="width:100%" v-loading="loading" element-loading-text="正在登陆" element-loading-spinner="el-icon-loading" :disabled="loading">登陆</Button>
      <div class="register">
        <router-link to="/register">还没有账号？去注册</router-link>
      </div>
    </Row>
  </div>
</template>

<script>
  import axios from '../../axios.js'
  import HeadBack from '../../components/HeadBack.vue'
  export default {
    name: 'Login',
    data() {
      return {
        formInline: {
          user: '',
          password: '',
          yzm: ''
        },
        loading:false,
      }
    },
    mounted () {
      this.changeImage()
    },
    methods: {
      handleSubmit() {
        let _this = this
        this.loading = true
        axios.post('client/login.do', this.qs.stringify({
          upe: this.formInline.user,
          pwd: this.formInline.password,
          valcode: this.formInline.yzm.toString().replace(/^\s*|\s*$/g,"")
        })).then(res => {
          this.loading = false
          if (!res) {
            this.changeImage()
            this.formInline.yzm = '' 
          } else {
            this.$store.commit('changeFlag', true)
            this.$router.push('/deal')
            this.formInline.yzm = ''
            this.formInline.user = ''
            this.formInline.password = ''
            this.changeImage()
            window.sessionStorage.setItem("login","true")        
          }
        })
      },
      changeImage: function () {
        let time = Date.now()
        this.$refs.img.src = 'client/getCaptchaCode.htm?time=' + time
      },
      resetPass() {
        this.$router.replace('/resetPass')
      },

    },
    components: {
      HeadBack
    },
    computed:{

    },
    watch: {
      $route(to, from) {
        if(to.name == "Login") {
          this.changeImage()
          window.sessionStorage.removeItem("login")
        }
        this.formInline.user = ''
        this.formInline.password = ''
        this.formInline.yzm = ''
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .consu-container {
    position: relative;
    width: 100%;
    max-width: 750px;
    min-width: 320px;
    margin: 0 auto;
  }

  .login-class {
    margin-top: 5rem;
    height: 10rem;
    padding: 2rem;
  }

  #vercode-img {
    margin: -4px 0 0 10px;
  }

  .register {
    display: flex;
    justify-content: center;
    padding: 10px;
  }

  .pass {
    position: relative;
  }

  .reset {
    margin-top: 1px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99;
    padding: 8px 16px;
  }

</style>
