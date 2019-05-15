<template>
  <div>
    <div class="date">
      <el-date-picker v-model="start" type="date" placeholder="选择开始日期" value-format="yyyyMMdd" @change="changeStart">
      </el-date-picker>
      <el-date-picker v-model="end" type="date" placeholder="选择结束日期" value-format="yyyyMMdd" @change="changeEnd" v-if="!size" class="end">
      </el-date-picker>
      <div class="right">
        <slot name="right"></slot>
      </div>
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
      }
    },
    watch: {
      // 默认时间为上个月的第一天到上个月的最后一天.如果为单个时间则默认时间为当天
      start:{
        handler(newValue, oldValue) {
          if(!newValue) {
            if(this.size) {
              this.start = this.way.getNow()
            } else {
              this.start = this.way.getBeforeFirstDay()
              this.changeStart(this.start)
            }
          }
        },
        immediate:true,
      },
      end:{
        handler(newValue, oldValue) {
          if(!newValue) {
            this.end = this.way.getBeforeLastDay()
            this.changeEnd(this.end)
          }
        },
        immediate:true,
      }
    },
    props: {
      startDate: String,
      endDate: String,
      size: Number,
    }
  }
</script>

<style scoped>
.date {
  padding:10px 0;
  height: 40px;
}

.right {
  float: right;
}

.end {
  margin-left: 10px;
}
</style>