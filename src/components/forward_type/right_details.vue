<template>
    <div class="right_details">
        <h4 class="title">合约{{ row.instrument_id }}</h4>
        <div class="warpper">
            <div class="row">
                <div>
                    <p>最新</p>
                    <P>{{ row.price }}</P>
                </div>
                <div>
                    <p>开盘</p>
                    <P>{{ row.open_price }}</P>
                </div>
            </div>

            <div class="row">
                <div>
                    <p>最高</p>
                    <P>{{ row.highest_price }}</P>
                </div>
                <div>
                    <p>最低</p>
                    <P>{{ row.lowest_price }}</P>
                </div>
            </div>

            <div class="row">
                <div>
                    <p>前收</p>
                    <P>{{ row.pre_close_price }}</P>
                </div>
                <div>
                    <p>前结</p>
                    <P>{{ row.pre_settlement_price }}</P>
                </div>
            </div>

            <div class="row">
                <div>
                    <p>涨停</p>
                    <P>{{ row.upper_limit_price }}</P>
                </div>
                <div>
                    <p>跌停</p>
                    <P>{{ row.lower_limit_price }}</P>
                </div>
            </div>

            <div class="buySell">
                <div class="sell">
                    <div class="row" style="margin-top: 5px;">
                        <div>
                            <p>卖五</p>
                            <P>{{ row.ask_price[4] }}</P>
                        </div>
                        <div>
                            <p>{{ row.ask_volume[4] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>卖四</p>
                            <P>{{ row.ask_price[3] }}</P>
                        </div>
                        <div>
                            <p>{{ row.ask_volume[3] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>卖三</p>
                            <P>{{ row.ask_price[2] }}</P>
                        </div>
                        <div>
                            <p>{{ row.ask_volume[2] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>卖二</p>
                            <P>{{ row.ask_price[1] }}</P>
                        </div>
                        <div>
                            <p>{{ row.ask_volume[1] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>卖一</p>
                            <P>{{ row.ask_price[0] }}</P>
                        </div>
                        <div>
                            <p>{{ row.ask_volume[0] }}</p>
                            <P></P>
                        </div>
                    </div>
                </div>
                <div class="buy">
                    <div class="row" style="margin-top: 10px;">
                        <div>
                            <p>买一</p>
                            <P>{{ row.bid_price[0] }}</P>
                        </div>
                        <div>
                            <p>{{ row.bid_volume[0] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>买二</p>
                            <P>{{ row.bid_price[1] }}</P>
                        </div>
                        <div>
                            <p>{{ row.bid_volume[1] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>买三</p>
                            <P>{{ row.bid_price[2] }}</P>
                        </div>
                        <div>
                            <p>{{ row.bid_volume[2] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>买四</p>
                            <P>{{ row.bid_price[3] }}</P>
                        </div>
                        <div>
                            <p>{{ row.bid_volume[3] }}</p>
                            <P></P>
                        </div>
                    </div>
                    <div class="row">
                        <div>
                            <p>买五</p>
                            <P>{{ row.bid_price[4] }}</P>
                        </div>
                        <div>
                            <p>{{ row.bid_volume[4] }}</p>
                            <P></P>
                        </div>
                    </div>
                </div>

                
            </div>
            <div class="updateTime">
                <el-row>
                    <el-col :span="4">更新时间:</el-col>
                    <el-col :span="20">{{ times }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">更新毫秒:</el-col>
                    <el-col :span="20">{{ row.update_millisec }}</el-col>
                </el-row>
            </div>
            
        </div>
        
    </div>
</template>

<script>
import bus from '@/assets/eventBus.js'
export default {
    data() {
        return {
            row: {
                ask_price: [0,0,0,0,0],
                ask_volume: [0,0,0,0,0],
                bid_price: [0,0,0,0,0],
                bid_volume: [0,0,0,0,0],
            },
        }
    },
    created() {
        bus.$on("lookDeatails", this.lookDeatails)
    },
    computed: {
        times() {
            if(!this.row.update_time) {
                return ''
            }
            let str = this.row.update_time.toString()
            let time = str.substring(0,2) + ":" + str.substring(2,4) + ":" + str.substring(4,6)
            return time
        },
    },
    destroyed() {
        this.row = {}
    },
    methods: {
        lookDeatails(row) {
            this.row = row
        },
    },
    props: ['configs']
}
</script>

<style scoped>
.right_details {
    width: 500px;
    height: 300px;
    box-sizing: border-box;
    padding: 0 20px;
}

.right_details .title {
    width: 460px;
    margin: 0 auto;
    height: 40px;
    font-size: 20px;
    text-align: center;
    line-height: 40px;
    background: #eee;
    border-radius: 10px;
}

.right_details .warpper {
    margin-top: 10px;
}

.right_details .warpper>.row {
    width: 460px;
    display: flex;
}

.buySell {
    display: flex;
}

.right_details .warpper .sell>.row,.right_details .warpper .buy>.row {
    width: 230px;
    display: flex;
}

.right_details .warpper .row>div {
    display: flex;
    width: 50%;
}

.right_details .warpper .row>div p {
    width: 50%;
}

.right_details .updateTime {
    margin-top: 10px;
}

</style>
