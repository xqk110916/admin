<template>
  <div>
    <el-container style="height:100%;">
      <el-header>
        <Top @show="onShow"></Top>
      </el-header>
      <el-aside class="nav" style="width:218px;" ref="nav">
        <Nav></Nav>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import Nav from './subject/native'    //导航栏
import Top from './subject/top'     //顶部信息

export default {
  name:"index",
  data(){
    return {

    }
  },
  created () {
    
  },
  methods:{
    onShow (flag) {
      if(!flag) {
        this.$(this.$refs.nav.$el).fadeOut(500)
      } else {
        this.$(this.$refs.nav.$el).fadeIn(500)
      }
    }
  },
  components:{
    Nav,
    Top
  }
}
</script>

<style>
header {
  height: 46px !important;
  padding:0 !important;
}

aside {
  height: calc(100vh - 46px);
}
</style>
