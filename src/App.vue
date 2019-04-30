<template>
  <div id="app">
    <Index></Index>
  </div>
</template>

<script>
import Index from './components/index'
export default {
  name: 'app',
  components: {
    Index
  }
}
</script>

<style>
@import "./css/iconfont/iconfont.css";    /** iconfont图标 **/
@import "./css/reset.css";    /** 清除默认样式 **/
body {
  font-family: "Helvetica Neue, Helvetica";
}
</style>
