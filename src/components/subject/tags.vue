<template>
  <div class="navTags">
    <el-tabs v-model="editableTabsValue" @tab-click="handleClick" class="index">
      <el-tab-pane name="/">
        <span slot="label" class="tabIndex">
          <i class="iconfont icon-fangzi"></i>我的桌面
        </span>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="active">
      <el-tab-pane v-for="(item, index) in editableTabs" :key="index" :label="item.title" :name="item.name">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        editableTabsValue: '/',
        editableTabs: [],
        tabIndex: ''
      }
    },
    methods: {
      active(tag) {
        this.$router.push(tag.name)
      },
      handleClick(tag, event) {
        this.editableTabsValue = ''
        this.$router.push(tag.name)
      },
      // 添加标签
      addTags(obj) {
        console.log("addTag")
        let newTabName = obj.name;
        let newTabPath = obj.path
        this.editableTabs.push({
          title: newTabName,
          name: newTabPath,
        });
        this.editableTabsValue = newTabPath;
      },
      // 检查去重
      CheckToHeavy(obj) {
        if (this.editableTabs.length) {
          for (let i = 0; i < this.editableTabs.length; i++) {
            if (obj.name == this.editableTabs[i].title) {
              this.editableTabsValue = obj.path;
              return
            }
          }
          if (this.editableTabs.length >= 4) {
            this.editableTabs.splice(0, 1)
          }
          this.addTags(obj)
        } else {
          this.addTags(obj)
        }

      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
                this.$router.push(nextTab.name)
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },

    }
  }
</script>

<style lang="scss" scoped>
  .navTags {
    height: 40px;
    display: flex;

    .tabIndex {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 20px;
      }
    }
    
  }

  .index {
    padding: 0 15px;
  }
</style>