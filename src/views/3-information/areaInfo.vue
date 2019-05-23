辖区信息管理
<template>
  <div>
    <div class="search_bar">
      <div class="right">
        <el-button type="primary" size="mini" @click="addyinhanginfo">添加辖区信息</el-button>
        <el-button type="primary" size="mini" @click="editinhanginfo">修改辖区信息</el-button>
        <el-button type="primary" size="mini" @click="replaceFun">刷新</el-button>
      </div>
      <!-- table -->
      <div>
        <el-table :data="tableData" @current-change="handleCurrentChange" @cell-click="kehucellClick" v-loading="loading" ref="singleTable" border
         element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)" highlight-current-row>
          <el-table-column prop="areaNo" label="辖区编号">
          </el-table-column>
          <el-table-column prop="areaName" label="辖区名称">
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
  </div>
</template>

<script>
  export default {
    name: 'areaInfo',
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
            if(result) {
              this.tableData = result.data.clientAreaInfos;
              this.setCurrent(this.tableData[0]);
              this.ind = 0;
            } else {
              this.tableData = [];
              this.permissionShow = true;
            }
            this.loading = false;
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
            this.axios.post('manage/clientarea/doAdd.do', this.qs.stringify({
              areaName: this.dialogData.areaName
            })).then(result => {
              if(result) {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  showClose: true
                });
                this.getDataFun()
              }
            })
          })
        } else {
          
          return new Promise((reslove, reject) => {
            this.axios.post('manage/clientarea/doUpdate.do', this.qs.stringify({
              areaNo: this.dialogData.areaNo,
              areaName: this.dialogData.areaName
            })).then(result => {
              if(result) {
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

<style scoped>

</style>