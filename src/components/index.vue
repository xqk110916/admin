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
          <router-view></router-view>
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

  export default {
    name: "index",
    data() {
      return {

      }
    },
    created() {

    },
    methods: {
      onShow(flag) {
        if (!flag) {
          this.$(this.$refs.nav.$el).fadeOut(500)
        } else {
          this.$(this.$refs.nav.$el).fadeIn(500)
        }
      },
      onAddTag (obj) {
        this.$refs.tag.CheckToHeavy(obj)
      }
    },
    components: {
      Nav,
      Top,
      Tags,
    }
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
  } 
  
</style>