<template>
  <div class="content">
    <div class="left">
      <span class="name">{{g.companyName}}</span>
      <i class="iconfont icon-zhankai1" :title="title" @click="unfold"></i>
    </div>
    <div :class="['hint',{'hide':Known}]" @click="hide"> 
      <i class="iconfont icon-zuojiantou"></i>
      <span title="点击隐藏该段文字">
        &nbsp;&nbsp;&nbsp;&nbsp;温馨提示：如果你的屏幕较小导致页面横向出现滚动条，在不需要导航栏的情况下可以点击左侧按钮将其隐藏掉
      </span>
    </div>
    <div class="right" @mouseenter="changeClass1" @mouseleave="changeClass2">
      <p>sdagsdgjbbbkbkbkjsda</p>
      <i :class="['iconfont','mt',{'icon-sanjiaodown':flag,'icon-shangjiantou':!flag}]"></i>

      <div class="inner show" ref="inner">
        <p @click="info">个人信息</p>
        <p @click="quit">退出</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: "top",
    data() {
      return {
        flag: true,
        time:'',
        title:'收起列表',
        show:true,
      }
    },
    created() {
      this.whetherHide()
    },
    methods: {
      unfold () {
        console.log(this.$store)
        this.flag = !this.flag
        this.$emit("show", this.flag)
        if(this.flag) {
          this.title = "收起列表"
        } else {
          this.title = "展开列表"
        }
      },

      changeClass1 () {
        this.flag = !this.flag
        let inner = this.$refs.inner
        inner.classList.remove('show')
        clearTimeout(this.time)
      },
      changeClass2 () {
        let inner = this.$refs.inner
        this.time = setTimeout(() => {
          this.flag = !this.flag
          inner.classList.add('show')
        },800)
      },
      info () {
        this.$router.push('/info')
      },
      quit () {
        console.log("退出")
        this.changeClass2()
        this.$router.push('/Login')
      },
      hide () {
        this.$store.dispatch("changeKnown", true)
        window.localStorage.setItem('known',true)
      },
      whetherHide() {
        let known = window.localStorage.getItem("known")
        if(known) {
          this.$store.dispatch("changeKnown", true)
        }
      }
    },
    computed: {
      ...mapState({companyName: 'companyName'}),
      ...mapGetters(['Known'])
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    height: 46px;
    background: #222;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    border:none;

    .hint {
      color:#ccc;
      font-size: 12px;
      line-height: 46px;
      float: left;
      cursor: pointer;
    }

    .hide {
      display: none;
    }

    .left {
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .name {
        padding: 0 20px;
        color: #fff;
      }

      .iconfont {
        padding: 4px 5px;
        color: #999;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 20%;
        cursor: pointer;
      }

      .iconfont:hover {
        color: #c71616;
        border: 1px solid #c71616;
      }
    }

    .right {
      padding: 0 15px;
      display: flex;
      color:#ccc;
      align-items: center;
      position: relative;
      cursor:pointer;

      .inner {
        position: absolute;
        top: 50px;
        left: 10px;
        width: 121px;
        background: #fff;
        z-index: 10;
        box-sizing:border-box;
        border-radius:5px;
        border: 1px solid #999;
        box-shadow: 1px 1px #999;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor:pointer;

        p {
          font-size: 16px;
          text-align: center;
          padding: 8px 0;
          color: #222;
        }

        p:hover {
          color:#f00;
        }
      }
      .show {
        display: none;
      }

      .mt {
        margin-top: 3px;
        margin-left: 5px;
      }

      p {
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size:14px;
      }
    }
  }

  .icon-zuojiantou {
    animation: BlendTrans 3s linear .5s infinite alternate;
  }

  @keyframes BlendTrans {
    0%{
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @-webkit-keyframes BlendTrans {
    0%{
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @-moz-keyframes BlendTrans {
    0%{
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @-o-keyframes BlendTrans {
    0%{
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>