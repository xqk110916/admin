<template>
  <div>
    <audio src="../public/111.mp3" ref="audio"> 您的浏览器不支持 audio 标签。  </audio>
    <div class="box">
        <div class="line"></div>
    </div>
    <el-button @click="play">开始/暂停</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      flag: false,  //代表播放和暂停,false代表目前是暂停状态
    }
  },
  created(){
    
  },
  methods: {
    play() {
      if(this.flag) {
        console.log(this.$refs)
      }
    },
  }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}
.box,.line {
    height: 10px;
}
.box {
    width: 200px;
    margin: 0 auto;
    border: 1px solid #000;
    margin-top: 100px;
}
.line {
    width: 0;
    background: #f00;
}
</style>
