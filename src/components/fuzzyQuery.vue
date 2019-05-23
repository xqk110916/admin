<template>
  <div>
    <div class="fuzzyQuery">
      <el-select v-model="clientId" class="se" placeholder="请输入您需要查询的客户编号" filterable :default-first-option="true" :clearable="flag" :multiple="!flag" ref="ClientNumber"
        :collapse-tags="!flag">
        <el-option v-for="item in options" :key="item.clientId" :label="item.clientNumber" :value="item.clientId">
        </el-option>
      </el-select>
      <el-select v-model="clientId" placeholder="请输入您需要查询的客户名称" filterable :default-first-option="true" :clearable="flag" :multiple="!flag"
        :collapse-tags="!flag" class="se">
        <el-option v-for="item in options" :key="item.clientId" :label="item.clientName" :value="item.clientId">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" class="query" @click="query" :loading="SearchStatus" v-if="search"> {{SearchStatus?"":"查询"}}
      </el-button>

    </div>

  </div>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex'
  export default {
    name: "fuzzyQuery",
    data() {
      return {
        clientId: [],
        loading: false,
        options: [{
          clientId: 1,
          clientNumber: 'A0001',
          clientName: "沙漠死神-内瑟斯2233"
        }, {
          clientId: 2,
          clientNumber: 'A0002',
          clientName: "艾瑞莉娅-刀锋意志"
        }, {
          clientId: 3,
          clientNumber: 'A0003',
          clientName: "泰隆-刀锋之影"
        }, {
          clientId: 4,
          clientNumber: 'A0004',
          clientName: "皮城执法官-蔚"
        }, {
          clientId: 5,
          clientNumber: 'A0005',
          clientName: "皮城女警-凯特琳"
        }, {
          clientId: 6,
          clientNumber: 'A0006',
          clientName: "暴走萝莉-金克斯"
        }, ],
      }
    },
    created() {
      // this.getAllClient()
      if(window.addEventListener) {
        window.addEventListener("keyup", this.enter, true)
      } else {
        window.attachEvent("onkeyup", this.enter)
      }
    },
    methods: {
      ...mapActions(['changeSearchStatus']),

      getAllClient() {
        return new Promise((reslove, reject) => {
          this.axios.post('manage/clientinfo/queryClientIdNumberAndClientNames.do').then(result => {
            if (result.data.success) {
              this.options = result.data.clientincModel
              reslove()
            } else {
              reject()
            }
          })
        })
      },
      query() {
        this.changeSearchStatus(true)
        this.$emit("query", this.clientId)
      },

    },
    props: {
      type: String,
      search: Boolean,
    },
    computed: {
      ...mapGetters(["SearchStatus"]),

      flag() {
        if (this.type == "Array") {
          this.clientId = []
          return false
        } else {
          this.clientId = ""
          return true
        }
      },

    }
  }
</script>

<style scoped lang="scss">
  .fuzzyQuery {
    height: 40px;
  }

  .se {
    margin-right: 6px;
  }

  .query {
    width: 56px;
    margin-right:6px;
  }

  
</style>