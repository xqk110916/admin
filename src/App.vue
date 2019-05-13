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
    watch: {
      $route: {
        handler(newValue, oldVaule) {
          if(newValue.path === '/Login') {
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