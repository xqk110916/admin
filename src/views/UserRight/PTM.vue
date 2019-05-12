<template>
    <div>
        {{name}}
    </div>
</template>

<script>
export default {
    name:'PTM',
    data () {
        return {
            name:'111'
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
                this.name = newValue
            },
            immediate: true
        }
    }
}
</script>

<style>

</style>
