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
        window.addEventListener("beforeunload", this.reload, true)
        window.addEventListener("resize", this.resize, true)
      } else {
        window.attachEvent("onbeforeunload", this.reload)
        window.attachEvent("onresize", this.resize)
      }
    },
    mounted(){
      this.resize()
    },
    methods: {
      reload() {
        sessionStorage.setItem('state',JSON.stringify(this.$store.state) )
      },
      resize() {
        let dom = document.documentElement
        let h = dom.getBoundingClientRect().height
        let height = h - 46 - 40 - 60 - 40 - 20 - 32   //动态设置表单的高度，视口高度 - top组件的高度 - 标签组件的高度 - 筛选组件的高度 - footer组件的高度 - 上下padding - 分页器
        this.$store.dispatch("changeHeight",height)
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