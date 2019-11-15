<template>
  <div id="bangding_info" class="Transactions_contrnt">
    <HeadBack title="绑定开户信息">
      <el-button @click="bang" class="daochu" size="mini" type="primary" slot="btn"
        style="position:absolute;right:5px;top:6px;">绑定线下账户</el-button>
    </HeadBack>
    <el-table :data="clientBinds" style="width: 100%;margin-top:42px;" row-key="id" :expand-row-keys="entexpands" border @row-click="rowExpand">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row style="margin-bottom:10px">
              <el-col>
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="绑定时间：">
                    <span>{{ props.row.bindDate }}</span>
                  </el-form-item>
                  <el-form-item label="绑定状态：">
                    <span>{{ props.row.approvalStatus | changeStatus }}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row style="margin-bottom:10px">
              <p>
                <el-button @click="updateClientBindPassword(props.row.id)" size="mini" type="primary">修改交易密码</el-button>
              </p>
            </el-row>
            <el-row style="margin-bottom:10px">
              <p>
                <el-button @click="gotoSub(props.row.id)" size="mini" type="primary" :disabled="!(props.row.approvalStatus == 1)">开通业务信息</el-button>
              </p>
            </el-row>
            <el-row style="margin-bottom:10px">
              <p>
                <el-button @click="editClientBindEmail(props.row.id)" size="mini" type="primary">
                  编辑邮箱信息</el-button>
              </p>
            </el-row>
            <el-row style="margin-bottom:10px">
              <el-button @click="setDefault(props.row.id)" size="mini" type="primary">将该账户设置为默认账户
              </el-button>
            </el-row>
            <el-row>
              <el-button @click="DelClientBindPassword(props.row.id)" size="mini" type="primary">删除
              </el-button>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="线下账户编号" prop="clientNoInner">
      </el-table-column>
      <el-table-column label="公司名称" prop="companyNameInner">
      </el-table-column>
      <el-table-column label="授权人" prop="clientNameInner">
      </el-table-column>
    </el-table>
    <!-- 删除绑定信息 -->
    <el-dialog title="删除绑定信息" :visible.sync="BindDialog" width="90%" center>
      <el-input v-model="BindDialogPaw" placeholder="交易密码" type="password" size="small"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="BindDialog = false">取 消</el-button>
        <el-button type="primary" @click="BindDialogBtn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import HeadBack from '../components/HeadBack.vue'
  import axios from '../axios'
  export default {
    name: "bangDing",
    data() {
      return {
        clientBinds: [],
        BindDialog: false,
        BindDialogPaw: '',
        entexpands: [],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        axios.post('clientbind/queryAll.do').then(res => {
          if(!res) {
            this.clientBinds = []
          }
          if (res.data.success) {
            this.clientBinds = res.data.clientBinds;
          }
        })
      },
      bang() {
        this.$router.push('/bang')
      },
      updateClientBindPassword(id) {
        this.$store.commit('changebdID', id)
        this.$router.push('/changePass')
      },
      gotoSub(id){
        this.$store.commit('changebdID', id)
        this.$router.push('/subAccount')
      },
      editClientBindEmail(id) {
        this.$store.commit('changebdID', id)
        this.$router.push('/changeEmail')
      },
      DelClientBindPassword(id) {

        this.$store.commit('changebdID', id)
        this.BindDialog = true
      },
      BindDialogBtn() {
        if (this.BindDialogPaw == "") {
          this.$Message.warning('请输入交易密码');
          return false;
        }
        axios.post('clientbind/deleteClientBindById.do', this.qs.stringify({
          clientBindId: this.bdID,
          tradePassword: this.BindDialogPaw
        })).then(res => {      
          if(res) {
            this.$Message.warning('删除成功');
            this.getData()
          }
          this.BindDialogPaw = ''
          this.BindDialog = false

        })
      },
      setDefault(id){
        this.$store.commit('changebdID', id)
        axios.post('clientbind/checkedClientBind.do',this.qs.stringify({
          clientBindId:this.bdID
        })).then(res => {
          if(res) {
            this.$Message.success("设置成功")
          }
        })
      },
      // 将点击箭头显示事件注册为点击整行显示
      rowExpand(row, event, column) {
        Array.prototype.remove = function (val) {
          let index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };
        if (this.entexpands.indexOf(row.id) < 0) {
          this.entexpands = [];
          this.entexpands.push(row.id);
        } else {
          this.entexpands.remove(row.id);
        }
      },
    },
    components: {
      HeadBack
    },
    computed: {
      userID() {
        return this.$store.state.userID
      },
      bdID() {
        return this.$store.state.bdID
      }
    },
    filters: {
      changeStatus(val) {
        if (val == 1) {
          return "绑定成功"
        }
        if (val == 0) {
          return "绑定待审核"
        }
        if (val == -1) {
          return "绑定失败"
        }
      },
    },
    watch:{
      $route(to ,from) {
        if(to.name == "bangDing") {
          this.getData()
        }
      }
    }
  }

</script>

<style>

</style>
