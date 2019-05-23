<template>
  <div>
    <div class="page">
      <el-pagination background layout="total, sizes, prev, pager, next" :total="totals" :page-sizes="sizeArrs" :page-size="pagesizes" :current-page="pages" @size-change="handleSizeChange" @current-change="handlePageChange">
      </el-pagination>
    </div> 
  </div>
</template>

<script>
  export default {
    name:'page',
    data(){
      return {
        pages: this.page,
        pagesizes: this.pagesize,
      }
    } ,
    created(){
     this.setDefault()
    },
    methods:{
      handleSizeChange(val) {
        this.pagesizes = val
        this.$emit("update:pagesize", val)
      },
      handlePageChange(val) {
        this.pages = val
        this.$emit("update:page", val)
      },
      setDefault() {
        if(!this.pagesize) {
          if(this.sizeArr) {
            this.pagesizes = this.sizeArr[0]
          } else {
            this.pagesizes = 20
          }
        }
      }
    },
    props:{
      total:{
        type:Number,
        required: true
      },
      page:{
        type:Number,
        default:1,
      },
      pagesize:Number,
      sizeArr:Array
    },
    computed: {
      sizeArrs() {
        return this.sizeArr?this.sizeArr:[20,50,100]
      },
      totals() {
        return this.total
      },
    },
  }
</script>

<style scoped>
.page {
  float:right;
}
</style>