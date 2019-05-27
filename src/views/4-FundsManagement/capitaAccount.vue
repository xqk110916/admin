<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="allottedTime" label="期限" width="180">
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.date" @change="changDate" value-format="yyyyMMdd" type="date"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>

      <el-table-column prop="bilis">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.bilis" :key="index">
            <el-table-column :label="item.bili">
              <el-table-column label="bid">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="item.bid"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="ask">
                <template slot-scope="scope">
                  <div>
                    <el-input v-model="item.ask"></el-input>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </div>
        </template>
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
          allottedTime: '1周',
          date: '20190507',
          bilis: [{
            bili: '80%',
            bid: '0',
            ask: '0',
          }, {
            bili: '90%',
            bid: '0',
            ask: '0',
          }, {
            bili: '100%',
            bid: '0',
            ask: '0',
          },]
        },{
          allottedTime: '2周',
          date: '20190507',
          bilis: [{
            bili: '80%',
            bid: '0',
            ask: '0',
          }, {
            bili: '90%',
            bid: '0',
            ask: '0',
          }, {
            bili: '100%',
            bid: '0',
            ask: '0',
          },]
        },{
          allottedTime: '1月',
          date: '20190507',
          bilis: [{
            bili: '80%',
            bid: '0',
            ask: '0',
          }, {
            bili: '90%',
            bid: '0',
            ask: '0',
          }, {
            bili: '100%',
            bid: '0',
            ask: '0',
          },]
        },{
          allottedTime: '2月',
          date: '20190507',
          bilis: [{
            bili: '80%',
            bid: '0',
            ask: '0',
          }, {
            bili: '90%',
            bid: '0',
            ask: '0',
          }, {
            bili: '100%',
            bid: '0',
            ask: '0',
          },]
        },{
          allottedTime: '3月',
          date: '20190507',
          bilis: [{
            bili: '80%',
            bid: '0',
            ask: '0',
          }, {
            bili: '90%',
            bid: '0',
            ask: '0',
          }, {
            bili: '100%',
            bid: '0',
            ask: '0',
          },]
        },{
          allottedTime: '6月',
          date: '20190507',
          bilis: [{
            bili: '80%',
            bid: '0',
            ask: '0',
          }, {
            bili: '90%',
            bid: '0',
            ask: '0',
          }, {
            bili: '100%',
            bid: '0',
            ask: '0',
          },]
        },{
          allottedTime: '1年',
          date: '20190507',
          bilis: [{
            bili: '80%',
            bid: '0',
            ask: '0',
          }, {
            bili: '90%',
            bid: '0',
            ask: '0',
          }, {
            bili: '100%',
            bid: '0',
            ask: '0',
          },]
        },]
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