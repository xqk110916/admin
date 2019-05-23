银行信息管理
<template>
  <div>
    <div class="search_bar">
      <div class="right">
        <el-button type="primary" size="small" @click="addyinhanginfo">添加银行信息</el-button>
        <el-button type="primary" size="small" @click="editinhanginfo">修改银行信息</el-button>
        <el-button type="primary" size="small" @click="replaceFun"> 刷新 </el-button>
      </div>
    </div>
    <!-- table -->
    <div>
      <el-table border :data="tableData" @cell-click="kehucellClick" ref="singleTable"
        @current-change="handleCurrentChange" highlight-current-row>
        <el-table-column prop="bankNo" label="银行编号">
        </el-table-column>
        <el-table-column prop="bankName" label="银行名称">
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
        <el-form :model="dialogData">
          <el-form-item label="辖区编号">
            <el-input v-model="dialogData.areaNo" :disabled=true> </el-input>
          </el-form-item>

          <el-form-item label="辖区名称">
            <el-input v-model="dialogData.areaName"> </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogBtn">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Info_bank',
    data() {
      return {
        permissionShow: false,
        tableData: [],
        dialogTitle: "",
        dialogVisible: false,
        dialogData: {
          areaNo: "",
          areaName: ""
        },
        ind: 0,
        loading: true
      }
    },
    created() {
      this.getDataFun()
    },
    methods: {
      replaceFun: function () {
        window.location.reload(true)
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      getDataFun: function () {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/clientarea/queryAll.do').then(result => {
            if (result) {
              this.tableData = result.clientAreaInfos;
              this.setCurrent(this.tableData[0]);
              this.ind = 0;
            } else {
              this.tableData = [];
              this.permissionShow = true;
            }
            this.loading = false
          })
        })
      },
      addyinhanginfo: function () {
        this.dialogTitle = "增加辖区信息";
        this.dialogData = {
          areaNo: "",
          areaName: ""
        };
        this.dialogVisible = true;
      },
      editinhanginfo: function () {
        this.dialogTitle = "修改辖区信息";
        this.dialogData = JSON.parse(JSON.stringify(this.tableData[this.ind]));
        this.dialogVisible = true;
      },
      dialogBtn: function () {
        if (this.dialogData.areaName == "") {
          this.$message({
            type: 'error',
            showClose: true,
            message: '数据不完整!'
          });
          return false;
        }
        if (this.dialogTitle === "增加辖区信息") {

          return new Promise((reslove, reject) => {
            this.axios.post('manage/clientarea/doAdd.d', this.qs.stringify({
              areaName: this.dialogData.areaName
            })).then(result => {
              if (result) {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  showClose: true
                });
                this.getDataFun()
              }
            })
          })
          //this.tableData.push(this.dialogData)
        } else {

          return new Promise((reslove, reject) => {
            this.axios.post('manage/clientarea/doUpdate.do', this.qs.stringify({
              areaNo: this.dialogData.areaNo,
              areaName: this.dialogData.areaName
            })).then(result => {
              if (result) {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  showClose: true
                });
                this.getDataFun()
              }
            })
          })

        }
        this.dialogVisible = false;
      },
      kehucellClick: function (row) {
        this.ind = this.tableData.indexOf(row);
      }
    }

  }
</script>

<style>

</style>