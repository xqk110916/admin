角色维护
<template>
    <div>
        <div id="search">
            <dateField :startDate.sync="startDate" :endDate.sync="endDate" @update:startDate="changeStartDate" @update:endDate="changeEndDate" size type="yyyy-MM-dd">
            </dateField>
        </div>
    </div>
</template>

<script>
import dateField from '@/components/dateField.vue'

export default {
    name:'PECG',
    data () {
        return {
            startDate:'',
            endDate:'',
        }
    },
    created () {
 
    },
    methods: {
        changeStartDate(val){
            this.startDate = val
        },
        changeEndDate(val) {
            this.endDate = val
        }
    },
    watch: {
        $route: {
            handler(newValue, oldVaule) {
                
            },
            deep: true,
            immediate: true
        },

    },
    components: {
        dateField
    }
}
</script>

<style scoped>

</style>
