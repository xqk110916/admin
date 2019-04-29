<template>
  <div>
    <Top></Top>
    <Nav></Nav>
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
  methods:{

  },
  components:{
    Nav,
    Top
  }
}
</script>

<style>

</style>
