<template>
  <div>
    <Row class="bott">
      <router-link to="/" active-class="activeColor" exact>
        <Col span="6"><Icon type="md-home" size="26"/><p>报价</p></Col>
      </router-link>
      <!-- <router-link to="/ConsultPrice" active-class="activeColor" exact>
        <Col span="6"><Icon type="logo-usd" size="26"/><p>询价</p></Col>
      </router-link> -->
      <router-link to="/optional" active-class="activeColor" exact>
        <Col span="6"><Icon type="ios-hand" size="26"/><p>自选</p></Col>
      </router-link>
      <router-link to="/deal" active-class="activeColor" exact>
        <Col span="6"><Icon type="md-cart" size="26"/><p>交易</p></Col>
      </router-link>
      <router-link to="/more" active-class="activeColor" exact>
        <Col span="6"><Icon type="ios-more" size="26"/><p>更多</p></Col>
      </router-link>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'BottonTab',
  data () {
    return {
      shows: 1
    }
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bott{
  padding-top: 4px;
  width: 100%;
  max-width: 750px;
  height: 2.5rem;
  text-align: center;
  background-color: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  z-index: 3;
  font-size: 0.5rem;
}
.bott a{
  color: #999
}
.bott .activeColor{
  color: rgb(0, 122, 255);
}
</style>
