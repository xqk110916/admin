查看web段所有客户
<template>
  <div>
    <!-- 头部 -->
    <div class="search_bar">
      <el-select v-model="userNameValue" multiple filterable placeholder="请输入你要查询的用户名">
        <el-option v-for="item in userNameValueOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="status" multiple placeholder="请选择是否允许登陆" :class="[dealClass]" @change="statusChange"
        clearable>
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="right">
        <el-button type="primary" size="small" @click="query"> 查询 </el-button>
        <el-button type="primary" size="small" @click="replaceFun"> 刷新 </el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table_box">
      <el-table :data="datas" stripe style="width: 50%;" border :height="Height" @row-click="seeDetails" stripe fit
        class="tables" highlight-current-row>
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="bindNumber" label="绑定编号"> </el-table-column>
        <el-table-column prop="phoneNumber" label="电话号码"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column label="是否允许登陆" width="130">
          <template slot-scope="scope">
            <div>
              <span>禁止</span>
              <el-tooltip :content="tip" placement="top">
                <el-switch v-model="scope.row.lockStatus" active-color="#13ce66" inactive-color="#ff4949"
                  active-value="0" @change="switchChange(scope.$index, scope.row)" inactive-value="1">
                </el-switch>
              </el-tooltip>
              <span>允许</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data=details stripe style="width: 50%;" border :height="Height" stripe fit class="tables"
        highlight-current-row>
        <el-table-column type="index" width="60"> </el-table-column>
        <el-table-column prop="clientNoInner" label="客户编号"> </el-table-column>
        <el-table-column prop="clientNameInner" label="授权人"> </el-table-column>
        <el-table-column prop="companyNameInner" label="公司名称"> </el-table-column>
        <el-table-column prop="legalPersonIdInner" label="身份证号码"> </el-table-column>
        <el-table-column prop="clientBindEmails" label="邮箱"> </el-table-column>
        <el-table-column prop="bindDate" label="客户绑定日期"> </el-table-column>
        <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
        <el-table-column prop="approvalStatus" label="审核状态" :formatter="changeApprovalStatus"> </el-table-column>
      </el-table>
    </div>
    <!-- 翻页 -->
    <Page :total="total" @update:pagesize="changePageSize" @update:page="changePage"></Page>
  </div>
</template>

<script>
  import Page from '@/components/page'
  import { mapGetters } from 'vuex'
  export default {
    name: "allClient",
    data() {
      return {
        details: [],
        datas: [],
        oldStatus: '',
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
        statusOptions: [{
          label: "禁止",
          value: 1
        }, {
          label: "允许",
          value: 0
        }],
        status: [],
        dealClass: '', //切换选项卡颜色用的类名
        userNameValue: [],
        userNameValueOptions: [],
        mobilValue: '',
        nameValue: '',
        numValue: '',
        tip: "当前用户",

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

        page: 1,
        pageSize: 20,
        total: 20,
      }
    },
    created() {
      // this.userGet()
      // this.getData()
    },
    methods: {
      getData() {

        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/queryPageAllWebClientAllInfo.do', this.qs.stringify({
            pageno: this.page,
            pagesize: this.pageSize,
            usernames: this.userNameValue,
            lockStatuss: this.status,
          })).then(result => {
            if(result) {
              this.datas = result.data.page.obj
            } else {
              this.datas = []
            }
          })
        })
      },
      // 用户名的获取
      userGet(val) {
        
        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/queryAllUsernames.do').then(result => {
            if(result) {
              let Arr = []
              result.data.usernames.forEach(item => {
                Arr.push({
                  value: item,
                  lable: item
                })
              })
              this.userNameValueOptions = Arr
            }
          })
        })

      },
      seeDetails(row) {
        let arr = []
        for (let i = 0; i < row.clientBinds.length; i++) {
          if (!row.clientBinds[i].clientNoInner) {
            this.details = []
            return
          }
          if (row.clientBinds[i].approvalStatus == '1') {
            let str = ''
            let emails = []
            for (let j = 0; j < row.clientBinds[i].clientBindEmails.length; j++) {
              if (typeof row.clientBinds[i].clientBindEmails == "string") {
                this.details = row.clientBinds
                return
              }
              emails.push(row.clientBinds[i].clientBindEmails[j].bindEmail)
            }
            if (emails.length) {
              str = emails.join('/')
            }
            row.clientBinds[i].clientBindEmails = str
            arr.push(row.clientBinds[i])
          }

        }
        this.details = arr
      },
      replaceFun: function () {
        window.location.reload(true);
      },
      statusChange(val) {
        if (val == -1) {
          this.dealClass = "deal-status1"
        }
        if (val == 1) {
          this.dealClass = "deal-status2"
        }
      },
      query() {
        this.getData()
      },
      seeBindCus: function (index, row) {

      },
      switchChanges: function (index, row) {
        var lockStatusValue;
                
        return new Promise((reslove, reject) => {
          this.axios.post('manage/client/updateClientLockStatus.do', this.qs.stringify({
            clientId: row.id,
            lockStatus: row.lockStatus
          })).then(result => {
            if(result) {
              this.$message({
                type: 'success',
                message: '修改锁定状态成功!',
                showClose: true
              });
            }
          })
        })
      },
      open(index, row) {
        this.$confirm('此操作将更改用户是否可登陆, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.switchChanges(index, row)
        }).catch(() => {
          this.cancle(index, row)
        });
      },
      cancle(index, row) {
        row.lockStatus = this.oldStatus
        this.$message({
          type: "warning",
          message: "已取消操作",
        })
      },
      switchChange(index, row, val) {
        this.open(index, row)
      },
      changeApprovalStatus(obj) {
        let val = obj.approvalStatus
        if (val == 0) {
          return "审核中"
        }
        if (val == 1) {
          return "审核通过"
        }
        if (val == -1) {
          return "审核失败"
        }
      },

      changePageSize(val) {
        this.pageSize = val
        this.getData()
      },
      changePage(val) {
        this.page = val
        this.getData()
      }
    },
    computed: {
      ...mapGetters(['Height']),
      newValue() {
        for (var i = 0; i < this.datas.length; i++) {
          return this.datas[i].lockStatus
        }
      }
    },
    watch: {
      newValue(newValue, oldValue) {
        this.oldStatus = oldValue
      }
    },
    components: {
      Page
    }
  }
</script>

<style scoped>
.table_box {
  display: flex;
}

.el-table:nth-child(2) {
  margin-left: 10px;
}
</style>