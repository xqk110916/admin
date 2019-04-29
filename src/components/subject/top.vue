<template>
  <div class="content">
    <div class="left">
      <span class="name">{{companyName}}</span>
      <i class="iconfont icon-zhankai1" title="展开列表"></i>
    </div>
    <div class="right">
      
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'

  export default {
    name: "top",
    data() {
      return {

      }
    },
    methods: {

    },
    computed: {
      ...mapState({
        companyName: 'companyName'
      })
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    height: 46px;
    background: #222;
    font-size: 18px;
    display: flex;
    justify-content: space-between;

    .left {
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;

      .name {
        padding: 0 10px;
        color: #fff;
      }

      .iconfont {
        padding: 4px 5px;
        color: #999;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 20%;
        cursor: pointer;
      }

      .iconfont:hover {
        color: #c71616;
        border: 1px solid #c71616;
      }
    }

    .right {
     
    }
  }
</style>