部门信息管理
<template>
  <div>
    <div class="search_bar">
      <div class="right">
        <el-button type="primary" size="small" @click="addyinhanginfo">添加部门信息</el-button>
        <el-button type="primary" size="small" @click="editinhanginfo">修改部门信息</el-button>
        <el-button type="primary" size="small" @click="replaceFun"> 刷新 </el-button>
      </div>
    </div>
    <!-- table -->
    <div>
      <el-table border v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.5)" :data="tableData" @cell-click="kehucellClick"
        ref="singleTable" @current-change="handleCurrentChange" highlight-current-row height="100%">
        <el-table-column prop="departmentNo" label="部门编号">
        </el-table-column>
        <el-table-column prop="departmentName" label="部门名称">
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
        <el-form :model="dialogData">
          <el-form-item label="部门编号">
            <el-input v-model="dialogData.departmentNo" auto-complete="off" :disabled=true> </el-input>
          </el-form-item>

          <el-form-item label="部门名称">
            <el-input v-model="dialogData.departmentName" auto-complete="off"> </el-input>
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
    name: 'sectionInfo',
    data() {
      return {
        permissionShow: false,
        tableData: [],
        dialogTitle: "",
        dialogVisible: false,
        dialogData: {
          departmentNo: "",
          departmentName: ""
        },
        disabtn: true,
        ind: 0,
        loading: true
      }
    },
    created() {
      this.getDataFun()
    },
    methods: {
      replaceFun: function () {
        this.getDataFun()
      },
      setCurrent(row) {
        this.$refs.singleTable.setCurrentRow(row);
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      getDataFun: function () {

        this.way.promise('manage/departmentinfo/queryAll.do').then(result => {
          this.tableData = result.data.departmentInfos
          this.setCurrent(this.tableData[0])
          this.ind = 0
          this.loading = false
          this.loading = false
        }, result => {
          this.permissionShow = true
          this.loading = false
        })

      },
      addyinhanginfo: function () {
        this.dialogTitle = "增加部门信息";
        this.dialogData = {
          departmentNo: "",
          departmentName: ""
        };
        this.dialogVisible = true;
      },
      editinhanginfo: function () {
        this.dialogTitle = "修改部门信息";
        this.dialogData = JSON.parse(JSON.stringify(this.tableData[this.ind]));
        this.dialogVisible = true;
      },
      dialogBtn: function () {
        if (this.dialogData.departmentName == "") {
          this.$message({
            type: 'error',
            showClose: true,
            message: '数据不完整!'
          });
          return false;
        }
        if (this.dialogTitle === "增加部门信息") {
          this.way.promise('manage/departmentinfo/doAdd.do', { departmentName: this.dialogData.departmentName }).then(result => {
            this.getDataFun()
          })
          $.ajax({
            type: "post",
            url: ajaxurl + "manage/departmentinfo/doAdd.do",
            data: {
              departmentName: this.dialogData.departmentName
            },
            success: function (result) {
              redirect(result, this)
              if (result.success) {
                this.getDataFun()
              }
            },
            error: function () {
              this.$message({
                type: 'error',
                showClose: true,
                message: '出错了!'
              });
            }
          });
        } else {
          this.way.promise('manage/departmentinfo/doUpdate.do', {
            epartmentNo: this.dialogData.departmentNo,
            departmentName: this.dialogData.departmentName
          }).then(result => {
            this.$message({
              type: 'success',
              showClose: true,
              message: '操作成功!'
            });
            this.getDataFun()
          }, result => {
             this.$message({
              type: 'error',
              message: '修改失败!',
              showClose: true
            });
          })
        }
        this.dialogVisible = false;
      },
      kehucellClick: function (row) {
        this.ind = this.tableData.indexOf(row);
      }
    },

  }
</script>

<style>

</style>