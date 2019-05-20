用户维护
<template>
    <div>
        <div>
            <div id="search">
                <el-select v-model="department" placeholder="请选择部门" clearable size="small" @change="dmChange">
                    <el-option v-for="item in dmOptions" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="group" placeholder="请选择组" clearable size="small" @change="groupChange">
                    <el-option v-for="item in groupOptions" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                <el-input v-model.lazy="searchValue" placeholder="请输入用户名关键字" size="small" style="width:250px;">
                </el-input>
            </div>

            <div>
                <el-table :data="data" border :height="Height" v-loading="loading" v-loadmore="handleScroll">
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
        mapGetters,
        mapActions
    } from 'vuex'

    export default {
        name: 'localUser',
        data() {
            return {
                id: '',
                data: [],
                page: 1,
                pagesize: 20,
                total: 20,
                loading: false,
                flag: false,

                department: '',
                group: '',
                dmOptions: [],
                groupOptions: [],
                searchValue: '',
                option: [],
            }
        },
        created() {
            this.getId()
            this.query()

        },
        mounted() {

        },
        methods: {
            ...mapActions(['changeSearchStatus']),

            query(id) {
                this.loading = true
                return new Promise((reslove, reject) => {
                    this.axios.post(this.url).then(result => {
                        this.data.push(...result.data.data.data)
                        reslove()
                    })
                }).then(() => {
                    this.changeSearchStatus(false)
                    this.loading = false
                })
            },
            getId() {
                this.id = this.$route.params.id
            },
            changePageSize(val) {
                this.pagesize = val
                this.query()
            },
            changePage(val) {
                this.page = val
                this.query()
            },
            // 滚动加载事件
            handleScroll(e) {
                if (e == 0 && !this.flag) {
                    this.flag = true
                    this.query().then(() => {
                        this.flag = false
                    }, () => {
                        this.flag = false
                    })
                }
            },
            // select框事件处理
            dmChange(val) {

            },
            groupChange(val) {

            },
            // select框数据获取
            getListInfo: function () {
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/dept/queryAll.do').then((result) => {
                        if (result.data.success) {
                            if (result.data.list) {
                                this.dmOptions = result.data.list
                                this.dmOptions.forEach(element => {
                                    let obj = {}
                                    obj["value"] = element
                                    obj["label"] = element
                                    this.option.push(obj)
                                });
                            } else {
                                this.dmOptions = []
                                this.option = []
                            }
                        } else {
                            this.dmOptions = []
                            this.option = []
                            this.$message({
                                type: 'error',
                                message: '获取部门失败!',
                                showClose: true
                            })
                        }
                    })
                })
            },
            dmChange() {
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/group/queryAll.do', this.qs.stringify({
                        deptName: this.department
                    })).then((result) => {
                        if (result.data.success && result.data.list) {
                            this.groupOptions = result.data.list
                        } else {
                            this.groupOptions = []
                        }

                    })
                })

            },
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