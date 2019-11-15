<template>
  <div id="edit_phone">
    <HeadBack title="添加手机号"></HeadBack>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm" label-position="right">
      <el-form-item label="登陆密码" prop="pass">
        <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="请输入登陆密码"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.number="ruleForm2.phone" placeholder="请输入你要添加的手机号"></el-input> 
        <el-button class="btn" :disabled="disabled" @click="getyzm">{{btnvalue}}</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="yzm" placeholder="请输入验证码">
        <el-input type="text" v-model="ruleForm2.yzm" auto-complete="off"></el-input>
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
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }
        if (value.toString().length != 11) {
          return callback(new Error('手机号格式有误'));
        }
      };
      return {
        ruleForm2: {
          pass: '',
          yzm: '',
          phone:'',
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
        if(!this.ruleForm2.phone){
          this.$Message.error('请先填写手机号');
          return
        }
        if(this.ruleForm2.phone.toString().length != 11){
          this.$Message.error('请正确填写您的手机号');
          return
        }
      
        this.disabled = true
        this.flag = true
        axios.post('client/sendValCode.do',this.qs.stringify({
          pe: this.ruleForm2.phone,
			    verificationCodeType: 'ADD_LOGIN_PHONENO_CODE'
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
        
          axios.post('client/addClientLoginPhoneno.do',this.qs.stringify({
            phoneno:this.ruleForm2.phone,
            password:this.ruleForm2.pass,
            valCode:this.ruleForm2.yzm.toString().replace(/^\s*|\s*$/g,"")
          })).then(res => {
            if(res){
              this.ruleForm2.pass = ''
              this.ruleForm2.phone = ''
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
        this.ruleForm2.pass = ''
        this.ruleForm2.yzm = ''
        this.ruleForm2.phone = ''

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
