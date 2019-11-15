<template>
  <div id="edit_info" class="Transactions_contrnt">
      <HeadBack title="个人资料"></HeadBack>
			<p class="edit_info_item" style="margin-top:42px;">
				用户名
				<span style="float:right"> {{username}} </span>
			</p>
			<p class="edit_info_item" v-if="!client.phoneNumber">
				添加手机号
				<span @click="addPhone"> <i class="el-icon-arrow-right"></i> </span>
			</p>
      <p class="edit_info_item" v-if="client.phoneNumber">
				手机号
				<span @click="pushPhone"> {{client.phoneNumber}} <i class="el-icon-arrow-right"></i> </span>
			</p>
			<p class="edit_info_item" v-if="!client.email">
				添加邮箱
				<span @click="addEmail"> {{client.email}} <i class="el-icon-arrow-right"></i> </span>
			</p>
      <p class="edit_info_item" v-if="client.email">
				邮箱
				<span @click="pushEmail"> {{client.email}} <i class="el-icon-arrow-right"></i> </span>
			</p>
			<p class="edit_info_item">
				绑定外场个数
				<span> {{size}} </span>
			</p>
			<p class="edit_info_item">
				密码
				<span @click="changePW"> 更换密码 <i class="el-icon-arrow-right"></i> </span>
			</p>
		</div>
</template>

<script>
import HeadBack from '../components/HeadBack.vue'
import axios from '../axios'
export default {
  name:'personalIfo',
  data(){
    return {
      client:{
        phoneNumber:'',
        email:'',
      },
    }
  },
  created(){
    this.getInfo()
  },
  computed:{
    username(){
      return this.$store.state.username
    },
    size(){
      return this.$store.state.size
    },
  },
  methods:{
    getInfo(){
      axios.post('client/queryClientBaseInfo.do').then(result => {
        this.client.phoneNumber = result.data.client.phoneNumber
        this.client.email = result.data.client.email
      })
    },
    // 路由跳转
    pushPhone(){
      this.$router.push('/pushPhone')
    },
    pushEmail(){
      this.$router.push('/pushEmail')
    },
    addPhone(){
      this.$router.push('/addPhone')
    },
    addEmail(){
      this.$router.push('/addEmail')
    },
    changePW(){
      this.$router.push('/changePW')
    },
  },
  components:{
    HeadBack
  },
  watch:{
    $route(to ,from) {
      if(to.name == 'personalIfo') {
        this.getInfo()
      }
    }
  }
}
</script>

<style>
#edit_info .edit_info_item {width:100%;height:40px;margin:2px 0 0 0;padding:0 10px;line-height:40px;border-bottom:1px solid #ccc;border-top:1px solid #ccc;}
#edit_info .edit_info_item span {float:right;color:#666;}
.el-icon-arrow-right {
  color:#000;
}
#edit_info {
  max-width: 750px;
  margin: 0 auto;
}
</style>
