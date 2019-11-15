<template>
  <div class="oldWarpper">
    <keep-alive exclude="TPage">
      <router-view />
      </router-view>
    </keep-alive>
  </div>

</template>

<script>
  export default {
    name: 'oldIndex'
  }

</script>

<style>
.oldWarpper {
  max-width: 750px;
  margin: 0 auto;
}
</style>
