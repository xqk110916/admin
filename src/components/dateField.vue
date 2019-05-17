<template>
  <div>
    <div>
      <el-date-picker v-model="start" type="date" placeholder="选择开始日期" :value-format="types" @change="changeStart" class="date">
      </el-date-picker>
      <el-date-picker v-model="end" type="date" placeholder="选择结束日期" :value-format="types" @change="changeEnd" v-if="size" class="date">
      </el-date-picker>
      <el-button type="primary" size="small" class="query" @click="query" :loading="loading" v-if="search"> {{loading?"":"查询"}}
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'deteField',
    data() {
      return {
        start: this.startDate,
        end: this.endDate,
        loading: false,
      }
    },
    created() {

    },
    methods: {
      changeStart(val) {
        this.$emit("update:startDate", val)
      },
      changeEnd(val) {
        this.$emit("update:endDate", val)
      },
      query() {
        this.loading = true
        this.$emit("query", this.clientId)
      },
    },
    watch: {
      // 默认时间为上个月的第一天到上个月的最后一天.如果为单个时间则默认时间为当天.如果改变数据类型，则不进行默认赋值
      start:{
        handler(newValue, oldValue) {
          // 进行默认赋值
          if(!newValue && !this.type) {
            if(this.size) {
              this.start = this.way.getNow()
            } else {
              this.start = this.way.getBeforeFirstDay()
            }
          }

          this.changeStart(this.start)
        },
        immediate:true,
      },
      end:{
        handler(newValue, oldValue) {
          // 进行默认赋值
          if(!newValue && !this.type) {
            this.end = this.way.getBeforeLastDay()
          }
          this.changeEnd(this.end)
        },
        immediate:true,
      },

    },
    props: {
      startDate: String,
      endDate: String,
      size: Boolean,
      type:String,
      search:Boolean,
    },
    computed: {
      types () {
        return this.type?this.type:"yyyyMMdd"
      }
    },
  }
</script>

<style scoped>

.date {
  margin-right: 6px;
}

.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width:140px !important;
}
</style>