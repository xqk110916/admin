<template>
  <div>
    <el-menu class="el-menu-vertical-demo bottom" @open="handleOpen" @close="handleClose" router unique-opened background-color="#eee"
      :collapse="isCollapse">
      <el-submenu v-for="item in g.nav" :index="item.name" :key="item.name">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="subset in item.children" :key="subset.name" :index="subset.path">{{subset.name}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import g from '../../public/global.vue'
  
  export default {
    data() {
      return {
        flex:'收起',
      };
    },
    created(){

    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
    },
    computed: {
      ...mapState({isCollapse:'aFoldStatus'}),
    }
  }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .icon-zhankai {
    font-size:32px;
  }

  .bottom {
    border-bottom:1px solid #000;
  }
</style>