<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.date"
            @change="changDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
    </el-table>
    <el-date-picker v-model="value1" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
    </el-date-picker>
  </div>
</template>

<script>
  import fuzzyQuery from '@/components/fuzzyQuery'
  import Page from '@/components/page'

  export default {
    name: 'capitaAccount',
    data() {
      return {
        value1: '',
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
      }
    },
    created() {
      console.log(this.way.getNow('-'))
      this.value1 = this.way.getNow('-')
    },
    methods: {
      changDate(val) {
        console.log(this.tableData)
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