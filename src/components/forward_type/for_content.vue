<template>
  <div class="for_content">
    <el-table :data="datas" border :height="300" style="width: 100%;" highlight-current-row @row-click="rowClick" @row-dblclick="xiadan" @row-contextmenu="zixuan" v-loading="loading">
      <el-table-column prop="market" label="交易所"> </el-table-column>
      <el-table-column prop="name" label="品种" :formatter="changeVarietyName"> </el-table-column>
      <el-table-column prop="code" label="标的代码"> </el-table-column>
      <el-table-column prop="subAccountNo" label="子账业务" :formatter="changeSubNo"> </el-table-column>
      <el-table-column prop="price" label="远期价格"> 
        <template slot-scope="scope">
          <span :class="{ red: scope.row.call , green: scope.row.put }"> {{scope.row.price}} </span>
        </template>
      </el-table-column>
      <el-table-column prop="expiringDate" label="最远到期日" width="150"> 
        <template slot-scope="scope">
          <span> {{ changeTime(scope.row.expiringDate) }} </span>
        </template>
      </el-table-column>
      <el-table-column label="下单" v-if="!dis" class="hand"> 
        <template slot-scope="scope">
          <span style="color:red;" @click="xiadan(scope.row)"> 下单 </span>
        </template>
      </el-table-column>
      <el-table-column :label="filterVal == 'zixuan'?'删除自选':'加入自选'" class="hand" width="120"> 
        <template slot-scope="scope">
          <!-- <span :class="[ detection(scope.row)?'green':'red' ]"  @click="zixuan(scope.row)" v-show="!(filterVal == 'zixuan')"> {{ detection(scope.row)?'已加入':'加入自选' }} </span> -->
          <span :class="[ scope.row.isCollect?'green':'red' ]"  @click="zixuan(scope.row)" v-show="!(filterVal == 'zixuan')"> {{ scope.row.isCollect?'已加入':'加入自选' }} </span>
          <span style="color:red;"  @click="del(scope.row)" v-show="filterVal == 'zixuan'"> 删除自选 </span>
          <!-- <span style="color:green;" v-show="detection(scope.row)"> 已加入 </span> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- webSocket数据来源 -->
    <div class="socket">
      <socket></socket>
    </div>
    <xiadan></xiadan>
  </div>
</template>

