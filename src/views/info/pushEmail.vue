<template>
  <div id="edit_phone">
    <HeadBack title="修改绑定邮箱"></HeadBack>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm" label-position="right">
      <el-form-item label="原邮箱" prop="oldEmail">
        <el-input type="text" v-model="ruleForm2.oldEmail" auto-complete="off" placeholder="请输入原绑定邮箱"></el-input>
      </el-form-item>
      <el-form-item label="登陆密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="新邮箱" prop="email">
        <el-input v-model="ruleForm2.email" placeholder="请输入绑定邮箱"></el-input> 
        <el-button class="btn" :disabled="disabled" @click="getyzm">{{btnvalue}}</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="yzm">
        <el-input type="text" v-model="ruleForm2.yzm" auto-complete="off" placeholder="请输入验证码"></el-input>
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
    name: "pushEmail",
    data() {
      var valoldEmail = (rule, value, callback) => {
        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        if (!value) {
          return callback(new Error('原邮箱不能为空'));
        }
        // if (!reg.test(value)) {
        //   return callback(new Error('原邮箱格式有误'));
        // }
      };
      var checkYzm = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('验证码不能为空'));
        }
      };
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
      var checkEmail = (rule, value, callback) => {
        let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        }
        // if (!reg.test(value)) {
        //   return callback(new Error('邮箱格式有误'));
        // }
      };
      return {
        ruleForm2: {
          oldEmail:'',
          pass: '',
          yzm: '',
          email:'',
        },
        rules2: {
          oldPhone: [{
            validator: valoldEmail,
            trigger: 'blur'
          }],
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          yzm: [{
            validator: checkYzm,
            trigger: 'blur'
          }],
          phone: [{
            validator: checkEmail,
            trigger: 'blur'
          }]
        },
        disabled:false,
        btnvalue:'获取验证码',
        num:60,
        flag:false,   //用于必须点击获取验证码
        can:true,
      };
    },
    methods: {
      getyzm(){
        let reg =  new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
        if(!this.ruleForm2.email){
          this.$Message.error('请先填写邮箱');
          return
        }
        // if(!reg.test(this.ruleForm2.email)){
        //   this.$Message.error('请正确填写您的邮箱');
        //   return
        // }
        this.disabled = true
        this.flag = true
        axios.post('client/sendValCode.do',this.qs.stringify({
          pe: this.ruleForm2.email,
			    verificationCodeType: 'UPDATE_LOGIN_EMAIL_CODE'
        })).then(result => {
          
        })
        let time = setInterval(()=>{
          this.num = this.num-1
          this.btnvalue = this.num
          if(this.num == 0){
          clearInterval(time)
          this.num = 60
          this.btnvalue = "获取验证码"
          this.disabled = false
        }
        },1000)
        
      },
      submitForm(formName) {
        this.can = true
        if(!this.flag){
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
        if(this.can){
         
          axios.post('client/updateClientBaseInfoEmail.do',this.qs.stringify({
            oldEmail: this.ruleForm2.oldEmail,
            loginPassword: this.ruleForm2.pass,
            newEmail: this.ruleForm2.email,
            valcode: this.ruleForm2.yzm.toString().replace(/^\s*|\s*$/g,"")
          })).then(res => {
            if(res) {
              this.ruleForm2.oldEmail = ''
              this.ruleForm2.pass = ''
              this.ruleForm2.email = ''
              this.ruleForm2.yzm = ''
              this.$router.replace('/personalIfo')
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
        this.ruleForm2.oldEmail = ''
        this.ruleForm2.pass = ''
        this.ruleForm2.yzm = ''
        this.ruleForm2.email = ''

        this.$refs.ruleForm2.resetFields()  //重置提示信息
      }
    }
  }

</script>

<style scoped>
.demo-ruleForm {
  margin-top: 35px;
  padding:20px;
  margin-left:-30px;
}
.el-form-item {
  position: relative;
}
.btn {
  position:absolute;
  right: 0;
  top: 0;
}
</style>
