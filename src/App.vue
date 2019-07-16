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

  import bus from '@/public/bus'

  export default {
    name: 'app',
    data() {
      return {
        com: 'Index',
        flag:true,
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
        let w = dom.getBoundingClientRect().width
        if(w <= 1400 && this.flag) {
          bus.$emit("update:flag", true)
          this.$store.dispatch("changeKnown", false)
          this.flag = false
        }
        if(w > 1400 && !this.flag) {
          bus.$emit("update:flag", false)
          this.$store.dispatch("changeKnown", true)
          this.flag = true
        }
        let height = h - 46 - 40 - 60 - 40 - 20 - 32 //动态设置表单的高度，视口高度 - top组件的高度 - 标签组件的高度 - 筛选组件的高度 - footer组件的高度 - 上下padding - 分页器
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
 /** iconfont图标 **/
  @import "./css/iconfont/iconfont.css";
 /** 清除默认样式 **/
  @import "./css/reset.css";

  body {
    font-family: "Helvetica Neue, Helvetica";
  }

</style>