<template>
  <div class="consu-container">
    <p class="top">自选 <span class="edit" @click="editFun" v-show="$store.state.optionalCode.length !== 0"> {{ editLabel }} </span></p>
    <Row class="market">
      <span>交易所</span>
      <span>代码</span>
      <span>进场价</span>
      <span>到期日</span>
    </Row>
    <p class="no-info" v-if="$store.state.optionalCode.length === 0">暂无自选信息</p>
    <Row class="claecla" v-else>
      <Row class="code" v-for="item in $store.state.optionalCode" v-bind:key="item.opInfo">
        <span @click="goTpage(item.opMarket, item.opCode, item.opExpiryDate)"> <Icon type="ios-close-circle" class="close" v-show="delShow" @click.stop="delOpFun(item)"/> {{ item.opMarket }} </span>
        <span @click="goTpage(item.opMarket, item.opCode, item.opExpiryDate)"> {{ item.opCode }} </span>
        <span @click="goTpage(item.opMarket, item.opCode, item.opExpiryDate)"> {{ item.opThePrice }}</span>
        <span @click="goTpage(item.opMarket, item.opCode, item.opExpiryDate)"> {{ item.opExpiryDate }}</span>
      </Row>
    </Row>
    <!-- <div style="padding: 10px;background: #fff">
      <Card title="灵台飞雪" icon="ios-options" :padding="0" shadow style="width: 100%;">
        <CellGroup>
          <Cell title="总资产" label="4596323" />
          <Cell title="可用余额" extra="365576" />
          <Cell title="Link" extra="details" to="/components/button" />
          <Cell title="查看持仓" to="/components/button" target="_blank" />
          <hr style="margin:5px" />
          <Cell title="查看当日成交" to="/components/button" target="_blank" />
          <Cell title="查看历史成交" to="/components/button" target="_blank" />
          <Cell title="Disabled" disabled />
          <Cell title="Selected" />
          <Cell title="With Badge" to="/components/badge">
            <Badge :count="10" slot="extra" />
          </Cell>
          <Cell title="With Switch">
            <Switch v-model="switchValue" slot="extra" />
          </Cell>
        </CellGroup>
      </Card>
    </div> -->
    <BottonTab></BottonTab>
  </div>
</template>

<script>
import BottonTab from '@/components/BottonTab'
import axios from '@/axios'
export default {
  name: 'optionalHome',
  components: {BottonTab},
  data () {
    return {
      switchValue: true,
      Loop: 0,
      editLabel: '编辑',
      delShow: false,
      nowDate: ''
    }
  },
  mounted: function () {
    let myDate = new Date()
    let date1 = new Date(myDate)
    let NowMon
    let NowDay
    if ((date1.getMonth() + 1) < 10) {
      NowMon = '0' + (date1.getMonth() + 1)
    } else {
      NowMon = date1.getMonth() + 1
    }
    if (date1.getDate() < 10) {
      NowDay = '0' + (date1.getDate())
    } else {
      NowDay = date1.getDate()
    }
    this.nowDate = (date1.getFullYear() + '' + NowMon + '' + NowDay)
  },
  methods: {
    testVues: function () {
      console.log(this.$store.state.optionalCode)
      this.optionalCode = this.$store.state.optionalCode
    },
    editFun: function () {
      if (this.editLabel === '编辑') {
        this.delShow = true
        this.editLabel = '完成'
      } else {
        this.delShow = false
        this.editLabel = '编辑'
      }
    },
    // 本地删除自选
    delOpFun: function (e) {
      let that = this
      that.$Modal.confirm({
        title: '是否删除' + e.opInfo,
        onOk: () => {
          let ind = that.$store.state.optionalCode.indexOf(e)
          that.$store.state.optionalCode.splice(ind, 1)
          localStorage.setItem('optionalCode', JSON.stringify(that.$store.state.optionalCode))
          that.$store.dispatch('changeOptional', that.$store.state.optionalCode)
          that.$Message.info('删除成功')
        },
        onCancel: () => {
          //  that.$Message.info('已取消删除')
        }
      })
    },
    // 后端删除自选
    delStart(){
      axios.post('client/deleteSelfSelection.do',this.qs.string({

      })).then(res => {
        console.log(res)
      })
    },
    goTpage: function (m, c, e) {
      this.$router.push({
        path: '/TPage',
        name: 'TPageHome',
        params: {
          market: m,
          code: c,
          expiryDate: new Date(this.dateStringChange(e)),
          nowDate: this.nowDate
        }
      })
    }
    // showDeleteButton (e) {
    //   let that = this
    //   clearTimeout(that.Loop)
    //   that.Loop = setTimeout(function () {
    //     that.$Modal.confirm({
    //       title: '是否删除' + e.opInfo,
    //       onOk: () => {
    //         let ind = that.$store.state.optionalCode.indexOf(e)
    //         that.$store.state.optionalCode.splice(ind, 1)
    //         localStorage.setItem('optionalCode', JSON.stringify(that.$store.state.optionalCode))
    //         that.$store.dispatch('changeOptional', that.$store.state.optionalCode)
    //         that.$Message.info('删除成功')
    //       },
    //       onCancel: () => {
    //         //  that.$Message.info('已取消删除')
    //       }
    //     })
    //   }, 1000)
    // },
    // clearLoop (e) {
    //   clearTimeout(this.Loop)
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.consu-container{
  position: relative;
  width: 100%;
  max-width: 750px;
  min-width: 320px;
  margin: 0 auto;
}
.top{
  position: relative;
  z-index: 2;
  height: 2rem;
  width: 100%;
  max-width: 750px;
  line-height: 2rem;
  text-align: center;
  border-bottom: 1px solid #ccc;
  box-shadow:1px 1px 1px #ddd;
}
.top .edit{
  position: absolute;
  right: 15px;
}
.market{
  position: relative;
  z-index: 1;
  height: 2.25rem;
  line-height: 2.25rem;
  background-color: white;
  width: 100%;
  max-width: 750px;
}
.market span{
  display: block;
  float: left;
  width: 25%;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
.no-info{
  height: 2rem;
  width: 100%;
  max-width: 750px;
  line-height: 2rem;
  text-align: center;
}
.claecla{
 height: 100%
}
.code{
  height: 2rem;
  max-height: 2rem;
  overflow: hidden;
  line-height: 2rem;
  width: 100%;
  border-bottom: 1px solid #eee;
}
.code span{
  position: relative;
  color: #515a6e;
  display: block;
  float: left;
  width: 25%;
  text-align: center;
  border-bottom: 1px solid #eee;
}
.code .close{
  position: absolute;
  left: 8px;
  top: 10px;
  font-size: 18px;
}
</style>
