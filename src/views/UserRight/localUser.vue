<template>
    <div>
        {{name}}
    </div>
</template>

<script>
export default {
    name:'localUser',
    data () {
        return {
            name:'',
        }
    },
    created () {

    },
    methods: {

    },
    watch: {
        $route: {
            handle(newValue, oldVaule) {
                console.log(newValue)
            },
            immediate: true
        }
    }
}
</script>

<style>

</style>
