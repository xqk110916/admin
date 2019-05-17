用户维护
<template>
    <div>
        <div>
            <div id="search">
                <fuzzyQuery ref="search" type="Array"></fuzzyQuery>
                <dateField search size @query="query"></dateField>
            </div>

            <div>
                <el-table :data="data" border :height="Height" v-loading="loading">
                    <el-table-column prop="string1" label="日期" width="180">
                    </el-table-column>
                    <el-table-column prop="string2" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="string3" label="地址">
                    </el-table-column>
                    <el-table-column prop="string4" label="日期" width="180">
                    </el-table-column>
                    <el-table-column prop="string5" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="string6" label="地址">
                    </el-table-column>
                    <el-table-column prop="string7" label="日期" width="180">
                    </el-table-column>
                    <el-table-column prop="string8" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="string9" label="地址">
                    </el-table-column>
                    <el-table-column prop="string10" label="地址">
                    </el-table-column>
                    <el-table-column prop="string11" label="地址">
                    </el-table-column>
                    <el-table-column prop="string12" label="地址">
                    </el-table-column>
                    <el-table-column prop="string13" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="string14" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="string15" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="string16" label="姓名" width="180">
                    </el-table-column>
                    <el-table-column prop="string17" label="姓名" width="180">
                    </el-table-column>
                </el-table>
            </div>
            <Page :total="total" :sizeArr="[100,200,300]" @update:page="changePage" @update:pagesize="changePageSize">
            </Page>
        </div>
    </div>
</template>

<script>
    import fuzzyQuery from '../../components/fuzzyQuery'
    import dateField from '../../components/dateField'
    import Page from '../../components/page.vue'
    import {
        mapGetters
    } from 'vuex'

    export default {
        name: 'localUser',
        data() {
            return {
                id: '',
                data: [],
                page: 1,
                pagesize: 20,
                total: 40,
                loading: false,
            }
        },
        created() {
            this.getId()
        },
        methods: {
            query(id) {
                this.loading = true
                return new Promise((reslove, reject) => {
                    this.axios.post(this.url).then(result => {
                        this.data = result.data.data.data
                        reslove()
                    })
                }).then(() => {
                    this.$refs.search.loading = false
                    this.loading = false
                })
            },

            getId() {
                this.id = this.$route.params.id
            },
            refresh() {
                console.log("刷新")
            },
            changePageSize(val) {
                this.pagesize = val
                this.query()
            },
            changePage(val) {
                this.page = val
                this.query()
            }
        },
        components: {
            fuzzyQuery,
            Page,
            dateField
        },
        watch: {

        },
        computed: {
            url() {
                if (this.id == 1) {
                    return "/data"
                } else if (this.id == 2) {
                    return "/num"
                }
            },
            ...mapGetters(['Height'])
        }
    }
</script>

<style>

</style>