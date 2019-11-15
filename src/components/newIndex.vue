<template>
  <div class="newIndex">
    <forwardType></forwardType>
  </div>
</template>

<script>
import forwardType from '@/views/forward_type/forwardType.vue'
export default {
  name:'newIndex',
  components: {
    forwardType
  }
}
</script>

<style>
.newIndex {
  width: 1500px;
  margin: 0 auto;
}

</style>
