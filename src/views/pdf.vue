<template>
  <div class="pdf" style="width: 1000px;margin: auto;">
    <el-row id="dpdf">
      <el-select v-model="value" placeholder="请选择" @change="changePlate" size="mini">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-date-picker size="mini" v-model="data11" type="date" value-format="yyyyMMdd" placeholder="选择日期">
      </el-date-picker>
      <el-button @click="look" size="mini" :disabled="!data11">查看报价</el-button>
      <el-button size="small">
        <span @click="$router.push('/')">返回商品交易界面</span>
      </el-button>
      <el-button @click="downPdf" style="float: right;" size="mini">导出</el-button>
      <el-button type="danger" style="float: right;margin-right: 5px" @click="dialogVisible = true" size="mini"> 导出说明
      </el-button>
    </el-row>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <h3 style="color: #e96900">请使用最新版的谷歌(chrome)或者qq,360浏览器</h3>
      <p>点击导出,打开更多设置,修改左侧参数,如下图所示</p>
      <div>
        <img src="../public/geshi.png" width="100%">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-row id="ol_article_content">
      <el-col :span="24" style="position: relative;background-color: white;">
        <div class="" style="float: left;height: 60px;">
          <img src="../public//logo.png" width="50%" />
        </div>
        <p style="float: left;height: 45px;padding: 0;margin: 0;color: rgb(9,88,167);font-size: 22px;">一个月平值期权场外报价表</p>
        <span style="position: absolute;right: 600px;bottom: 0;"> {{ "报价日期:"+NowDay }} </span>
        <span style="position: absolute;right: 250px;bottom: 0;"> {{ "到期日期:"+ThisTime+"("+NumDay+"天)" }} </span>
      </el-col>

      <el-table :data="NewData" size="small" :row-class-name="getRowClass" v-loading="loading"
        element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.5)">
        <el-table-column label="报价品种">
          <el-table-column prop="CN_name" label="板块" width="180" :filters=market :filter-method="filterTag">
          </el-table-column>
          <el-table-column prop="name" label="品种" :filters=code :filter-method="filterHandler"> </el-table-column>
        </el-table-column>

        <el-table-column label="标的信息">
          <el-table-column prop="code" label="代码"> </el-table-column>
          <el-table-column prop="price" label="价格"> </el-table-column>
        </el-table-column>

        <el-table-column label="客户卖价">
          <el-table-column prop="saleAbsoluteValue" label="绝对值"> </el-table-column>
          <el-table-column prop="salePercentage" label="百分比"> </el-table-column>
          <el-table-column prop="avol_percentage" label="波动度"> </el-table-column>
        </el-table-column>

        <el-table-column label="客户买价">
          <el-table-column prop="buyAbsoluteValue" label="绝对值"> </el-table-column>
          <el-table-column prop="buyPercentage" label="百分比"> </el-table-column>
          <el-table-column prop="bvol_percentage" label="波动度"> </el-table-column>
        </el-table-column>
      </el-table>

      <el-col :span="24" style="position: relative;background-color: white;">
        <div class="" style="float: left;height:90px;">
          <img src="../public//20180515110330.jpg" width="35%" />
        </div>
        <p
          style="padding: 0 30px;margin: 0;position: absolute;top: 10px;left: 100px;line-height: 25px;text-align:center;font-size: 14px;color: rgb(9,88,167);">
          免责声明：本报价中的信息均来自南华资本管理有限公司被认为可靠的公开资料,
          但南华资本对这些信息的完整性和可靠性不做任何保证,报告内容仅供参考,报告中的信息或所表达的意见，并不构成买卖的出价或询价,
          实时报价可参考左下方的微信报价平台。
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import p from '@/public/price.min.js'
  import g from '@/components/Global.vue'
  export default {
    name: "pdf",
    data() {
      return {
        optionsQuoteServerMarket: g.optionsQuoteServerMarket,
        optionsQuoteServer: g.optionsQuoteServer,
        options: [{
          value: '交易所',
          label: '交易所'
        }, {
          value: '板块',
          label: '板块'
        }],
        data11: '',
        value: '交易所',
        value7: [],
        NewData: [],
        ThisTime: "",
        NowDay: "",
        OneMonthDay: "",
        NowDayCom: "",
        NumDay: "",
        rest_day: [],
        CodeList: [],
        sorting_code: [],
        MarketCode: [],
        bid_deduction: "",
        ask_deduction: "",
        festival_list: [],
        market: [{
          text: '上海期货交易所',
          value: '上海期货交易所'
        }, {
          text: '郑州商品交易所',
          value: '郑州商品交易所'
        }, {
          text: '大连商品交易所',
          value: '大连商品交易所'
        }, {
          text: '上海国际能源交易中心',
          value: '上海国际能源交易中心'
        }],
        code: [],
        loading: true,
        dialogVisible: false,
        lastTime: '',
        last: '',
        nows: Date.now(),
        jjr: [],
      }
    },
    created: function () {
      this.regDate()
    },
    methods: {
      getDate(date) {
        // let time = this.timeyyM(nows)
        // let lastTime = this.getLast(time)
        let last = this.nextDate(date, 30)
        let week = this.timeyy(last)
        if (week == '周六') {
          last = this.nextDate(this.lastTime, 2)
        }
        if (week == '周日') {
          last = this.nextDate(this.lastTime, 1)
        }
        let week2 = this.getjjr(last)
        if (week2 == '周六') {
          last = this.nextDate(this.lastTime, 2)
        }
        if (week2 == '周日') {
          last = this.nextDate(this.lastTime, 1)
        }
        this.data11 = last
        this.look()
      },
      getjjr(str) {
        let jjr = this.jjr
        for (let i = 0; i < jjr.length; i++) {
          if (str == jjr[i]) {
            return getjjr(Number(str) + 1)
          } else {
            return str
          }
        }
      },
      // 获取下一天
      nextDate(date, num = 1) {
        // date为时间戳格式
        let time = date + 24 * 60 * 60 * 1000 * num
        var nextDate = new Date(time)
        this.lastTime = time
        return this.timeFormat(nextDate)
      },
      // 获取一个月后的今天
      getLast(date) {
        // date 格式为yyyy-mm-dd的日期
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 == 13) {
          year2 = parseInt(year2) + 1;
          month2 = 1;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }

        var t2 = year2 + '' + month2 + '' + day2;
        return t2;
      },
      // 检测时间
      getMyDay(date) {
        var week;
        if (date.getDay() == 0) week = "周日"
        if (date.getDay() == 1) week = "周一"
        if (date.getDay() == 2) week = "周二"
        if (date.getDay() == 3) week = "周三"
        if (date.getDay() == 4) week = "周四"
        if (date.getDay() == 5) week = "周五"
        if (date.getDay() == 6) week = "周六"
        return week
      },
      // 将yyyyMMdd格式的时间转换成格林威治格式的时间
      timeyy(res) {
        var r = res.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
        return this.getMyDay(new Date(r))
      },
      // 将格林威治时间格式转化为20190307格式的字符串
      timeFormat(time) {
        let y = time.getFullYear().toString();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        m = m.toString().padStart(2, "0")
        d = d.toString().padStart(2, "0")
        return y + '' + m + '' + d; //返回格式  "20191027" 字符串
      },
      // 将时间戳转化为yyyyMMdd格式的时间
      timeyyM(str) {
        let time = new Date(str);
        let y = time.getFullYear().toString();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        m = m.toString().padStart(2, "0")
        d = d.toString().padStart(2, "0")
        let sj = y + '-' + m + '-' + d;
        return sj
      },
      changePlate: function (ele) {
        if (ele == "交易所") {
          for (var j = 0; j < this.NewData.length; j++) {
            switch (this.NewData[j].market) {
              case "SHFE":
                this.NewData[j].CN_name = "上海期货交易所";
                break;
              case "DCE":
                this.NewData[j].CN_name = "大连商品交易所";
                break;
              case "CZCE":
                this.NewData[j].CN_name = "郑州商品交易所";
                break;
              case "INE":
                this.NewData[j].CN_name = "上海国际能源交易中心";
                break;
            }
          }
          this.NewData.sort(p.by('sort', p.by('code')));
          this.market = [{
            text: '上海期货交易所',
            value: '上海期货交易所'
          }, {
            text: '郑州商品交易所',
            value: '郑州商品交易所'
          }, {
            text: '大连商品交易所',
            value: '大连商品交易所'
          }, {
            text: '上海国际能源交易中心',
            value: '上海国际能源交易中心'
          }]
        } else if (ele == "板块") {
          let classification = [{
              "name": "黑色产业",
              "type": ["螺纹钢", "热轧卷板", "焦炭", "焦煤", "玻璃", "动力煤", "铁矿石", "线材", "中密度纤维板", "细木工板", "硅铁", "锰硅"]
            },
            {
              "name": "有色与贵金属",
              "type": ["白银", "铝", "黄金", "铜", "镍", "锌", "铅", "锡", "锌", "铅", "铅"]
            },
            {
              "name": "农产品",
              "type": ["普通小麦", "强麦", "早籼稻", "晚籼稻", "粳稻谷", "棉纱", "菜油籽", "黄大豆", "玉米", "玉米淀粉", "鲜鸡蛋", "豆粕", "豆油", "菜油",
                "菜粕", "白糖", "棉一号", "豆油", "棕榈油", "鲜苹果"
              ]
            },
            {
              "name": "能源化工",
              "type": ["精对苯二甲酸", "中质含硫原油", "甲醇", "聚丙烯", "橡胶", "聚乙烯", "聚氯乙烯", "石油沥青", "燃料油", "纸浆", "乙二醇", "漂针浆"]
            }
          ];
          for (let i = 0; i < this.NewData.length; i++) {
            for (let j = 0; j < classification.length; j++) {
              if ($.inArray(this.NewData[i].name, classification[j].type) != -1) {
                this.NewData[i].CN_name = classification[j].name;
              }
            }
          }
          this.NewData.sort(p.by('CN_name', p.by('code')));
          this.market = [{
            text: '农产品',
            value: '农产品'
          }, {
            text: '有色与贵金属',
            value: '有色与贵金属'
          }, {
            text: '能源化工',
            value: '能源化工'
          }, {
            text: '黑色产业',
            value: '黑色产业'
          }]
        } else {

        }
      },
      regDate() {
        var ws = new WebSocket(this.optionsQuoteServer);
        ws.onopen = function (evt) {
          ws.send('{"f":260,"r":"H1nzpDxnQvGLmui1Ts7EUA==","b":{}}');
        };
        ws.onmessage = e => {
          var Basic_market_data = JSON.parse(e.data);
          this.jjr = Basic_market_data.b.rest_day
          this.getDate(this.nows)
        }
      },
      look: function () {
        this.NewData = [];
        var that = this;
        var ws = new WebSocket(that.optionsQuoteServer);
        ws.onopen = function (evt) {
          ws.send('{"f":260,"r":"H1nzpDxnQvGLmui1Ts7EUA==","b":{}}');
          ws.send('{"f":257,"r":"eT/uZ6FjTjSRHvIO7EexqA==","b":{"market":["SHFE","DCE","CZCE","INE"]}}');
          ws.send('{"f":261,"r":"DpoF4ECPkRzCtzPxfataqg==","b":{"market":["SHFE","DCE","CZCE","INE"]}}')
        };
        ws.onmessage = function (evt) {
          var Basic_market_data = JSON.parse(evt.data);
          switch (Basic_market_data.r) {
            case "H1nzpDxnQvGLmui1Ts7EUA==":
              that.rest_day = Basic_market_data.b.rest_day;
              break;
            case "eT/uZ6FjTjSRHvIO7EexqA==":
              that.CodeList = Basic_market_data.b.code_list;
              var sorting_info = p.market_code_obj(that.CodeList);
              that.sorting_code = sorting_info[1]
              var sorting_code = p.sortingCode(sorting_info[1]);
              var a = sorting_code[0];
              for (var i = 1; i < sorting_code.length; i++) {
                a = a.concat(sorting_code[i])
              }
              that.MarketCode = a;
              var DayArr = p.ThirdDate(that.rest_day, 30),
                OneMonthDayCom = that.data11,
                NowDayCom = DayArr[2],
                NowDay = DayArr[3];
              that.ThisTime = OneMonthDayCom;
              that.NowDay = NowDay;
              that.NowDayCom = NowDayCom;
              that.NumDay = p.DateDiff(NowDayCom, OneMonthDayCom);
              for (var j = 0; j < that.CodeList.length; j++) {
                let CN_name = "";
                let sort = "";
                switch (that.MarketCode[j].market) {
                  case "SHFE":
                    CN_name = "上海期货交易所";
                    sort = "A";
                    break;
                  case "DCE":
                    CN_name = "大连商品交易所";
                    sort = "B";
                    break;
                  case "CZCE":
                    CN_name = "郑州商品交易所";
                    sort = "C";
                    break;
                  case "INE":
                    CN_name = "上海国际能源交易中心";
                    sort = "D";
                    break;
                }
                let obj = {};
                obj["market"] = that.MarketCode[j].market;
                obj["code"] = that.MarketCode[j].code;
                obj["name"] = "--";
                obj["CN_name"] = CN_name;
                obj["sort"] = sort;
                obj["plate"] = "";
                obj["price"] = "";
                obj["buyAbsoluteValue"] = "";
                obj["buyPercentage"] = "";
                obj["saleAbsoluteValue"] = "";
                obj["salePercentage"] = "";
                obj["ask_volatility"] = "";
                obj["bid_volatility"] = "";
                obj["bvol_percentage"] = "";
                obj["avol_percentage"] = "";
                obj["interest_rate"] = that.MarketCode[j].interest_rate;
                that.NewData.push(obj)
              }
              break;
            case "":
              console.log("loading...")
              break;
            default:
              break;
          }
        }

        var that = this;
        var options_quote_server_market = this.optionsQuoteServerMarket;
        var options_quote_server = this.optionsQuoteServer;
        var options_quote = {
          "kOutQueryCodeInfoReq": 257,
          "kOutQueryCodeInfoResp": 33025,
          "kOutQueryVolatilityReq": 265,
          "kOutQueryVolatilityResp": 33033,
          "kOutQueryFestivalReq": 259,
          "kOutQueryFestivalResp": 33027,
          "kOutQueryTradingDayReq": 260,
          "kOutQueryTradingDayResp": 33028,
          'kOutQueryMarketCodeReq': 513,
          'kOutQueryMarketCodeResp': 33281,
          "kOutQueryHangQingReq": 514,
          "kOutQueryHangQingResp": 33282,
          "kOutQueryDingYueReq": 515,
          "kOutQueryDingYueResp": 33283
        };
        var options_quote_sesseion = null;
        that.OptionsQuoteSession = function (url) {
          var _this = this;
          this.out_going_queue = [];
          this.connection = null;
          this.is_open = function () {
            return this.connection.readyState == WebSocket.OPEN;
          };
          this.send = function (parcel) {
            var data = JSON.stringify(parcel);
            if (this.is_open()) {
              this.connection.send(data);
              return true
            } else {
              return false
            }
          };
          this.flush = function () {};

          function on_open(evt) {
            _this.query_volatility_info();
            _this.query_festival_info();
            //_this.query_trading_day_info()
          }

          function on_error(evt) {
            console.log("Error occured: " + evt.data)
          }
          this.reconnect = function () {
            this.connection = new WebSocket(url);
            this.connection.onopen = on_open;
            this.connection.onmessage = on_message;
            this.connection.onerror = on_error
          };
          this.query_volatility_info = function () {
            var arr = [];
            for (var i = 0; i < that.MarketCode.length; i++) {
              var obj = {};
              obj["market"] = that.MarketCode[i].market;
              obj["code"] = that.MarketCode[i].code;
              obj["expiring_date"] = that.ThisTime || 0;
              obj["strike_price_ratio"] = [1];
              arr.push(obj)
            }
            let code_list = arr;
            var query_volatility_info_req_pack = make_parcel(options_quote.kOutQueryVolatilityReq, {
              "query_list": code_list
            });
            if (!this.send(query_volatility_info_req_pack)) {
              return false
            }
          };
          this.query_festival_info = function () {
            var query_festival_info_req_pack = make_parcel(options_quote.kOutQueryFestivalReq, {});
            if (!this.send(query_festival_info_req_pack)) {
              return false
            }
          };
          this.query_trading_day_info = function () {
            var query_trading_day_req_pack = make_parcel(options_quote.kOutQueryTradingDayReq, {});
            if (!this.send(query_trading_day_req_pack)) {
              return false
            }
          };

          function on_message(evt) {
            var parcel = JSON.parse(evt.data);
            switch (parcel.f) {
              case options_quote.kOutQueryVolatilityResp:
                for (var j = 0; j < that.CodeList.length; j++) {
                  if (JSON.parse(evt.data).b.ret == 0) {
                    that.NewData[j].ask_volatility = JSON.parse(evt.data).b.volatility_list[j].ask_volatility[0];
                    that.NewData[j].bid_volatility = JSON.parse(evt.data).b.volatility_list[j].bid_volatility[0];
                    that.NewData[j].bvol_percentage = (that.NewData[j].bid_volatility * 100).toFixed(2) + "%";
                    that.NewData[j].avol_percentage = (that.NewData[j].ask_volatility * 100).toFixed(2) + "%"
                  } else {
                    that.NewData[j].ask_volatility = "null";
                    that.NewData[j].bid_volatility = "null";
                    that.NewData[j].bvol_percentage = "null";
                    that.NewData[j].avol_percentage = "null"
                  }
                }
                break;
              case options_quote.kOutQueryFestivalResp:
                if (JSON.parse(evt.data).b.ret == 0) {
                  that.festival_list = JSON.parse(evt.data).b.festival_list;
                } else {
                  that.festival_list = [];
                }
                var dce = p.Deduction(that.NowDayCom, that.ThisTime, that.festival_list);
                that.bid_deduction = dce[0];
                that.ask_deduction = dce[1];
                break;
              case options_quote.kOutQueryTradingDayResp:
                break;
              default:
                console.log("Retrieved resp info: " + evt.data);
                break
            }
          }
        };
        that.OptionsQuoteSessionCodeList = function (url) {
          var _this = this;
          this.out_going_queue = [];
          this.connection = null;
          this.is_open = function () {
            return this.connection.readyState == WebSocket.OPEN
          };
          this.send = function (parcel) {
            var data = JSON.stringify(parcel);
            if (this.is_open()) {
              this.connection.send(data);
              return true
            } else {
              console.log("connection offline, cannot send parcel: " + data);
              return false
            }
          };
          this.flush = function () {};

          function on_open(evt) {
            _this.codeinfo();
            _this.jichushujv();
          }

          function on_close(evt) {
            //              setTimeout(function() {
            //                  _this.reconnect()
            //              }, 3000)
          }

          function on_error(evt) {
          
          }
          this.reconnect = function () {
            this.connection = new WebSocket(url);
            this.connection.onopen = on_open;
            this.connection.onclose = on_close;
            this.connection.onmessage = on_message;
            this.connection.onerror = on_error
          };
          this.codeinfo = function () {
            var arr = [];
            for (var i = 0; i < that.MarketCode.length; i++) {
              var obj = {};
              obj["market"] = that.MarketCode[i].market;
              obj["code"] = that.MarketCode[i].code;
              arr.push(obj)
            }
            let code_list = arr;
            var query_code_info_req_pack = make_parcel(options_quote.kOutQueryMarketCodeReq, {
              "code_list": code_list
            });
            if (!this.send(query_code_info_req_pack)) {
              return false
            }
          };
          this.jichushujv = function () {
            var arr = [];
            for (var i = 0; i < that.MarketCode.length; i++) {
              var obj = {};
              obj["market"] = that.MarketCode[i].market;
              obj["code"] = that.MarketCode[i].code;
              arr.push(obj)
            }
            let code_list = arr;
            var query_code_info_req_pack = make_parcel(options_quote.kOutQueryHangQingReq, {
              "code_list": code_list
            });
            if (!this.send(query_code_info_req_pack)) {
              return false
            }
          };

          function on_message(evt) {
            let parcel = JSON.parse(evt.data);
            switch (parcel.f) {
              case options_quote.kOutQueryHangQingResp:
                for (let i = 0; i < that.NewData.length; i++) {
                  that.NewData[i].price = Number((JSON.parse(evt.data).b.market_data[i].last_price).toFixed(2));
                }
                let dT_t_buy = ((that.NumDay - that.bid_deduction) / 365),
                  dT_t_sale = ((that.NumDay - that.ask_deduction) / 365);
                for (let i = 0; i < that.NewData.length; i++) {
                  if (that.NewData[i].bid_volatility != 0 && that.NewData[i].price != 0) {
                    that.NewData[i].buyAbsoluteValue = p.CalcCall(that.NewData[i].price, that.NewData[i].bid_volatility, that
                      .NewData[i].interest_rate, that.NewData[i].price, dT_t_buy);
                    that.NewData[i].buyAbsoluteValue = (that.NewData[i].buyAbsoluteValue).toFixed(2);
                    that.NewData[i].saleAbsoluteValue = p.CalcCall(that.NewData[i].price, that.NewData[i].ask_volatility, that
                      .NewData[i].interest_rate, that.NewData[i].price, dT_t_sale);
                    that.NewData[i].saleAbsoluteValue = (that.NewData[i].saleAbsoluteValue).toFixed(2);
                    that.NewData[i].buyPercentage = ((that.NewData[i].buyAbsoluteValue / that.NewData[i].price) * 100)
                      .toFixed(2) + "%";
                    that.NewData[i].salePercentage = ((that.NewData[i].saleAbsoluteValue / that.NewData[i].price) * 100)
                      .toFixed(2) + "%";
                  } else {
                    that.NewData[i].buyAbsoluteValue = "---";
                    that.NewData[i].saleAbsoluteValue = "---";
                    that.NewData[i].buyPercentage = "---";
                    that.NewData[i].salePercentage = "---";
                  }
                }
                break;
              case options_quote.kOutQueryMarketCodeResp:
                that.codeinfo = parcel.b.instrument;
                for (let i = 0; i < that.NewData.length; i++) {
                  let obj = {};
                  that.NewData[i].name = p.zifuchan(that.codeinfo[i].instrument_name);
                  obj["text"] = p.zifuchan(that.codeinfo[i].instrument_name);
                  obj["value"] = p.zifuchan(that.codeinfo[i].instrument_name);
                  that.code.push(obj);
                }
                var newArr = [];
                for (let i = 0; i < that.code.length; i++) {
                  if (p._objIsInArray(that.code[i], newArr) == -1) {
                    newArr.push(that.code[i]);
                  } else {
                    //console.log('对象已存在');
                  }
                }
                that.code = newArr;
                break;
              default:
                console.log("Retrieved resp info:" + evt.data);
                break
            }
          }
        };
        that.generate_rid = function () {
          var buffer = new ArrayBuffer(16);
          var intView = new Uint32Array(buffer);
          intView[0] = Math.random() * 1000000000000000;
          intView[1] = Math.random() * 1000000000000000;
          intView[2] = Math.random() * 1000000000000000;
          intView[3] = Math.random() * 1000000000000000;
          let bin_str = String.fromCharCode.apply(null, new Uint8Array(buffer));
          var base64_2 = btoa(bin_str);
          return base64_2
        };

        function Parcel(msg_type, body) {
          this.f = msg_type;
          this.r = that.generate_rid();
          if (body) {
            this.b = body
          } else {
            this.b = {}
          }
        }

        function make_parcel(msg_type, body) {
          var p = new Parcel(msg_type, body);
          return p
        }
        setTimeout(function () {
          options_quote_sesseion = new that.OptionsQuoteSession(options_quote_server);
          options_quote_sesseion.reconnect()
        }, 900)
        setTimeout(() => {
          let options_quote_sesseion_jichu = new that.OptionsQuoteSessionCodeList(options_quote_server_market);
          options_quote_sesseion_jichu.reconnect();
          this.loading = false;
        }, 1200);
      },
      downPdf: function () {
        document.title = 'NhCapital' + this.NowDayCom;
        document.getElementById("dpdf").style.display = "none";
        window.print();
        document.getElementById("dpdf").style.display = "block";
      },
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (!this.now_col_row_num[column.property]) {
          this.now_col_row_num[column.property] = Object.assign([], this.column_row_offset[column.property]);
          let a = this.now_col_row_num[column.property].shift();
          this.now_col_offset[column.property] = a;
          return {
            rowspan: a,
            colspan: 1
          };
        } else if (rowIndex >= this.now_col_offset[column.property]) {
          let a = this.now_col_row_num[column.property].shift();
          this.now_col_offset[column.property] += a;
          return {
            rowspan: a,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      },
      getRowClass({
        row,
        rowIndex
      }) {
        if (row.CN_name == "上海期货交易所" || row.CN_name == "农产品") {
          return 'color1'
        } else if (row.CN_name == "郑州商品交易所" || row.CN_name == "有色与贵金属") {
          return 'color2'
        } else if (row.CN_name == "大连商品交易所" || row.CN_name == "能源化工") {
          return 'color3'
        } else {
          return 'color4'
        }
      },
      filterTag(value, row, column) {
        //console.log(column.filteredValue);
        console.log(value)
        return row.CN_name === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      }
    }
  }

</script>

<style scoped>
  body {
    color: #000000;
    background-color: white;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;

  }

  .el-table thead.is-group th {
    background-color: rgb(15, 76, 149);
    color: #fff;
    text-align: center;
    font-size: 18px;
  }

  .el-table th {
    text-align: center;
  }

  table tbody tr td {
    text-align: center !important;
  }

  table tr td {
    font-size: 16px;
    text-align: center;
    border-color: #f00;
    height: 18px;
    color: #000;
    border-bottom: none !important;
    border-right: none !important;
  }

  .el-table__body tr:hover>td {
    background-color: initial !important;
  }

  .el-table__body tr.current-row>td {
    background-color: initial !important;
  }

  .el-table--border th {
    border-right: 2px solid white;
    border-bottom: 2px solid white;
  }

  .el-table .color1 {
    background-color: rgb(252, 233, 218);
  }

  .el-table .color2 {
    background-color: rgb(236, 240, 223);
  }

  .el-table .color3 {
    background-color: rgb(197, 217, 241);
  }

  .el-table .color4 {
    background-color: rgb(195, 215, 154);
  }

</style>
