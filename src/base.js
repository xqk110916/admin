import $ from 'jquery'
import axios from '@/axios.js'
const install = function (Vue, options) {
  //  获取非正态标准分部函数数值
  Vue.prototype.Normal = function (z) {
    let temp
    temp = Math.exp(-1 * z * z / 2) / Math.sqrt(2 * 3.141592653589793)
    return temp
  }
  //  获取非正态标准分部函数比例
  Vue.prototype.NormSDist = function (z) {
    if (z > 6) return 1
    if (z < -6) return 0
    let gamma = 0.2316419
    let a1 = 0.31938153
    let a2 = -0.356563782
    let a3 = 1.781477937
    let a4 = -1.821255978
    let a5 = 1.330274429
    let k = 1 / (1 + Math.abs(z) * gamma)
    let n = k * (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5))))
    n = 1 - this.Normal(z) * n
    if (z < 0) return 1 - n
    return n
  }
  Vue.prototype.CalcD1 = function (dprice, dsigma, dtargetprice, dTt) {
    let L01 = Math.log(dprice / dtargetprice)
    let L02 = Math.pow(dsigma, 2) / 2 * dTt
    let L03 = dsigma * Math.sqrt(dTt)
    let d1 = (L01 + L02) / L03
    return d1
  }
  Vue.prototype.CalcD2 = function (d1, dsigma, dTt) {
    let L03 = dsigma * Math.sqrt(dTt)
    let d2 = d1 - L03
    return d2
  }
  Vue.prototype.Nd = function (dvalue) {
    let dv = this.NormSDist(dvalue)
    return dv
  }
  Vue.prototype.CalcCall = function (dprice, dsigma, driskfreerate, dtargetprice, dTt) {
    let d1 = this.CalcD1(dprice, dsigma, dtargetprice, dTt)
    let d2 = this.CalcD2(d1, dsigma, dTt)
    let Nd1 = this.Nd(d1)
    let Nd2 = this.Nd(d2)
    let dResult = dprice * Math.exp(-1 * driskfreerate * dTt) * Nd1 - dtargetprice * Math.exp(-1 * driskfreerate * dTt) * Nd2
    return dResult
  }
  Vue.prototype.CalcCallDelta = function (dprice, dsigma, driskfreerate, dtargetprice, dTt) {
    var d1 = this.CalcD1(dprice, dsigma, dtargetprice, dTt)
    var Nd1 = this.Nd(d1)
    var Delta = Math.exp(-1 * driskfreerate * dTt) * Nd1
    return Delta
  }
  Vue.prototype.CalcPut = function (dprice, dsigma, driskfreerate, dtargetprice, dTt) {
    let d1 = this.CalcD1(dprice, dsigma, dtargetprice, dTt)
    let d2 = this.CalcD2(d1, dsigma, dTt)
    let Nd1 = this.Nd(-1 * d1)
    let Nd2 = this.Nd(-1 * d2)
    let dResult = dtargetprice * Math.exp(-1 * driskfreerate * dTt) * Nd2 - dprice * Math.exp(-1 * driskfreerate * dTt) * Nd1
    return dResult
  }
  Vue.prototype.CalcPutDalta = function (dprice, dsigma, driskfreerate, dtargetprice, dTt) {
    var d1 = this.CalcD1(dprice, dsigma, dtargetprice, dTt)
    var Nd1 = this.Nd(-1 * d1)
    var Delta = Math.exp(-1 * driskfreerate * dTt) * Nd1
    return Delta
  }
  /**
   * 认购期权理论价
   * param dprice-当前标的价格                S
   * param dsigma-年波动率  < 1.0            σ(sigma)
   * param driskfreerate-无风险利率          r
   * param dtargetprice-执行价（元）         X
   * param dT_t-到期时间(年)                T_t，比如剩余天数为1，则为 1/365
   * return double-认购期权理论价
   */
  // 调用例子：
  // window.CalcCall(dprice, dsigma, driskfreerate, dtargetprice, dT_t);
  /**
   * 认沽期权理论价
   * param dprice-当前标的价格                S
   * param dsigma-年波动率  < 1.0            σ(sigma)
   * param driskfreerate-无风险利率          r
   * param dtargetprice-执行价（元）       X
   * param dT_t-到期时间(年)                T_t，比如剩余天数为1，则为 1/365
   * return double-认沽期权理论价
   */
  // 调用例子：
  // window.CalcPut(dprice, dsigma, driskfreerate, dtargetprice, dT_t);
  /************************************************************************************************************************/
  //  计算扣减天数
  Vue.prototype.Deduction = function (nowday, thday, asd) {
    if(thday.getFullYear) {
      let time = thday
      let y = time.getFullYear().toString();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m.toString().padStart(2, "0")
      d = d.toString().padStart(2, "0")
      let sj = y + '' + m + '' + d;
      var newDate = sj
    } else {
      var newDate = thday
    }
    var bidDeduction = 0
    var askDeduction = 0
    if (asd.length !== 0) {
      for (var i = 0; i < asd.length; i++) {
        if (nowday < asd[i].festival_date) {
          break
        }
      }
      for (var j = 0; j < asd.length; j++) {
        if (newDate < asd[j].festival_date) {
          break
        }
      }
      for (var k = 0; k < asd.length; k++) {
        if (k > i - 1 && k < j) {
          bidDeduction = bidDeduction + asd[k].bid_deduction
        }
      }
      for (var q = 0; q < asd.length; q++) {
        if (q > i - 1 && q < j) {
          askDeduction = askDeduction + asd[q].ask_deduction
        }
      }
    } else {
      bidDeduction = 0
      askDeduction = 0
    }
    // bidDeduction = bidDeduction - buyComp
    // askDeduction = askDeduction - sellComp
    return [bidDeduction, askDeduction]
  }
  /**
   * 计算扣减天数
   * param nowday-当前日期 -> 20181123
   * param thday-到期日期 -> 20181226
   * buyComp  买补偿天数  
   * sellComp  卖补偿天数
   * param asd-扣减天数集合 ->[]
   * return [bidDeduction, askDeduction] -> [买方扣减,卖方扣减]
   */
  Vue.prototype.DateDiff = function (sDate1, sDate2, buyComp, sellComp) { 
    let oDate1
    let oDate2
    let iDays
    oDate1 = new Date(sDate1.substring(0, 4) + '-' + sDate1.substring(4, 6) + '-' + sDate1.substring(6, 8))
    oDate2 = new Date(sDate2.substring(0, 4) + '-' + sDate2.substring(4, 6) + '-' + sDate2.substring(6, 8))
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
    let buy = iDays + buyComp
    let sell = iDays + sellComp
    return [buy, sell]
  }
  //  获取标的中文名称
  Vue.prototype.zifuchan = function (d) {
    let arr = d.split('')
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].charCodeAt() < 255) {
        var ind = i
        break
      }
    }
    var ne = d.substring(0, ind)
    return ne
  }
  /**
   * 获取标的中文名称
   * param d-标的信息 -> 镍ni1905
   * return ne -> 返回中文名称 镍
   */
  //  返回交易所信息集合
  Vue.prototype.marketCodeArr = function (marketinfo) {
    let arr = []
    let MarketArr = []
    let MarketInformation = ['SHFE', 'DCE', 'CZCE', 'INE', 'SSE', 'SZSE', 'CFFEX', 'SGE']
    for (let j = 0; j < MarketInformation.length; j++) {
      let obj = []
      for (let i = 0; i < marketinfo.length; i++) {
        if (marketinfo[i].market === MarketInformation[j]) {
          obj.push(marketinfo[i].code)
        }
      }
      if (obj.length > 0) {
        MarketArr.push(MarketInformation[j])
        arr.push(obj)
      }
    }
    return [MarketArr, arr]
  }
  //  日期格式转化
  Vue.prototype.changeDate = function (e) {
    if(!e.getFullYear) {
      return e
    }
    var currentdate = ''
    if (e instanceof Date === false) {
      currentdate = ''
    } else {
      var seperator1 = ''
      var year = e.getFullYear()
      var month = e.getMonth() + 1
      var strDate = e.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      currentdate = year + seperator1 + month + seperator1 + strDate
    }
    return currentdate
  }
  Vue.prototype.dateStringChange = function (e) {
    let oDate = e.substring(0, 4) + '-' + e.substring(4, 6) + '-' + e.substring(6, 8)
    return oDate
  }
  // Vue.prototype.make_parcel = function (msg_type, body) {
  //   let p = new Parcel(msg_type, body);
  //   return p
  // }
  Vue.prototype.generateRid = function () {
    var buffer = new ArrayBuffer(16)
    var intView = new Uint32Array(buffer)
    intView[0] = Math.random() * 1000000000000000
    intView[1] = Math.random() * 1000000000000000
    intView[2] = Math.random() * 1000000000000000
    intView[3] = Math.random() * 1000000000000000
    var binStr = String.fromCharCode.apply(null, new Uint8Array(buffer))
    var base64 = btoa(binStr)
    return base64
  }
  Vue.prototype.testpercent = function (item) {
    var cent = (item * 100).toFixed(2) + '%'
    return cent
  }
  //  解决js浮点数运算bug
  Vue.prototype.padding0 = function (p) {
    var z = ''
    while (p--) {
      z += '0'
    }
    return z
  }
  Vue.prototype.fixedFloat = function (a, b, sign) {
    function handle (x) {
      var y = String(x)
      var p = y.lastIndexOf('.')
      if (p === -1) {
        return [y, 0]
      } else {
        return [y.replace('.', ''), y.length - p - 1]
      }
    }
    function operate (v, w, s, t) {
      switch (s) {
        case '+': return (v + w) / t
        case '-': return (v - w) / t
        case '*': return (v * w) / (t * t)
        case '/': return (v / w)
      }
    }
    var c = handle(a)
    var d = handle(b)
    var k = 0
    if (c[1] === 0 && d[1] === 0) {
      return operate(+c[0], +d[0], sign, 1)
    } else {
      k = Math.pow(10, Math.max(c[1], d[1]))
      if (c[1] !== d[1]) {
        if (c[1] > d[1]) {
          d[0] += this.padding0(c[1] - d[1])
        } else {
          c[0] += this.padding0(d[1] - c[1])
        }
      }
      return operate(+c[0], +d[0], sign, k)
    }
  }
  //  加
  Vue.prototype.add = function (a, b) {
    return this.fixedFloat(a, b, '+')
  }
  //  减
  Vue.prototype.minus = function (a, b) {
    return this.fixedFloat(a, b, '-')
  }
  //  乘
  Vue.prototype.mul = function (a, b) {
    return this.fixedFloat(a, b, '*')
  }
  //  除
  Vue.prototype.division = function (a, b) {
    return this.fixedFloat(a, b, '/')
  }
  //减法
  Vue.prototype.sub = function (a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    } 
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
}
  //  获取一个月后非周末非节假日后的第一个日期(后续优化)
  /**
   * 获取一个月后非周末非节假日后的第一个日期
   * param rd-节假日信息集合 -> []
   * param minDay-最小报价天数 -> 30
   * return [OneMonthDayCom, OneMonthDay, NowDayCom, NowDay1] -> [20181226,2018-12-26,20181126,2018-11-26]
   */
  Vue.prototype.ThirdDate = function (rd, minDay) {
    var myDate = new Date()
    var date1 = new Date(myDate)
    var date2 = new Date(myDate)
    var date3 = new Date(myDate)
    var NowMon
    var NowDay
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
    let NowDayCom = (date1.getFullYear() + '' + NowMon + '' + NowDay)
    let NowDay1 = (date1.getFullYear() + '-' + NowMon + '-' + NowDay)
    let OneMonth = minDay
    let OneMonthCh
    date2.setDate(myDate.getDate() + minDay)
    if (date2.getDay() === 6) {
      OneMonthCh = OneMonth + 2
    } else if (date2.getDay() === 0) {
      OneMonthCh = OneMonth + 1
    } else {
      OneMonthCh = OneMonth
    }
    date3.setDate(myDate.getDate() + OneMonthCh)
    let mon
    let day
    if ((date3.getMonth() + 1) < 10) {
      mon = '0' + (date3.getMonth() + 1)
    } else {
      mon = date3.getMonth() + 1
    }
    if (date3.getDate() < 10) {
      day = '0' + (date3.getDate())
    } else {
      day = date3.getDate()
    }
    let OneMonthDayCom = (date3.getFullYear() + '' + mon + '' + day)
    let OneMonthDay = (date3.getFullYear() + '-' + mon + '-' + day)
    if (rd.length !== 0) {
      for (let i = 0; i < rd.length; i++) {
        let fullyear = Number(OneMonthDayCom.toString().substring(0, 4))
        let month = Number(OneMonthDayCom.toString().substring(4, 6)) - 1
        let oday = Number(OneMonthDayCom.toString().substring(6, 8))
        OneMonthDayCom = Number(OneMonthDayCom)
        if (rd[i] === OneMonthDayCom) {
          let da = new Date(fullyear, month, oday)
          let oneday = 1
          let oneday1
          da.setDate(da.getDate() + oneday)
          if (da.getDay() === 6) {
            oneday1 = oneday + 2
          } else if (da.getDay() === 0) {
            oneday1 = oneday + 1
          } else {
            oneday1 = oneday
          }
          da.setDate(da.getDate() + oneday1 - 1)
          let mon1
          let day1
          if ((da.getMonth() + 1) < 10) {
            mon1 = '0' + (da.getMonth() + 1)
          } else {
            mon1 = da.getMonth() + 1
          }
          if (da.getDate() < 10) {
            day1 = '0' + (da.getDate())
          } else {
            day1 = da.getDate()
          }
          OneMonthDayCom = (da.getFullYear() + '' + mon1 + '' + day1)
          OneMonthDayCom = Number(OneMonthDayCom)
          OneMonthDay = (da.getFullYear() + '-' + mon1 + '-' + day1)
        } else {}
      }
      OneMonthDayCom = OneMonthDayCom.toString()
    }
    return [OneMonthDayCom, OneMonthDay, NowDayCom, NowDay1]
  }
  // 将格林威治时间格式转化为20190307格式的字符串
  Vue.prototype.timeFormat = function(time = new Date, format = '') {
    let y = time.getFullYear().toString();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    m = m.toString().padStart(2, "0")
    d = d.toString().padStart(2, "0")
    return y + format + m + format + d; //返回格式  "20191027" 字符串
  }
  // 将yyyyMMdd格式的时间转换成格林威治格式的时间
  Vue.prototype.timeyy = function(res) {
    var r = res.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
    return new Date(r)
  }
  //将时间戳转化为 时间格式(带时分秒)
  Vue.prototype.timestampToTime = function(timestamp) {  
    var date = new Date(Number(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
  }
  // 检查是否为星期天
  Vue.prototype.getMyDay = function(date) { //参数为yyyyMMdd格式
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
  }
  Vue.prototype.comweek = function(newValue) {
    let week = this.timeyy(newValue)
    if (week == "周六" || week == "周日") {
      vm.$message({
        message: "休息日无法交易，请重新选择",
        type: "warning",
        showClose: true,
      })
    }
  }
  // post下载
  Vue.prototype.postDown = function(url, data) {
    let form = $("<form>"); //创建form标签
    form.attr("style", "display:none");
    form.attr("method", "post"); //设置请求方式
    form.attr("target", "_blank")

    form.attr("action", url); //action属性设置请求路径
    $("body").append(form); //页面添加form标签

    for(let item in data) {
      let input1 = $("<input>") //创建input标签
      input1.attr("type", "hidden") //设置隐藏域
      input1.attr("name", item) //设置发送后台数据的参数名
      input1.attr("value", data[item]);
      form.append(input1);
    }

    form.submit(); //表单提交即可下载
  }
  // 获取子账
  Vue.prototype.getSubNos = function (){
    return new Promise(((reslove,reject) => {
      axios.post('client/inner/subaccount/queryAll.do').then(result => {
        if(result.data.success) {
          let subNos = result.data.subAccountInfos
          reslove(subNos)
        }
      })
    }))
  }
  // 获取最近的交易日
  Vue.prototype.getPresent = function () {     //获取最近交易日
    return new Promise((reslove, reject) => {
      axios.post('client/inner/businessinfo/query.do').then(result => {
        if(result.data.success) {
          let info = result.data.businessInfo
          let tradingDay = info.tradingDay  
          reslove(tradingDay)
        }
      })
    })
  }
}

export default install