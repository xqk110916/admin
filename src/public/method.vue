<script>
  import Vue from 'vue'
  const vm = new Vue()
  export default {
    // 将格林威治时间格式转化为20190307格式的字符串
    timeFormat(time, format = '') {
      let y = time.getFullYear().toString();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m.toString().padStart(2, "0")
      d = d.toString().padStart(2, "0")
      return y + format + m + format + d; //返回格式  "20191027" 字符串
    },
    // 将yyyyMMdd格式的时间转换成格林威治格式的时间
    timeyy(res) {
      var r = res.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
      return new Date(r)
    },
    getNow(format){
      let now = new Date(Date.now()) 
      return this.timeFormat(now, format)
    },
    // 获取当月第一天
    getFirstDay () {
      let date = new Date()
      date.setDate(1)
      return this.timeFormat(date)
    },
    // 获取上月第一天
    getBeforeFirstDay () {
      let first = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      return this.timeFormat(first)
    },
    // 获取上月最后一天
    getBeforeLastDay () {
      var date = new Date();
      var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
      var endDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, day);
      return this.timeFormat(endDate)
    },
    // 检查是否为星期天
    getMyDay(date) { //参数为yyyyMMdd格式
      let time =  this.timeyy(date)
      var week;
      if (time.getDay() == 0) week = "周日"
      if (time.getDay() == 1) week = "周一"
      if (time.getDay() == 2) week = "周二"
      if (time.getDay() == 3) week = "周三"
      if (time.getDay() == 4) week = "周四"
      if (time.getDay() == 5) week = "周五"
      if (time.getDay() == 6) week = "周六"
      return week
    },
    comweek(newValue) {
      let week = this.timeyy(newValue)
      if (week == "周六" || week == "周日") {
        vm.$message({
          message: "休息日无法交易，请重新选择",
          type: "warning",
          showClose: true,
        })
      }
    },
    // 计算时间间隔是否超过30天
    comsj(startDate, endDate) {
      if (startDate || endDate) {
        let start = new Date(startDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")).getTime()
        let end = new Date(endDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")).getTime()
        let diff = (end - start) / 1000 / 60 / 60 / 24
        if (diff >= 30) {
          vm.$message({
            message: "时间间隔超过30天，请重新选择",
            type: "warning",
            showClose: true,
          })
          return
        }
      }
    },    
    // 获取当前最近的收盘日
    startC() {
      this.axios.post('manage/inner/businessinfo/query.do').then(result => {
        if(result.data.success) {
          let time = new Date(result.businessInfo.closeDate);
          let sj = this.timeFormat(time)
          return sj
        }
      })
    },
    promise(url, params = {}) {
      return new Promise((reslove, reject) => {
        this.axios.post(url, this.qs.stringify(params)).then(result => {
          if(result) {
            reslove(result)
          } else {
            reject(result)
          }
        })
      })
    }
  }
</script>