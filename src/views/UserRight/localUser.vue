<template>
    <div>
        
    </div>
</template>

<script>
export default {
    name:'localUser',
    data () {
        return {
            id:'',
        }
    },
    created () {

    },
    methods: {

    },
    watch: {
        $route: {
            handler(newValue, oldVaule) {
                console.log(newValue)
                this.id = newValue.params.id
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style>

</style>
