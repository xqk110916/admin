<template>
  <div>
    <HeadBack title="远期交易配置信息"></HeadBack>

    <el-table :data="datas" style="width: 100%;margin-top:40px;" border>
      <el-table-column prop="exchange" label="交易所" width="80"
        :filters="filterArr" :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <span>{{scope.row.exchange}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="underlying" label="标的"> </el-table-column>
      <el-table-column label="业务名称" :formatter="changeValue"></el-table-column>
      <el-table-column label="最远到期日期" :formatter="changeTime" width="95"> </el-table-column>
      <el-table-column prop="maxOrderVolume" label="最大下单量"> </el-table-column>
      <el-table-column prop="maxPositionVolume" label="持仓上限"> </el-table-column>
      <el-table-column prop="openRatio" label="自定义开仓手续费率">
        <template slot-scope="scope">
          <span>{{ scope.row.openRatio * 100 + "%" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="closeRatio" label="自定义平仓手续费率">
        <template slot-scope="scope">
          <span>{{ scope.row.closeRatio * 100 + "%" }}</span>
        </template>
      </el-table-column>
       
      <!-- <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope">
          <el-button @click.native.prevent="search(scope.$index, scope.row)" type="text" size="small" style="color: #f00;">
            查询
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

  </div>
</template>

<script>
  import HeadBack from '../../components/HeadBack.vue'
  import axios from '../../axios'

  export default {
    name: "forward",
    data() {
      return {
        subArr: [],
        datas: [],
        subNo: '',
        subNoArr: [],
        description: '',
        dialogVisible: false,
        filterArr: [],
      };
    },
    created() {
      this.getSubNo()
      this.getData()
    },
    methods: {
      getSubNo() {
        return new Promise((reslove, reject) => {
          axios.post('client/inner/subaccount/queryAll.do').then(result => {
            if (result.data.success) {
              let arr = result.data.subAccountInfos
              arr.forEach(item => {
                let obj = {
                  value: item.subAccountNo,
                  label: item.subAccountName,
                  name: item.subAccountBusinessName,
                }
                this.subNoArr.push(obj)
              })
            }
            
          })
        })
      },
      getData() {
        this.filterArr = []
        return new Promise((reslove, reject) => {
          axios.post('client/inner/forwardconfig/queryAll.do', this.qs.stringify({
            clientBindId: this.bdID,
          })).then(result => {
            if (result.data.success) {
              let arr = []
              this.datas = result.data.ForwardConfigs
              // 获取过滤所用数据
              this.datas.forEach(item => {
                arr.push(item.exchange)
              })
              arr = [...new Set(arr)]
              arr.forEach(item => {
                let obj = {
                  value: item,
                  text: item,
                }
                this.filterArr.push(obj)
              })
            }
          })
        })
      },
      search(index, row){
        let id = row.id
        return new Promise((reslove, reject) => {
          axios.post('client/inner/forwardconfig/query.do', this.qs.stringify({id})).then(result => {
            if(result.data.success) {

            }
          })
        })
      },

      // 处理数据
      timeFormat(time, format = '') {
        let y = time.getFullYear().toString();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        m = m.toString().padStart(2, "0")
        d = d.toString().padStart(2, "0")
        return y + format + m + format + d; //返回格式  "20191027" 字符串
      },
      changeTime(obj){
        let time = this.timeFormat(new Date(obj.expiringDate), "-")
        return time
      },
      changeValue(obj){
        let val = obj.subAccountNo
        let arr = this.subNoArr
        for(let i=0;i<arr.length;i++) {
          if(arr[i].value == val) {
            return arr[i].name
          }
        }
      },
      filterTag(value, row) {
        return row.exchange === value;
      },
    },
    components: {
      HeadBack
    },
    computed: {
      bdID() {
        return this.$store.state.bdID
      },
      obj() {
        return this.$store.state.bdobj
      },

    },
    watch: {
      $route(to, from) {
        if(to.name == "forward") {
          this.getData()
        }
      }
    }
  }

</script>

<style>
  .cell {
    text-align: center;
  }
</style>