<script>
// import socket from '@/views/more/offers.vue'
import socket from '@/components/socket'
import xiadan from './xiadan'
import bus from '@/assets/eventBus'
import axios from '@/axios'
import $ from 'jquery'
export default {
  name:'for_content',
  data(){
    return {
      all: [],    //用来接收webSocket传回来的数组
      datas:[],   //用来显示在界面上用的数组
      configs: [],    //用来存放远期配置数组
      zixuanArr: [],   //用来存放自选的数组
      sub: '',
      id: '',
      user: '',
      filterVal: 'all',
      loading: true,
      dis: null,    //用于控制不需要交易的情况下进来不显示下单和自选列表
      flag: true,
      nameOptions: [],    //用于显示品种名
    }
  },
  created(){
    bus.$on("sockets", this.socket)
    // bus.$on("socket", this.socket)
    bus.$on("filters", this.filters)
    bus.$on("searchDetails", this.search)
    bus.$on("pusher", this.pusher)
  },
  methods: {
    // 获取品种名
    getVarietyName(){
      axios.post("client/inner/exchangeproductconfig/queryAll.do").then(result => {
        if(result.data.success) {
          this.nameOptions = result.data.exchangeProductConfig
        }
      })
    },
    getforwardConfig(){
      return new Promise((reslove, reject) => {
        axios.post('client/inner/forwardconfig/queryAll.do').then(result => {
          if(result.data.success) {
            let arr = result.data.ForwardConfigs
            let configs = []
            if(!this.dis && this.sub) {
              arr.forEach(item => {
                if(item.subAccountNo == this.sub) {
                  configs.push(item)
                }
              })
            } else {
              configs = arr
            } 
            this.configs = configs
            this.$emit("get:forwardconfig", configs)
            reslove(configs)
          }
        })
      })
    },
    getSubNos(){
      axios.post('client/inner/subaccount/queryAll.do').then(result => {
        if(result.data.success) {
          this.subNos = result.data.subAccountInfos
        }
      })
    },
    getZixuan(){
      return new Promise((reslove, reject) => {
        axios.post('client/forward/forwardselfselection/querySelfSelectionList.do', this.qs.stringify({
          // clientBindId: this.id,
          subAccountNo: this.sub
        })).then(result => {
          if(result.data.success) {
            let arr = result.data.fcs
            let copy = []
            if(!arr) {
              reslove([])
              return
            }
            arr.forEach(item => {
              this.all.forEach(list => {
                if(list.market == item.exchange && list.code == item.underlying) {
                  list['isCollect'] = 1
                  copy.push(list)
                }
              })
            })
            this.zixuanArr = copy
            reslove(copy)
          }
        })
      })
    },
    xiadan(obj){
      if(this.dis) {
        this.$message({
          type:"error",
          message:"你现在处于非交易模式，不能进行下单操作。",
          shwoClose: true,
        })
        return
      }
      bus.$emit('xiadan', obj)
    },
    zixuan(obj){
      if(obj.isCollect) {
        this.$message({
          type:"error",
          message:"该标的已在自选中，请不要重复添加",
          shwoClose: true
        })
        return
      }
      let config = {}
      this.configs.forEach(item => {
        if(item.exchange == obj.market && item.underlying == obj.code) {
          config = item
        }
      })
      if(!config.underlying) {
        this.$message({
          type:"error",
          message:"该标的没有远期配置或你没有该子账的权限",
          shwoClose: true,
        })
        return
      }
      // config['clientBindId'] = this.id
      config['expiringDate'] = new Date(Number(config['expiringDate'])).toString()
      // let data = {
      //   clientBindId: this.id,
      //   exchange: config.exchange,
      //   underlying: config.underlying,
      //   subAccountNo: config.subAccountNo,
      //   id: config.id,
      // }
      axios.get('client/forward/forwardselfselection/addSelfSelection.do', {
        params: config
      } ).then(result => {
        if(result.data.success) {
          this.$message({
            type:"success",
            message:config.exchange + config.underlying + '成功加入自选',
            shwoClose: true
          })
          obj['isCollect'] = 1
          this.getZixuan()
        }
      })

    },
    del(obj){
      this.loading = true
      axios.post('client/forward/forwardselfselection/deleteSelfSelection.do',this.qs.stringify({
        // clientBindId: this.id,
        exchange: obj.market,
        underlying: obj.code,
        subAccountNo: this.sub
      })).then(result => {
        this.loading = false
        if(result.data.success) {
          this.$message({
            type:"success",
            message:'成功删除自选',
            shwoClose: true
          })
          delete obj.isCollect
          this.getZixuan().then((arr) => {
            this.datas = arr
          })
        }
      })
    },
    detection(row){
      let flag = true
      this.zixuanArr.forEach(item => {
        if(item.market == row.market && item.code == row.code) {
          flag = false
        }
      })
      if(this.filterVal != 'zixuan' && !flag) {
        return true
      } else {
        return false
      }
    },

    // 组件传参处理函数
    socket(arr) {
      this.loading = false
      if(this.filterVal == 'all' && this.flag) {
        this.datas = arr
      }

      if(this.flag && arr) {
        this.flag = false
        this.group(arr).then(() => {
          if(!this.dis) {
            this.getZixuan()
          }
        })
      }
    },
    // 推送行情
    pusher(obj){
      this.datas.forEach(item => {
        if(item.market == obj.market && item.code == obj.code) {
          item.price = obj.price
        }
      })
      this.$emit('newPrice',this.datas)
      bus.$emit("socketArray", this.datas)   //用于移动版远期界面计算
    },
    group(arr){
      return new Promise((reslove, reject) => {
        let all = []
        let n = 0
        // this.getforwardConfig().then(config => {
        arr.forEach(item => {
          this.configs.forEach(list => {
            if(this.sub) {   //如果需要交易只显示配置好远期配置的且拥有子账权限的
              if(list.exchange == item.market && list.underlying == item.code && list.subAccountNo == this.sub) {
                for(let i=0;i<all.length;i++) {
                  if(all[i].code == item.code && all[i].market == item.market && all[i].subAccountNo == list.subAccountNo) {
                    return
                  }
                }
                item['expiringDate'] = list.expiringDate
                item['subAccountNo'] = list.subAccountNo
                item['yearTradeDays'] = list.yearTradeDays
                all.push(item)
              }
            } else if(this.dis && !this.sub) {    //如果不需要交易显示所有配置远期配置的
              if(list.exchange == item.market && list.underlying == item.code) {
                for(let i=0;i<all.length;i++) {
                  if(all[i].code == item.code && all[i].market == item.market && all[i].subAccountNo == list.subAccountNo) {
                    return
                  }
                }
                item['expiringDate'] = list.expiringDate
                item['subAccountNo'] = list.subAccountNo
                item['yearTradeDays'] = list.yearTradeDays
                n+=1
                all.push(item)
              }
            }
          })
        })
        for(let i=0;i<all.length;i++) {
          for(let j=1;j<i;j++) {
            if(all[i].market == all[j].market && all[i].code == all[j].code && all[i].subAccountNo == all[j].subAccountNo && i != j) {
              all.splice(j,1)
              j--
            }
          }
        }
        this.$emit('newPrice', all)
        bus.$emit("socketArray", all)   //用于移动版远期界面计算
        this.all = all
        this.datas = all
        reslove()
        
      })
    },
    rowClick(row) {
      bus.$emit("lookDeatails", row)
    },
    filters(val){
      this.filterVal = val
      if(val == 'all') {
        this.datas = this.all
        return
      }
      if(val == 'zixuan') {
        this.getZixuan().then(arr => {
   
          this.datas = arr
        })
        return
      }
      let arr = []
      this.all.forEach(item => {
        if(item.market == val) {
          arr.push(item)
        }
      })
      this.datas = arr
    },
    search(val){
      if(val) {
        this.filterVal = val
        let arr = []
        this.all.forEach(item => {
          if(item.code == val) {
            arr.push(item)
          }
        })
        this.datas = arr
      } else {
        // this.filterVal = "all"
        this.filters('all')
      }
    },
    changeSubNo(obj) {
      let arr = this.subNos.filter((item) => {
        return item.subAccountNo == obj.subAccountNo
      })
      return arr[0].subAccountBusinessName
    },
    changeTime(val) {
      return this.timeFormat(new Date(val))
    },
    changeVarietyName(obj) {
      let str = ''
      this.nameOptions.forEach(item => {
        if(item.product.toLowerCase() == obj.name.toLowerCase() && item.exchange.toLowerCase() == obj.market.toLowerCase()) {
          str = item.instrumentName
        }
      })
      if(str) {
        return str
      } else {
        return '--'
      }
    }
  },
  components: {
    socket,
    xiadan
  },
  watch: {
    $route:{
      handler(to, from) {
        let id = to.query.id
        let sub = to.query.sub
        // if (to.path == '/forwardType' && user && id && sub) {
        if(to.path == "/forwardType" || to.path == "/forwardTypes") {
          this.sub = to.query.sub
          this.id = to.query.id
          this.user = to.query.user
          this.dis = to.query.dis
          this.getforwardConfig()
          this.getSubNos()
          this.getVarietyName()
          this.flag = true
          
          this.filterVal == 'all'
        }
      },
      immediate: true
    },
    // filterVal(newValue, oldValue) {
    //   if(!newValue) {
    //     this.filterVal = 'all'
    //     this.filters("all")
    //   }
    // }
  },
}
</script>

<style scoped>
.socket {
  display: none;
}

.red {
  color: #e75563;
}

.green {
  color: #16d397;
}


</style>
