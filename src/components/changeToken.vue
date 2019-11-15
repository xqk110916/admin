<template>
  <div>
     <!-- 输入密码 -->
    <el-dialog title="请输入交易密码" :visible.sync="dialogPassword" width="50%" :before-close="handleClose">
      <el-input v-model="tradePassword" type="password" size="mini"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkPass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/axios'
export default {
  name:'changeToken',
  data(){
    return {
      dialogPassword: false,
      tradePassword: '',
    }
  },
  methods: {
    // 验证交易密码
    checkPass() {
      axios.post("clientbind/checkTradePassword.do", this.qs.stringify({
        clientBindId: this.id,
        tradePassword: Base64.encode(this.tradePassword)
      })).then(result => {
        if(result.data.success) {
          window.sessionStorage.setItem("token", result.data.FORWARD_TRADE_TOKEN)
          this.dialogPassword = false
          this.tradePassword = ''
          this.$emit("retry")   //触发之前的操作
        }
      })
    },
    handleClose(){
      this.dialogPassword = false
      this.tradePassword = ''
    },
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      this.dialogPassword = newValue
    }
  },
  // props:['id','dialogVisible'],
  props: {
    id: Number,
    dialogVisible: Boolean,
  },
}
</script>

<style>

</style>
