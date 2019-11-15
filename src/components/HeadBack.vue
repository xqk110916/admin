<template>
  <div class="head-top">
    <Icon type="ios-arrow-back" class="icon-class" size="26" @click="routerBack"/>
    {{ title }}
    <slot name="btn"></slot>
  </div>
</template>

<script>
export default {
  name: 'HeadBack',
  data () {
    return {}
  },
  props: ['title'],
  methods: {
    routerBack: function () {
      this.$router.go(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head-top{
  position: fixed;
  top: 0;
  z-index: 2;
  width: 100%;
  max-width: 750px;
  height: 2rem;
  line-height: 2rem;
  padding-left: 5px;
  background-color: white;
  border-bottom: 1px solid #ccc;
  box-shadow:1px 1px 1px #ddd;
  text-align: center;
}
.icon-class{
  position: absolute;
  left: 6px;
  top: 6px;
}
</style>
