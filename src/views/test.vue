<template>
  <div>
    <x-table :datas="datas" :loadStatus="false">
      <div>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
      </div>
    </x-table>
  </div>
</template>

<script>
import xTable from '@/components/costom/table'
export default {
  name:'test',
  data(){
    return {
      datas:[
        {
          name:'张三',
          age:18,
          sex: '男'
        },
        {
          name:'张三',
          age:18,
          sex: '男'
        },
        {
          name:'张三',
          age:18,
          sex: '男'
        },
      ]
    }
  },
}
</script>

<style>

</style>
