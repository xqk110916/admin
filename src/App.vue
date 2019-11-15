<template>
  <div id="app">
    <keep-alive>
      <component :is="isShow"></component>
    </keep-alive>
    
  </div>
</template>

<script>
  import oldIndex from '@/components/oldIndex.vue'
  import newIndex from '@/components/newIndex.vue'
  import bus from '@/assets/eventBus'

  export default {
    name: 'App',
    data(){
      return {
        isShow: 'oldIndex',    // 切换组件远期组件与期权组件
      }
    },
    created() {
      if (sessionStorage.getItem('state')) {
        this.$store.replaceState(Object.assign({}, this.$store.state,
          JSON.parse(sessionStorage.getItem('state'))))
      }

      if (window.addEventListener) {
        window.addEventListener("beforeunload", this.reload, true)
      } else {
        window.attachEvent("onbeforeunload", this.reload)
      }
    },
    methods: {
      reload() {
        sessionStorage.setItem('state', JSON.stringify(this.$store.state))
      },
    },
    components: {
      oldIndex,
      newIndex
    },
    watch: {
      $route: {
        handler(to, from){
          if(to.path == '/forwardType') {
            this.isShow = 'newIndex'
          } else {
            this.isShow = 'oldIndex'
          }
        },
        immediate: true,
      },
    }
  }

</script>

<style>
  html {
    font-size: 20px;
  }

  .el-message-box {
    width: 80vw !important;
    max-width: 420px !important;
  }

  .cell  {
    text-align: center;
  }

  .hand {
    cursor: pointer;
  }
</style>
