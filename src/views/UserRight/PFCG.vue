<template>
    <div>
        {{name}}
    </div>
</template>

<script>
export default {
    name:'PECG',
    data () {
        return {
            name:'222'
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
