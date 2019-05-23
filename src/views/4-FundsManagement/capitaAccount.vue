<template>
  <div>
    <Page :total="total"></Page>
    <el-button type="permary" @click="change">change</el-button>
  </div>
</template>

<script>
import fuzzyQuery from '@/components/fuzzyQuery'
import Page from '@/components/page'

export default {
  name:'capitaAccount',
  data(){
    return {
      total:20,
    }
  },
  created() {},
  methods:{
    change(){
      this.total = 50
      console.log(this.total)
    }
  },
  components: {
    fuzzyQuery,
    Page
  },
  computed: {

  }
}
</script>

<style>

</style>
