<template>
  <div>
    <div class="search">
      <el-select v-model="clientId" placeholder="请输入您需要查询的客户编号" filterable :clearable="flag" :multiple="!flag"
        :collapse-tags="!flag">
        <el-option v-for="item in options" :key="item.clientId" :label="item.clientNumber" :value="item.clientId">
        </el-option>
      </el-select>
      <el-select v-model="clientId" placeholder="请输入您需要查询的客户名称" filterable :clearable="flag" :multiple="!flag"
        :collapse-tags="!flag">
        <el-option v-for="item in options" :key="item.clientId" :label="item.clientName" :value="item.clientId">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" @click="query">查询</el-button>
      <div class="right">
        <slot name="right"></slot>
      </div>
      
    </div>

  </div>
</template>

<script>
  export default {
    name: "search",
    data() {
      return {
        clientId: [],
        options: [{
          clientId: 1,
          clientNumber: 'A0001',
          clientName: "法法师"
        }, {
          clientId: 2,
          clientNumber: 'A0001',
          clientName: "法法师"
        }, {
          clientId: 3,
          clientNumber: 'A0001',
          clientName: "法法师法法师法法师法法师"
        }, {
          clientId: 4,
          clientNumber: 'A0001',
          clientName: "法法师法法师法法师法法师"
        }, {
          clientId: 5,
          clientNumber: 'A0001',
          clientName: "法法师法法师法法师法法师"
        }, {
          clientId: 6,
          clientNumber: 'A0001',
          clientName: "法法师"
        }, ],
      }
    },
    created() {

    },
    methods: {
      getAllClient() {
        this.axios.post('manage/clientinfo/queryClientIdNumberAndClientNames.do').then(result => {
          if (result.data.success) {
            this.options = result.data.clientincModel
          }
        })
      },
      query(){
        this.$emit("query",this.clientId)
      }
    },
    props: {
      type: String,
    },
    computed: {
      flag() {
        if (this.type == "Array") {
          console.log('array')
          this.clientId = []
          return false
        } else {
          console.log('str')
          this.clientId = ""
          return true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.search {
  height: 40px;
  padding:10px 0;
}
.right {
  float: right;
}
</style>