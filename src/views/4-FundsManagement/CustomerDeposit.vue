<template>
  <div>
    <el-time-picker is-range v-model="time" range-separator="至" start-placeholder="开始时间"
              end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm" @change="calchange">
            </el-time-picker>
    <table border="1">
      <tr>
        <th rowspan="2">期限</th>
        <th rowspan="2">到期日</th>
        <th colspan="2" v-for="(item, i) in tableData.oneWeek.bilis" :key="i"> <el-input v-model="item.bili" size="mini"></el-input></th>
      </tr>
      <tr>
        <template v-for="(item, index) in tableData.oneWeek.bilis">
          <th> ask </th>
          <th> bid </th>
        </template>
      </tr>
      <tr v-for="item in tableData">
        <td>{{item.allottedTime}}</td>
        <td>
          <el-date-picker v-model="item.dueDate" type="date" placeholder="选择日期" value-format="yyyyMMdd" size="mini">
          </el-date-picker>
        </td>
        <template v-for="(items, index) in item.bilis">
          <td>
            <el-checkbox v-model="items.bidCheck"></el-checkbox> <el-input v-model="items.ask" size="mini"></el-input>
          </td>
          <td>
            <el-checkbox v-model="items.askCheck"></el-checkbox> <el-input v-model="items.bid" size="mini"></el-input>
          </td>
        </template>
      </tr>
    </table>

  </div>
</template>

<script>
  export default {
    name: 'CustomerDeposit',
    data() {
      return {
        time:'',
        tableData: {
          oneWeek: {
            allottedTime: "1周",
            dueDate: '',
            bilis: [{
              bili: '80%',
              bid: 0,
              ask: 0,
              bidCheck: false,
              axkCheck: false,
            }, {
              bili: '90%',
              bid: 0,
              ask: 0,
              bidCheck: false,
              axkCheck: false,
            }, {
              bili: '100%',
              bid: 0,
              ask: 0,
              bidCheck: false,
              axkCheck: false,
            }, {
              bili: '110%',
              bid: 0,
              ask: 0,
              bidCheck: false,
              axkCheck: false,
            }, {
              bili: '120%',
              bid: 0,
              ask: 0,
              bidCheck: false,
              axkCheck: false,
            }]
          }, 
          twoWeek:{
              allottedTime: "2周",
              dueDate: '',
              bilis: [{
                bili: '80%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '90%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '100%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '110%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '120%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }]
            }, 
          oneMouth:{
              allottedTime: "1月",
              dueDate: '',
              bilis: [{
                bili: '80%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '90%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '100%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '110%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '120%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }]
            }, 
          twoMouth: {
              allottedTime: "2月",
              dueDate: '',
              bilis: [{
                bili: '80%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '90%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '100%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '110%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '120%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }]
            }, 
          threeMouth: {
              allottedTime: "3月",
              dueDate: '',
              bilis: [{
                bili: '80%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '90%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '100%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '110%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '120%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }]
            }, 
          sixMouth: {
              allottedTime: "6月",
              dueDate: '',
              bilis: [{
                bili: '80%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '90%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '100%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '110%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '120%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }]
            }, 
          oneYear: {
              allottedTime: "1年",
              dueDate: '',
              bilis: [{
                bili: '80%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '90%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '100%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '110%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }, {
                bili: '120%',
                bid: 0,
                ask: 0,
                bidCheck: false,
                axkCheck: false,
              }]
            }
        },

      }
    },
    methods:{
      calchange(val){
        console.log(val)
      },
    }
  }
</script>

<style>
  #dialogTable td {
    width: 120px;
    padding: 3px;
    text-align: center;
  }
  #dialogTable th {
    height: 40px;
  }

  #dialogTable .box {
    display: inline-block;
  }
  #dialogTable .el-input {
    width: 60px !important;
    text-align: center;
  }
  #dialogTable .el-date-editor {
    width: 105px !important;
  }
  #dialogTable .el-checkbox {
    margin-right: 5px !important;
  }
  #dialogTable .el-input__inner {
    padding: 10px !important;
  }
</style>