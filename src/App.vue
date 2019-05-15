<template>
  <div id="app">
    <keep-alive>
      <component :is="com"></component>
    </keep-alive>
  </div>
</template>

<script>
  import Index from './components/index'
  import Login from './views/Login/login.vue'

  export default {
    name: 'app',
    data() {
      return {
        com: 'Index',
      }
    },
    components: {
      Index,
      Login
    },
    created() {
      if (sessionStorage.getItem('state')) {
        this.$store.replaceState(Object.assign({}, this.$store.state,
          JSON.parse(sessionStorage.getItem('state'))))
      }

      if (window.addEventListener) {
        window.addEventListener("keyup", this.F5_, true)
        window.addEventListener("beforeunload", this.reload, true)
      } else {
        window.attachEvent("onkeyup", this.F5_)
        window.attachEvent("onbeforeunload", this.reload)
      }
    },
    methods: {
      F5_(e) {
        if (e.keyCode == 116) {
          // this.$router.push('/')
        }
      },
      reload() {
        
      }
    },
    watch: {
      $route: {
        handler(newValue, oldVaule) {
          if (newValue.path === '/Login') {
            this.com = 'Login'
          } else {
            this.com = 'Index'
          }
        },
        immediate: true
      }
    }
  }
</script>

<style>
  @import "./css/iconfont/iconfont.css";
  /** iconfont图标 **/
  @import "./css/reset.css";

  /** 清除默认样式 **/
  body {
    font-family: "Helvetica Neue, Helvetica";
  }
</style>