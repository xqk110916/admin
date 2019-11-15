<template>
  <div id="edit_phone">
    <HeadBack title="已开通业务列表">
      <el-button @click="dialogVisible = true" class="daochu" size="mini" type="primary" slot="btn"
        style="position:absolute;right:5px;top:6px;"> 开通业务申请 </el-button>
    </HeadBack>

    <el-table :data="datas" style="width: 100%;margin-top:40px;" border>
      <el-table-column type="index" width="20"> </el-table-column>
      <el-table-column prop="createTime" label="申请时间" :formatter="changeTime"> </el-table-column>
      <el-table-column label="已申请绑定子账业务名称" :formatter="changeValue"></el-table-column>
      <el-table-column prop="agreement" label="申请状态" :formatter="changeStatus"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button @click.native.prevent="switchChange(scope.$index, scope.row)" type="text" size="small" style="color: #f00;">
            解除绑定
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog title="请选择您需要绑定的子账" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <el-select v-model="subNo" placeholder="请选择您需要绑定的子账">
        <el-option v-for="(item,index) in subNoArr" :key="index" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <p>描述信息：</p>
      <el-input v-model="description"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applyFor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import HeadBack from '../../components/HeadBack.vue'
  import axios from '../../axios'
  export default {
    name: "subAccount",
    data() {
      return {
        subArr: [],
        datas: [],
        subNo: '',
        subNoArr: [],
        description: '',
        dialogVisible: false,
      };
    },
    created() {
      this.getSubNo()
      this.getData()
    },
    methods: {
      getSubNo() {
        this.subNoArr = []
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
        return new Promise((reslove, reject) => {
          axios.post('client/bind/bindsubaccount/queryAll.do', this.qs.stringify({
            clientBindId: this.bdID,
          })).then(result => {
            if (result.data.success) {
              this.datas = result.data.clientBindSubAccounts
            } else {
              this.datas = []
            }
          })
        })
      },
      applyFor() {
        if(!this.subNo) {
          this.$message({
            type:"error",
            message:"请先选择你需要绑定的子账再提交",
          })
          return 
        }
        this.dialogVisible = false
        return new Promise((reslove, reject) => {
          axios.post('client/bind/bindsubaccount/addClientBindSubAccount.do', this.qs.stringify({
            clientBindId: this.bdID,
            subAccountNo: this.subNo,
            description: this.description
          })).then(result => {
            this.description = ''
            if (result.data.success) {
              this.subNo = ''
              this.getData()
            }
          })
        })
      },
      del(index, row) {
        return new Promise((reslove, reject) => {
          axios.post('client/bind/bindsubaccount/deleteClientBindSubAccount.do', this.qs.stringify({
            id: row.id
          })).then(result => {
            if (result.data.success) {
              this.getData()
            }
          })
        })
      },
      handleClose() {
        this.dialogVisible = false
      },
      open(index, row) {
        this.$confirm('此操作将删除该申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.del(index, row)
        }).catch(() => {
          this.cancle(index, row)
        });
      },
      cancle(index, row) {
        this.$message({
          type: "warning",
          message: "已取消操作",
        })
      },
      switchChange(index, row, val) {
        this.open(index, row)
      },


      timeFormat(time, format = '') {
        let y = time.getFullYear().toString();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        m = m.toString().padStart(2, "0")
        d = d.toString().padStart(2, "0")
        return y + format + m + format + d; //返回格式  "20191027" 字符串
      },
      changeTime(obj){
        let time = this.timeFormat(new Date(obj.createTime), "-")
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
      changeStatus(obj){
        let val = obj.agreement
        let str = ''
        switch(val) {
          case 0:
            str = "待审批"
            break;
          case 1:
            str = "申请成功"
            break;
          case -1:
            str = "申请失败"
            break;
        }
        return str
      }
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
        if(to.name == "subAccount") {
          this.getData()
          this.getSubNo()
        }
      }
    }
  }

</script>

<style scoped>
  p {
    margin: 10px 0;
  }

</style>
