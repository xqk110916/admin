<template>
  <div id="edit_phone">
    <HeadBack title="重置密码"></HeadBack>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm"
      label-position="right">
      <el-form-item label="账号" prop="phone">
        <el-input v-model="ruleForm2.phone" placeholder="请输入登陆手机号或邮箱"></el-input>
        <el-button class="btn" :disabled="disabled" @click="getyzm">{{btnvalue}}</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="yzm" placeholder="请输入验证码">
        <el-input type="text" v-model="ruleForm2.yzm" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="登陆密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="密码为8到16位的字母和数字组合"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import HeadBack from '../../components/HeadBack.vue'
  import axios from '../../axios'
  export default {
    name: "addPhone",
    data() {
      var checkYzm = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('验证码不能为空'));
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          // if (this.ruleForm2.checkPass !== '') {
          //   this.$refs.ruleForm2.validateField('checkPass');
          // }
          // callback();
          if(value.length<8 || value.length>16) {
             callback(new Error('密码为8到16位数'));
          }
        }
      };
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
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
          pass: '',
          yzm: '',
          phone: '',
          checkPass:'',
        },
        rules2: {
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          yzm: [{
            validator: checkYzm,
            trigger: 'blur'
          }],
          phone: [{
            validator: checkPhone,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
        },
        disabled: false,
        btnvalue: '获取验证码',
        num: 60,
        flag: false, //用于必须点击获取验证码
        can: true,
      };
    },
    methods: {
      getyzm() {
        // let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        if(!this.ruleForm2.phone){
          this.$Message.error('请先填写邮箱或手机号');
          return
        }
        // if(this.ruleForm2.phone.toString().length != 11) {
        //   if(!reg.test(this.ruleForm2.phone)) {
        //     this.$Message.error('请正确填写邮箱或手机号');
        //     return
        //   }
        // }

        this.disabled = true
        this.flag = true
        axios.post('client/sendValCode.do', this.qs.stringify({
          pe: this.ruleForm2.phone,
          verificationCodeType: 'RESET_LOGIN_CODE'
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
        this.can = true
        if (!this.flag) {
          this.$Message.error('请先获取验证码');
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid == false) {
            this.can = false
            this.$Message.error('请处理错误信息后再提交');
            return false;
          }
        });
        if (this.can) {

          axios.post('client/forgotLoginPassword.do', this.qs.stringify({
            pe: this.ruleForm2.phone,
            loginPassword: this.ruleForm2.pass,
            valcode: this.ruleForm2.yzm.toString().replace(/^\s*|\s*$/g,"")
          })).then(res => {
            if(res.data.success){
              this.$Message.success("重置密码成功，已帮您自动跳转到登陆界面..")
              this.$router.replace('/Login')
            }        
          })
        }

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    components: {
      HeadBack
    },
    watch: {
      $route(to, from) {
        this.ruleForm2.pass = ''
        this.ruleForm2.yzm = ''
        this.ruleForm2.phone = ''
        this.ruleForm2.checkPass = ''

        this.$refs.ruleForm2.resetFields()  //重置提示信息
      }
    }
  }

</script>

<style scoped>
  .demo-ruleForm {
    margin-top: 35px;
    padding: 20px;
    margin-left: -30px;
  }

  .el-form-item {
    position: relative;
  }

  .btn {
    position: absolute;
    right: 0;
    top: 0;
  }

</style>
