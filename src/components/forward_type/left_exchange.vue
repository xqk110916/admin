<template>
  <div class="left">
    <el-input v-model="value" @keyup.native.enter="search" placeholder="请输入标的代码回车键搜索" class="search" title="按回车即可搜索"></el-input>
    <div class="nav">
      <ul>
        <li v-for="item in group" :key="item.value" @click="filters(item.value)" :class="[active == item.value?'active':'']">{{ item.label }}</li>
      </ul>
    </div>

  </div>
</template>

<script>
import bus from '@/assets/eventBus'
export default {
  name:'left_exchange',
  data(){
    return {
      value: '',
      active:'all',
      group: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '大连商品交易所',
          value: 'DCE',
        },
        {
          label: '郑州商品交易所',
          value: 'CZCE',
        },
        {
          label: '上海期货交易所',
          value: 'SHFE',
        },
        {
          label: '上海能源交易所',
          value: 'INE',
        },
        {
          label: '自选',
          value: 'zixuan',
        },
      ],
    }
  },
  methods: {
    search(){
      this.active = 'all'
      bus.$emit("searchDetails", this.value)
    },
    filters(val){
      this.active = val
      bus.$emit('filters', val)
    },
  },
  
}
</script>

<style scoped>
.left {
  width: 200px;
}

.nav {
  margin-top: 5px;
}
ul,li {
  list-style: none;
  font-size: 16px;
}
li {
  background: #005780;
  color: #fff;
  margin-bottom: 1px;
  text-align: center;
  padding: 5px 0;
}

.active {
  background: #e84784;
}

</style>
