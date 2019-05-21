<template>
  <div>
    <el-container style="height:100%;">
      <el-header>
        <Top @show="onShow"></Top>
      </el-header>
      <div class="main">
        <el-aside class="nav" style="width:218px;" ref="nav">
          <Nav @addTag="onAddTag"></Nav>
        </el-aside>

        <el-main>
          <Tags ref="tag"></Tags>
          <div class="routerViews" ref="routerViews">
            <router-view></router-view>
          </div>
        </el-main>
      </div>

      <el-footer>
        <p>Copyright © 2004-2018 Nanhua Futures Co.,Ltd.All Rights Reserved.</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import Nav from './subject/native' //导航栏
  import Top from './subject/top' //顶部信息
  import Tags from './subject/tags' //导航标签组件
  import Vue from 'vue'

  Vue.directive('loadmore', {
    bind(el, binding) {
      const selectWrap = el.querySelector('.el-table__body-wrapper')
      selectWrap.addEventListener('scroll', function () {
        let sign = 100
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance <= sign) {
          binding.value(0)
        }
      })
    }
  })

  export default {
    name: "index",
    data() {
      return {

      }
    },
    mounted() {
      // 刷新界面过后保留当前选中的界面
      this.createSetTag()
    },
    methods: {
      onShow(flag) {
        if (!flag) {
          this.$(this.$refs.nav.$el).fadeOut(500)
        } else {
          this.$(this.$refs.nav.$el).fadeIn(500)
        }
      },
      onAddTag(obj) {
        this.$refs.tag.CheckToHeavy(obj)
      },
      createSetTag() {
        let path = window.sessionStorage.getItem("activeTag")
        if (window.sessionStorage.getItem("activeTag")) {
          let pathArr = path.split(',')
          let obj = {
            path: pathArr[1],
            name: pathArr[0]
          }
          this.onAddTag(obj)
        }
      },
    },
    components: {
      Nav,
      Top,
      Tags,
    },
    watch: {

    },

  }
</script>

<style lang="scss">
  header {
    height: 46px !important;
    padding: 0 !important;
  }

  .main {
    height: calc(100vh - 46px - 40px);
    display: flex;
  }

  aside {
    height: calc(100vh - 46px - 40px);
  }

  footer {
    height: 40px !important;
    line-height: 40px;
    color: #fff;
    background: #222;
    padding: 0 10px;
    font-size: 14px;
  }

  .el-menu-item-group__title {
    display: none !important;
  }

  .el-main {
    padding: 0 !important;
    min-width: 1180px;
    box-sizing:border-box;
  }

  .routerViews {
    box-sizing: border-box;
    height: calc(100vh - 46px - 40px - 40px);
    padding: 10px;
  }

  .el-tag--small {
    max-width: 100px;
    overflow: hidden;
  }

  .search_bar {
    height: 40px;
    padding: 10px 0;
    // display: flex;
  }
</style>