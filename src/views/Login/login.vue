<template>
  <div class="content">
    <div class="wrapper">
      <div class="title">
        南华资本-管理登录
      </div>
      <div class="user">
        <div class="userInner">
          <span class="hint">账号</span>
          <p class="round">
            <i class="iconfont icon-zhanghao"></i>
            <input type="text" v-model="username" placeholder="请输入你的禅道账号或者OA账号">
          </p>
        </div>
        <div class="userInner">
          <span class="hint">密码</span>
          <p class="round">
            <i class="iconfont icon-xiugaimima"></i>
            <input type="password" v-model="password" placeholder="请输入你的禅道账户或OA账户密码">
          </p>
        </div>
      </div>
      <div class="enter">
        <button @click.enter="login" class="btn" :disabled="loginStatus"> <i :class="['el-icon-iconName', {'el-icon-loading':loginStatus}]"></i>  {{loginStatus?"登陆中":"登陆"}} </button>
        <p>注：生产环境请使用OA或禅道账户登陆</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        loginStatus:false,

        username:'managerRoot',
        password:'123456',
      }
    },
    methods: {
      login() {
        this.loginStatus = true
        this.axios.post('manage/userinfo/doLogin.do',{
          account: this.username,
          password: this.password,
        }).then( result => {
          this.loginStatus = false
          if(result.data.success) {
            this.$router.push('/')
          }
        })
      }
    
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    width: 100vw;
    height: 100vh;
    background: url('../../public/image/login.jpg') no-repeat;

    .wrapper {
      width: 600px;
      height: 342px;
      background: #f7fbfe;
      position: absolute;
      bottom: 27.5%;
      left: 50%;
      margin-left: -300px;
      border-radius: 21px;

      .title {
        height: 66px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #e9eaeb;
        font-size: 24px;
        color: #4fc3ba;
      }

      .user {
        height: 174px;
        padding:20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        .userInner {
          float: left;
          height: 40px;

          .hint {
            font-size: 20px;
            color: #4fc3ba;
            line-height: 40px;
            margin-right: 10px;
            float: left;
          }

          .round {
            border: 1px solid #e9eaeb;
            height: 40px;
            width: 336px;
            border-radius: 25px;
            box-sizing: border-box;
            float: left;
            display: flex;
            align-items: center;

            .iconfont {
              font-size: 20px;
              padding: 0 10px;
              color:#d8d6d6;
              border-right:1px solid #d8d6d6;
            }

            input {
              margin-left: 10px;
              outline: none;
              border: none;
              width: 260px;
              height: 30px;
            }
          }
        }

      }

      .enter {
        display: flex;
        flex-direction: column;
        align-items: center;

        .btn {
          outline: none;
          border: none;
          border-radius: 20px;
          width: 400px;
          height: 45px;
          background: #4fc3ba;
          color: #f7fbfe;
        }

        p {
          font-size:14px;
          margin-top: 10px;
          color:#ed5353;
        }
      }
    }
  }
</style>