<template>
  <div>
    <HeadBack title="反馈建议"></HeadBack>
    <div class="content">
      <h3 class="text">问题类型：</h3>
      <el-select v-model="opt" placeholder="请选择问题分类" style="margin-bottom:10px;" size="small">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <h3 class="text">问题描述：</h3>
      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" @keyup.native="changeValue"
        placeholder="您感觉我们有那点做的不好的，或者有什么好的意见或者建议都可以提给我们，我们将会珍视您的每一条反馈。每条建议最多输入255个字。" v-model="val" maxlength="255">
      </el-input>
      <span class="hint">{{hint}}/255</span>
      <el-button type="primary" @click="submit" style="width:100%;margin-top:10px;">提交</el-button>
    </div>
  </div>
</template>

<script>
  import HeadBack from '../components/HeadBack.vue'
  import axios from '../axios'
  export default {
    name: "lianxi",
    data() {
      return {
        val: '',
        opt: '',
        options: [{
          label: '业务问题',
          value: 1
        }, {
          label: '界面问题',
          value: 2
        }, {
          label: '优化建议',
          value: 3
        }, {
          label: '其他',
          value: 4
        }, ],
        hint: '0',
      }
    },
    methods: {
      submit() {
        // 提交时携带用户名和联系方式与时间
        if (!this.opt) {
          this.$Message.warning("请选择问题类型")
          return
        }
        if (!this.val) {
          this.$Message.warning("请输入问题描述")
          return
        }
        axios.post('/client/product/clientfeedbackinfo/addClientFeedbackInfo.do', this.qs.stringify({
          clientId: this.bdObj.id,
          username: this.username,
          questionType: this.opt,
          questionDescription: this.val
        })).then(res => {
          if (res) {
            this.val = ''
            this.$Message.success("提交成功，感谢您的建议")
            this.$router.replace('/deal')
          }
        })
      },
      timeyyM(str) {
        let time = new Date(str);
        let y = time.getFullYear().toString();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        m = m.toString().padStart(2, "0")
        d = d.toString().padStart(2, "0")
        let sj = y + '' + m + '' + d;
        return sj
      },
      changeValue(val) {
        console.log(val)
        this.hint = this.val.length
      },
    },
    components: {
      HeadBack
    },
    watch: {
      $route(newValue, oldValue) {
        if(newValue.name == "lianxi") {
          this.val = ''
          this.hint = '0'
        }
      }
    },
    computed: {
      username() {
        return this.$store.state.username
      },
      bdObj() {
        return this.$store.state.bdobj
      }
    }
  }

</script>

<style>
  .content {
    margin-top: 40px;
    padding: 10px 20px;
  }

  .text {
    padding: 5px;
  }

  .hint {
    color: #999;
    float: right;
    margin-top: 5px;
  }

</style>
