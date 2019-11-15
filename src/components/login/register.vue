<template>
  <div id="edit_phone">
    <HeadBack title="注册"></HeadBack>
    <div class="changeReg">
      <el-button type="primary" :plain="phoneflag" style="width:50%" @click="phonereg">手机号注册</el-button>
      <el-button type="primary" plain style="width:50%" @click="emailreg">邮箱注册</el-button>
    </div>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm"
      label-position="right">
      <el-form-item label="用户名" prop="val">
        <el-input type="text" v-model="ruleForm2.name" auto-complete="off" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item :label="val" prop="phone">
        <el-input v-model="ruleForm2.phone" :placeholder="tipval" type="text"></el-input>
        <el-button class="btn" :disabled="disabled" @click="getyzm">{{btnvalue}}</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="yzm">
        <el-input type="text" v-model="ruleForm2.yzm" auto-complete="off" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="密码为8到16位的字母和数字组合"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked">我已阅读并同意</el-checkbox>
        <span @click="read" style="color:#409EFF;">风险揭示书</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">注册</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 风险揭示书 -->
    <el-dialog title="风险揭示书" :visible.sync="dialogVisible" width="80%" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-input type="textarea" :rows="20" v-model="book" disabled>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import HeadBack from '../../components/HeadBack.vue'
  import axios from '../../axios'
  import g from '@/components/Global.vue'
  export default {
    name: "changePW",
    data() {
      var val = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
      };
      var checkYzm = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('验证码不能为空'));
        }
      };
      var validatePass = (rule, value, callback) => {
        let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(value.toString().length < 8 || value.toString().length > 16 || !reg.test(value)){
          callback(new Error('密码为8到16位的字母和数字组合'));
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
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.val + '不能为空'));
        }
      };
      return {
        ruleForm2: {
          name: '',
          pass: '',
          checkPass: '',
          yzm: '',
          phone: '',
        },
        rules2: {
          name: [{
            validator: val,
            trigger: 'blur'
          }],
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
          yzm: [{
            validator: checkYzm,
            trigger: 'blur'
          }],
          phone: [{
            validator: checkPhone,
            trigger: 'blur'
          }]
        },
        disabled: false,
        btnvalue: '获取验证码',
        num: 60,
        flag: false, //用于必须点击获取验证码
        can: true,
        phoneflag: false,
        regFlag: true,
        val: '手机号',
        tipval: '请输入您的手机号',
        checked: false,
        dialogVisible: false,
        book: '',

      };
    },
    methods: {
      read() {
        let _this = this
        let xhr = new XMLHttpRequest()
        xhr.open("GET", "RiskDisclosure.txt")
        xhr.setRequestHeader("contentType" ,"application/x-www-form-urlencoded; charset=utf-8")
        xhr.send()
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            _this.book = xhr.responseText
          }
        }
        this.dialogVisible = true
      },
      phonereg() {
        this.regFlag = true
        this.val = '手机号'
        this.tipval = '请输入您的手机号'
      },
      emailreg() {
        this.regFlag = false
        this.phoneflag = true
        this.val = '邮箱'
        this.tipval = '请输入您的邮箱'
      },
      getyzm() {
        if (!this.ruleForm2.phone && this.regFlag) {
          this.$Message.error('请先填写手机号');
          return
        }
        // if (this.ruleForm2.phone.toString().length != 11 && this.regFlag) {
        //   this.$Message.error('请正确填写您的手机号');
        //   return
        // }
        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        if (!this.ruleForm2.phone && !this.regFlag) {
          this.$Message.error('请先填写邮箱');
          return
        }
        // if (!reg.test(this.ruleForm2.phone) && !this.regFlag) {
        //   this.$Message.error('请正确填写您的邮箱');
        //   return
        // }
        this.disabled = true
        this.flag = true
        axios.post('client/sendValCode.do', this.qs.stringify({
          pe: this.ruleForm2.phone,
          verificationCodeType: 'REGIST_CODE'
        })).then(result => {

        })
        let time = setInterval(() => {
          this.num = this.num - 1
          this.btnvalue = this.num
          if (this.num == 0) {
            clearInterval(time)
            this.num = 60
            this.btnvalue = "获取验证码"
            this.disabled = false
          }
        }, 1000)

      },
      submitForm(formName) {
        if (!this.checked) {
          this.$Message.error('请阅读并勾选');
          return
        }
        this.can = true
        if (!this.flag) {
          this.$Message.error('请先获取验证码');
          return
        }
        this.$refs[formName].validate((valid) => {
          console.log(valid)
          if (!valid) {
            this.can = false
            this.$Message.error('请处理错误信息后再提交');
            return false;
          }
        });
        if (this.can) {
          if (this.regFlag) {
            axios.post('client/regist.do', this.qs.stringify({
              username: this.ruleForm2.name,
              password: this.ruleForm2.pass,
              phoneno: this.ruleForm2.phone,
              valCode: this.ruleForm2.yzm.toString().replace(/^\s*|\s*$/g,"")
            })).then(res => {

              if (res.data.success) {
                this.$Message.success("注册成功，已帮您自动跳转到登录界面")
                this.$router.replace('/Login')
              }
            })
          } else {
            axios.post('client/regist.do', this.qs.stringify({
              username: this.ruleForm2.name,
              password: this.ruleForm2.pass,
              email: this.ruleForm2.phone,
              valCode: this.ruleForm2.yzm.toString().replace(/^\s*|\s*$/g,"")
            })).then(res => {

              if (res.data.success) {
                this.$Message.success("注册成功，已帮您自动跳转到登录界面")
                this.$router.replace('/Login')
              }
            })
          }

        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    components: {
      HeadBack
    },
    computed:{

    },
    watch:{
      $route(to, from) {
        this.ruleForm2.name = ''
        this.ruleForm2.pass = ''
        this.ruleForm2.checkPass = ''
        this.ruleForm2.yzm = ''
        this.ruleForm2.phone = ''

        this.$refs.ruleForm2.resetFields()  //重置提示信息
      }
    }
  }

</script>

<style scoped>
  .changeReg {
    margin-top: 40px;
    display: flex;
    justify-content: space-around;
    padding: 10px;
  }

  .demo-ruleForm {
    padding: 0 20px;
    margin-left: -35px;
  }

  .el-form-item {
    position: relative;
  }

  .btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  #edit_phone {
    max-width: 750px;
    margin: 0 auto;
  }

  .el-checkbox {
    margin-right: 20px;
  }

</style>
