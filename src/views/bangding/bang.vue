<template>
  <div id="edit_phone">
    <HeadBack title="绑定线下账户"></HeadBack>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm"
      label-position="right">
      <el-form-item label="线下账户编号">
        <el-input type="text" v-model="ruleForm2.no" auto-complete="off" placeholder="请输入您要绑定的线下账户" @blur="clientNo">
        </el-input>
      </el-form-item>
      <el-form-item label="公司名称">
        <el-input type="text" v-model="ruleForm2.gsname" auto-complete="off" placeholder="请输入您要绑定的公司名称"
          @blur="clientGsname"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input type="text" v-model="ruleForm2.name" auto-complete="off" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input type="text" v-model="ruleForm2.sfz" auto-complete="off" placeholder="请输入身份证号" @blur="clientSfz">
        </el-input>
      </el-form-item>
      <el-form-item label="交易密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="交易密码为6位数"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入交易密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱(选填)" :class="[{isShow:isShow},'email']">
        <el-input type="text" v-model="ruleForm2.email" auto-complete="off" placeholder="可以添加多个之间用逗号隔开"></el-input>
        <!-- <el-button @click="del" class="del">删除</el-button> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addEmail" class="addEmail">添加接受交易确认书邮箱</el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked">我已阅读并同意</el-checkbox>
        <span @click="read" style="color:#409EFF;">风险揭示书</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')" style="width:30%;" :loading="loading">提交</el-button>
        <el-button @click="resetForm('ruleForm2')" style="width:30%;" type="danger">重置</el-button>
      </el-form-item>
    </el-form>

     <!-- 风险揭示书 -->
    <el-dialog title="风险揭示书" :visible.sync="dialogVisible" width="80%">
      <el-input type="textarea" :rows="20" v-model="book" disabled>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import HeadBack from '../../components/HeadBack.vue'
  import axios from '../../axios'
  export default {
    name: "changePass",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          no: '',
          name: '',
          gsname: '',
          sfz: '',
          pass: '',
          checkPass: '',
          email: '',
        },
        rules2: {
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
        },
        can: true,
        isShow: true,
        flag1: false,
        flag2: false,
        flag3: false,
        checked: false,
        dialogVisible: false,
        book: '',
        loading: false,
      };
    },
    methods: {
      read() {
        let _this = this
        let xhr = new XMLHttpRequest()
        xhr.open("GET", `RiskDisclosure.txt`)
        xhr.send()
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            _this.book = xhr.responseText
          }
        }
        this.dialogVisible = true
      },
      submitForm(formName) {
        if (!this.checked) {
          this.$Message.error('请阅读并勾选风险揭示书');
          return
        }
        this.can = true
        this.$refs[formName].validate((valid) => {
          if (valid == false) {
            this.can = false
            this.$Message.error('请处理错误信息后再提交');
            return false;
          }
        });
        if (this.can) {
          if (this.flag1 && this.flag2 && this.flag3) {

          } else {
            this.clientSfz().then(()=>{},()=>{
              this.$Message.error('信息填写不对称，没有找到对应的用户');
              return
            })
          }
          this.loading = true
          axios.post('client/addClientBind.do', this.qs.stringify({
            phoneno: this.obj.phoneNumber,
            loginEmail: this.obj.email,
            clientNoInner: this.ruleForm2.no,
            companyNameInner: this.ruleForm2.gsname,
            clientNameInner: this.ruleForm2.name,
            legalPersonIdInner: this.ruleForm2.sfz,
            tradePassword: this.ruleForm2.pass,
            bindEmails: this.ruleForm2.email,
            isChecked: 0,
          })).then(res => {
            this.loading = false
            if (res.data.success) {
              this.$Message.success('绑定申请正在审核中');
              this.$router.replace('/bangDing')
              this.ruleForm2.no = ''
              this.ruleForm2.gsname = ''
              this.ruleForm2.name = ''
              this.ruleForm2.sfz = ''
              this.ruleForm2.pass = ''
              this.ruleForm2.email = ''
              this.ruleForm2.checkPass = ''
            } else {
              // this.ruleForm2.no = ''
              // this.ruleForm2.gsname = ''
              // this.ruleForm2.name = ''
              // this.ruleForm2.sfz = ''
              // this.ruleForm2.pass = ''
              // this.ruleForm2.email = ''
              
            }
          })
        }

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      addEmail() {
        this.isShow = false
      },
      del() {
        this.isShow = true
      },
      // 检验表格数据
      clientNo() {
        axios.post('client/checkoutClientNumber.do', this.qs.stringify({
          clientNoInner: this.ruleForm2.no
        })).then(res => {
          if (res) {
            this.flag1 = true
          } else {
            this.flag1 = false
          }
        })
      },
      clientGsname() {
        axios.post('client/checkoutClientNumberAndClientName.do', this.qs.stringify({
          clientNoInner: this.ruleForm2.no,
          companyNameInner: this.ruleForm2.gsname,
        })).then(res => {
          if (res) {
            this.flag2 = true
          } else {
            this.flag2 = false
          }
        })
      },
      clientSfz() {
        return new Promise((resolve, reject) => {
          let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
          if (!reg.test(this.ruleForm2.sfz)) {
            this.$Message.error("身份证格式错误")
          }
          axios.post('client/checkoutClientNumberAndClientNameAndAuthorizerNameAndAuthorizerId.do', this.qs.stringify({
            clientNoInner: this.ruleForm2.no,
            companyNameInner: this.ruleForm2.gsname,
            clientNameInner: this.ruleForm2.name,
            legalPersonIdInner: this.ruleForm2.sfz
          })).then(res => {
            if (res) {
              this.flag3 = true
              resolve()
            } else {
              this.flag3 = false
              reject()
            }
          })
        })
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
        this.ruleForm2.no = ''
        this.ruleForm2.gsname = ''
        this.ruleForm2.name = ''
        this.ruleForm2.sfz = ''
        this.ruleForm2.pass = ''
        this.ruleForm2.email = ''
        this.ruleForm2.checkPass = ''

        this.can = true
        this.isShow = true
        this.flag1 = false
        this.flag2 = false
        this.flag3 = false
        this.checked = false
        this.dialogVisible = false
        this.loading = false

        this.$refs.ruleForm2.resetFields()  //重置提示信息
      }
    }
  }

</script>

<style scoped>
  #edit_phone {
    max-width: 750px;
    margin: 0 auto;
  }

  .demo-ruleForm {
    margin-top: 35px;
    padding: 20px;
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

  .isShow {
    display: none;
  }

  .del {
    position: absolute;
    right: 0;
    top: 0;
  }

  .email {
    position: relative;
  }

  .addEmail {
    width: 100%;
    position: relative;
    left: -40px;
  }

</style>
