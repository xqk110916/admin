<template>
  <div id="edit_phone">
    <HeadBack title="编辑邮箱信息"></HeadBack>

    <div id="editclientemail">
      <p v-if="clientBindEmails.length == 0" style="text-align:center;color:#ccc"> 暂无邮箱信息 </p>
      <div v-for="item in clientBindEmails" class="emails">
        <el-input v-model="item.bindEmail" disabled></el-input>
        <i @click="delclientemailinfo()" class="el-icon-delete ico" :class="{ dispnone: dispnone}"></i>
      </div>   
      <!-- <p v-else v-for="c in clientBindEmails" class="emails">{{c.bindEmail}} <i @click="delclientemailinfo(c.id)"
          class="el-icon-delete" :class="{ dispnone: dispnone}"></i> </p> -->
      <div style="text-align:center;margin-top:5px;">
        <el-button type="primary" size="mini" @click="addEmailDialog = true">新增邮箱</el-button>
        <el-button type="primary" size="mini" @click="dispnone = !dispnone">编辑</el-button>
      </div>

      <!-- 新增邮箱 -->
      <el-dialog title="新增邮箱" :visible.sync="addEmailDialog" width="90%" center>
        <el-input v-model="addBindDialogEmail" placeholder="可以有多个，中间用逗号分隔" size="small"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addEmailDialog = false">取 消</el-button>
          <el-button type="primary" @click="addEmailDialogBtn()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 删除邮箱 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="80%">
        <span>该操作将会删除您所选的邮箱。请确认您的操作</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="enterDel">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import HeadBack from '../../components/HeadBack.vue'
  import axios from '../../axios'
  export default {
    name: "changeEmail",
    data() {
      return {
        clientBindEmails: [],
        dispnone: true,
        addEmailDialog: false,
        addBindDialogEmail: '',
        dialogVisible:false,
      }
    },
    created() {
      this.getBDemail()
    },
    methods: {
      getBDemail() {
        axios.post('clientbindemail/queryClientBindEmailsByClientBindId.do', this.qs.stringify({
          clientBindId: this.bdID
        })).then(res => {
          if (res) {
            this.clientBindEmails = res.data.clientBindEmails
          }
        })
      },
      delclientemailinfo() {
        this.dialogVisible = true
      },
      enterDel(){
        axios.post('clientbindemail/deleteClientBindEmailById.do',this.qs.stringify({
          clientBindEmailId:this.bdID
        })).then( res => {
          console.log(res)
          if(res) {
            this.$Message.success('删除成功');
            this.dialogVisible = false
            this.getBDemail()
          } else {
            this.dialogVisible = false
          }
        })
      },
      addEmailDialogBtn() {
        // let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        // if (!reg.test(this.addBindDialogEmail)) {
        //   this.$Message.warning('邮箱格式有误');
        //   return
        // }

        let arr = this.addBindDialogEmail.split(",")
        for(let i=0;i<arr.length;i++) {
          if(i!=0 && arr[i == arr[i-1]]) {
            this.$Message.error("两个邮箱不能一样")
            return
          }
          for(let j=0;j<this.clientBindEmails.length;j++) {
            if(arr[i] ==this.clientBindEmails[j].bindEmail) {
              this.$Message.error("该邮箱已绑定，请确认后重试")
              return
            }
          }
        }

        axios.post('clientbindemail/addClientBindEmails.do', this.qs.stringify({
          clientBindId: this.bdID,
          bindEmails: this.addBindDialogEmail,
        })).then(res => {
          if (res.data.success) {
            this.addEmailDialog = false
            this.addBindDialogEmail = ""
            this.$Message.success('新增成功')
            this.getBDemail()
          } else {

          }
        })
      },
    },
    components: {
      HeadBack
    },
    computed: {
      bdID() {
        return this.$store.state.bdID
      }
    },
    watch: {
      $route(to, from) {
        this.addBindDialogEmail = ''
      }
    }
  }

</script>

<style scoped>
  .demo-ruleForm {
    margin-top: 30px;
    padding: 10px;
    margin-left: -25px;
  }

  .el-form-item {
    position: relative;
  }

  .btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .dispnone {
    display: none;
  }

  #editclientemail {
    margin-top: 42px;
  }

  .emails {
    font-size: 16px;
    padding: 2px 15px;
    position: relative;
  }

  .ico {
    position: absolute;
    right: 17px;
    top: 12px;
  }
  
</style>
