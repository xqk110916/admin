<template>
    <div>
        
    </div>
</template>

<script>
export default {
    name:'PTM',
    data () {
        return {
            id:''
        }
    },
    created () {
        console.log(1)
    },
    methods: {

    },
    watch: {
        $route: {
            handler(newValue, oldVaule) {
                console.log(newValue)
                this.id = newValue.params.id
            },
            immediate: true
        }
    }
}
</script>

<style>

</style>
