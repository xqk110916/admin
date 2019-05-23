审核客户绑定
<template>
  <div>
    <!-- 头部 -->
    <div class="search_bar">
      <el-select v-model="userNameValue" clearable filterable placeholder="请输入你要查询的用户名">
        <el-option v-for="item in userNameValueOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="nameValue" clearable filterable placeholder="请输入你要查询的绑定公司名称">
        <el-option v-for="item in nameValueOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="numValue" clearable filterable placeholder="请输入你要查询的授权人身份证号">
        <el-option v-for="item in numValueOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" @click="query"> 查询 </el-button>
      <div class="right">
        <el-button type="primary" size="small" @click="replaceFun"> 刷新 </el-button>
      </div>

    </div>
    <!-- table -->
    <div>
      <el-table :data="datas" :highlight-current-row=true style="width: 100%;" border :height="Height"
        :default-sort="{prop: 'approvalStatus', order: 'descending'}" highlight-current-row v-loading="loading"
        element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.5)">
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="clientNoInner" label="绑定客户编号"> </el-table-column>
        <el-table-column prop="companyNameInner" label="绑定公司名称"> </el-table-column>
        <el-table-column prop="clientNameInner" label="绑定授权人"> </el-table-column>
        <el-table-column prop="legalPersonIdInner" label="授权人证件号"> </el-table-column>
        <el-table-column prop="bindDate" label="申请绑定日期"> </el-table-column>
        <el-table-column prop="updateTime" label="审核时间"> </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-select v-model="scope.row.approvalStatus" placeholder="请选择审核状态" size="small"
              @change="switchChange(scope.$index, scope.row)" :disabled="scope.row.approvalStatus != 0">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- page -->
    <Page :total="total" @update:pageSize="changePageSize" @update:page="changePage"></Page>
    <!-- dialog -->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
        <el-form :model="form">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <!--  <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editSubmit">确定</el-button> -->
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import Page from '@/components/page'

  export default {
    name: "audit",
    data() {
      return {
        permissionShow: false,
        datas: [],
        options: [{
          value: '-1',
          label: '审核失败'
        }, {
          value: '0',
          label: '审核中'
        }, {
          value: '1',
          label: '审核通过'
        }, ],
        dialogVisible: false,
        form: {
          name: '',
          description: '',
          id: ""
        },
        formLabelWidth: '120px',
        batchIndex: [],
        dialogTitle: "",
        selected: '',
        loading: true,

        statusOptions: [{
          label: "禁止",
          value: -1
        }, {
          label: "允许",
          value: 1
        }],
        status: '',
        dealClass: '', //切换选项卡颜色用的类名
        userNameValue: '',
        mobilValue: '',
        nameValue: '',
        numValue: '',

        userNameValueOptions: [],
        mobilValueOptions: [],
        nameValueOptions: [],
        numValueOptions: [],

        // 页码
        page: 1,
        total: 20,
        pageSize: 20,
      }
    },
    created() {
      this.query()
      this.userGet()
      this.GongsiGet()
      // this.numGet()
      this.shenfenGet()
      // this.dateGet()
    },
    methods: {
      tatusChange(val) {
        if (val == -1) {
          this.dealClass = "deal-status1"
        }
        if (val == 1) {
          this.dealClass = "deal-status2"
        }
      },
      query() {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/queryPageAllWebClientBindInfo.do', this.qs.stringify({
            pageno: this.page,
            pagesize: this.pageSize,
            username: this.userNameValue,
            companyNameInner: this.nameValue,
            legalPersonIdInner: this.numValue,
            approvalStatuss: [0]
          })).then(result => {
            if (result) {
              this.datas = result.data.page.datas
            } else {
              this.datas = []
            }
            this.loading = false
          })
        })
      },
      userGet(val) {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/queryAllUsernames.do').then(result => {
            if (result) {
              let Arr = []
              result.data.usernames.forEach(item => {
                Arr.push({
                  value: item,
                  lable: item
                })
              })
              this.userNameValueOptions = Arr
            } else {
              this.userNameValueOptions = []
            }
          })
        })
      },
      GongsiGet(val) {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/queryAllCompanyNames.do').then(result => {
            if (result) {
              let Arr = []
              result.data.companyNames.forEach(item => {
                Arr.push({
                  value: item,
                  lable: item
                })
              })
              this.nameValueOptions = Arr
            }
          })
        })
      },
      numGet(val) {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/queryAllPhoneNumbers.do').then(result => {
            if (result) {
              let Arr = []
              result.data.phoneNumbers.forEach(item => {
                Arr.push({
                  value: item,
                  lable: item
                })
              })
              this.mobilValueOptions = Arr
            }
          })
        })
      },
      shenfenGet(val) {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/queryAllLegalPersonIdInners.do').then(result => {
            if (result) {
              let Arr = []
              result.data.legalPersonIds.forEach(item => {
                Arr.push({
                  value: item,
                  lable: item
                })
              })
              this.numValueOptions = Arr
            }
          })
        })
      },
      // dateGet(val) {
      //   
      //   $.ajax({
      //     type: "post",
      //     url: `${ajaxurl}manage/client/queryAllBindDate.do`,
      //     success(result) {
      //       redirect(result, this)
      //       console.log("dateGet")
      //       console.log(result)
      //       let Arr = []
      //       $.each(result.bindDates,(index,item) => {
      //         Arr.push({
      //           value:item,
      //           lable:item
      //         })
      //       })
      //       this. = Arr
      //     }
      //   })
      // },

      replaceFun: function () {
        window.location.reload(true);
      },
      open(index, row) {
        console.log(row)
        this.$confirm('此操作将更改用户审核状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.switchChanges(index, row)
          console.log("确定")
        }).catch(() => {
          this.cancle(index, row)
        });
      },
      cancle(index, row) {
        console.log(row)
        row.approvalStatus = '0'
        this.$message({
          type: "warning",
          message: "已取消操作",
        })
      },
      switchChange(index, row, val) {
        console.log(val)
        this.open(index, row)
      },
      switchChanges: function (index, row) {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/approvalClientBind.do', this.qs.stringify({
            clientBindId: row.id,
            clientIdInner: row.clientId,
            approvalStatus: row.approvalStatus
          })).then(result => {
            if (result) {
              this.$message({
                type: 'success',
                message: '操作成功!',
                showClose: true
              });
              this.query()
            }
          })
        })
      },
      // 分页器的事件处理函数
      changePageSize(val) {
        this.pageSize = val
        this.query()
      },
      changePage(val) {
        this.page = val
        this.query()
      },
    },
    computed: {
      ...mapGetters(['Height']),
      totalPrice() {
        for (var i = 0; i < this.datas.length; i++) {
          if (this.datas[i].approvalStatus == "0") {
            this.datas[i].approvalStatus = false;
          } else {
            this.datas[i].approvalStatus = true;
          }
        }
        return this.datas
      }
    },
    components: {
      Page
    },
  }
</script>

<style scoped>
  .deal-status1 input {
    color: red !important;
  }

  .deal-status2 input {
    color: green !important;
  }
</style>