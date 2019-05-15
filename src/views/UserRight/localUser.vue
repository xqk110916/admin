<template>
    <div>
        <div>
            <Search type="Array" @query="query">
                <div slot="right">
                    <el-button type="primary" @click="refresh" size="small">刷新</el-button>
                </div>
            </Search>
        </div>
    </div>
</template>

<script>
    import Search from '../../components/search'

    export default {
        name: 'localUser',
        data() {
            return {
                id: '',
            }
        },
        created() {

        },
        methods: {
            refresh(){
                console.log("刷新")
            },
            query(id){
                console.log("查询", id)
            },
        },
        components: {
            Search
        },
        watch: {
            $route: {
                handler(newValue, oldVaule) {
                    this.id = newValue.params.id
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            url() {
                if (this.id == 1) {
                    return "11111"
                } else if (this.id == 2) {
                    return "2222222"
                }
            }
        }
    }
</script>

<style scoped>

</style>