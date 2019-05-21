许可维护
<template>
    <div>
        <div class="search_bar">
            <div class="right">
                <el-button size="small"> 许可维护 </el-button>
                <el-button type="primary" size="small" @click="replaceFun"> 刷新 </el-button>
            </div>
        </div>
        <!-- 内容 -->
        <div>
            <el-tree :data="testTree" highlight-current show-checkbox ref="tree" node-key="id"
                :default-checked-keys="[1]" default-expanded-keys="[1]" :props="defaultProps"
                :expand-on-click-node="false" @check-change="handleCheckChange">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span> {{ node.label }} </span>
                    <span>
                        <el-button type="text" size="mini" @click="() => append(data)">
                            添加
                        </el-button>
                        <el-button type="text" size="mini" @click="() => edit(data)">
                            修改
                        </el-button>
                        <el-button type="text" size="mini" @click="() => update(data)">
                            修改父级
                        </el-button>
                        <el-button type="text" size="mini" @click="() => remove(node, data)">
                            删除
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </div>
        <!-- dialog盒子 -->
        <div>
            <el-dialog :title="title" :visible.sync="dialogParent" width="40%">
                <el-dialog width="30%" title="是否确定" :visible.sync="innerVisible" append-to-body
                    :before-close="parentClose">
                    <p>确定将 {{dialogChildVal}} 修改到 {{dialogParentVal}} 的子目录中？</p>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="parentClose">取 消</el-button>
                        <el-button type="primary" @click="changeParent">确定</el-button>
                    </div>
                </el-dialog>
                <el-tree :data="parentTree" highlight-current show-checkbox ref="tree" node-key="id"
                    :props="defaultProps" check-strictly :expand-on-click-node="false" @check-change="parent"
                    :disabled="true">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span> {{ node.label }} </span>
                    </span>
                    </span>
                </el-tree>
            </el-dialog>

            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
                <el-row class="dialog-row">
                    <el-col :span="4" class="dialog-col-two" align="right"> 权限名称: </el-col>
                    <el-col :span="16">
                        <el-input v-model="dialogData.name" placeholder="请输入内容" size="mini"></el-input>
                    </el-col>
                </el-row>
                <el-row class="dialog-row">
                    <el-col :span="4" class="dialog-col-two" align="right"> 权限路径: </el-col>
                    <el-col :span="16">
                        <el-input v-model="dialogData.url" placeholder="请输入内容" size="mini"></el-input>
                    </el-col>
                </el-row>
                <el-row class="dialog-row">
                    <el-col :span="4" class="dialog-col-two" align="right"> 权限: </el-col>
                    <el-col :span="16">
                        <el-select v-model="permissScopeValue" placeholder="请选择部门" size="small">
                            <el-option v-for="item in permissScopeSel" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogBtn">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: 'PTM',
        data() {
            return {
                innerVisible: false,
                permissionShow: false,
                permissions: [],
                testTree: [],
                expandedArr: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dialogTitle: "",
                dialogVisible: false,
                dialogData: "",
                disabtn: true,
                permissScopeSel: [],
                permissScopeValue: '11',
                flag: true,

                dialogParent: false,
                parentTree: [],
                aObj: {},
                id: '',
                arr: [],
                title: '',
                dialogParentVal: '',
                dialogChildVal: '',
            }
        },
        created() {
            // this.permissScopeSel = letDate.permissScopeSel;
            // this.getPermissData();
        },
        methods: {
            replaceFun: function () {
                window.location.reload(true)
            },
            handleCheckChange(data, node, indeterminate) {

            },
            update(data) {
                this.title = "修改  " + data.name + data.id + "   节点的父级节点为选择项（不能选择自身或自身的子集，只能选一次）"
                this.aObj = data
                this.dialogParent = true
                this.dialogChildVal = `${data.name}(${data.id})`
            },
            parent(a, b, c) {
                if (b) {
                    this.arr = this.$refs.tree.getCheckedNodes()
                    this.id = a.id
                    this.dialogParentVal = `${a.name}(${a.id})`
                    this.innerVisible = true
                    this.examine()
                }
            },
            parentClose() {
                this.innerVisible = false
                this.$refs.tree.setCheckedNodes([])
                this.arr = []
            },
            examine() {
                for (let i = 0; i < this.arr.length; i++) {
                    if (this.arr[i].name == this.aObj.name) {
                        this.$message({
                            type: "error",
                            message: "不能选择该权限的子权限或本身",
                            showClose: true,
                        })
                        this.parentClose()
                        return
                    }
                }
            },
            // 修改父权限
            changeParent() {
                this.innerVisible = false

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/permission/doUpdate.do', this.qs.stringify({
                        id: this.aObj.id,
                        pid: this.id,
                    })).then(result => {
                        if (result) {
                            this.$message({
                                type: "success",
                                message: "修改成功",
                                showClose: true,
                            })
                            this.arr = []
                            this.dialogParent = false
                            setTimeout(() => {
                                this.replaceFun()
                            }, 1000)
                        } else {
                            this.arr = []
                            this.dialogParent = false
                            setTimeout(() => {
                                this.replaceFun()
                            }, 1000)
                        }
                    })
                })
            },
            getPermissData: function () {
                this.testTree = [];

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/permission/queryPermissions.do').then(result => {
                        if (result) {
                            var expandedArr = [];
                            var testT = [];
                            let permissions = result.data.permissions
                            testT.push(permissions[0])
                            for (var i = 0; i < permissions.length; i++) {
                                if (testT[0].id == permissions[i].pid) {
                                    testT[0]["children"].push(permissions[i])
                                }
                            }
                            for (var i = 0; i < testT[0].children.length; i++) {
                                for (var j = 0; j < permissions.length; j++) {
                                    if (testT[0].children[i].id == permissions[j].pid) {
                                        testT[0].children[i]["children"].push(permissions[j]);
                                    }
                                }
                            }
                            for (var i = 0; i < testT[0].children.length; i++) {
                                for (var j = 0; j < testT[0].children[i].children.length; j++) {
                                    this.expandedArr.push(testT[0].children[i].children[j].id)
                                    for (var z = 0; z < permissions.length; z++) {
                                        if (testT[0].children[i].children[j].id == permissions[z]
                                            .pid) {
                                            testT[0].children[i].children[j]["children"].push(permissions[z])
                                        }
                                    }
                                }
                            }
                            this.testTree = testT;
                            this.parentTree = testT
                        }
                    })
                })
            },
            append(data) {
                this.flag = true
                this.dialogTitle = `${data.name} - 新增子权限`;
                this.dialogData = JSON.parse(JSON.stringify(data));
                this.dialogData.name = "";
                this.dialogData.url = "";
                this.dialogData.pid = this.dialogData.id;
                this.dialogVisible = true;
            },
            edit(data) {
                this.flag = false
                this.dialogTitle = `${data.name} - 修改权限`;
                // this.dialogData = JSON.parse(JSON.stringify(data));

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/permission/queryPermission.do', this.qs.stringify({
                        id: data.id
                    })).then(result => {
                        if (result) {
                            this.dialogData = result.data.permission
                            var index = this.dialogData.url.lastIndexOf("\_");
                            this.permissScopeValue = this.dialogData.url.substring(index + 1, this.dialogData.url.length);
                            var str = this.dialogData.url.substring(0, this.dialogData.url.length - 5);
                            this.dialogData.url = str;
                            this.dialogVisible = true;
                        }
                    })
                })

            },
            remove: function (node, data) {
                this.$confirm('此操作将删除权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/permission/doDelete.do', this.qs.stringify({
                            id: data.id
                        })).then(result => {
                            if (result) {
                                window.location.reload(true)
                            }
                        })
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        showClose: true
                    });
                });
            },
            dialogBtn: function () {
                if (this.dialogData.name == "" || this.dialogData.url == "") {
                    alert("数据不完整");
                    return false;
                }
                if (this.flag) {
                    var str = this.dialogData.url + '_&_' + this.permissScopeValue
                    this.dialogData.url = str

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/permission/doAdd.do', this.qs.stringify({
                            pid: this.dialogData.pid,
                            name: this.dialogData.name,
                            icon: this.dialogData.icon,
                            url: this.dialogData.url,
                        })).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    message: "新增成功!",
                                    showClose: true
                                })
                                this.getPermissData()
                            }
                        })
                    })
                } else {
                    var str = this.dialogData.url + '_&_' + this.permissScopeValue
                    this.dialogData.url = str

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/permission/doUpdate.do', this.qs.stringify({
                            id: this.dialogData.id,
                            // pid: this.dialogData.pid,
                            name: this.dialogData.name,
                            icon: this.dialogData.icon,
                            url: this.dialogData.url,
                        })).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    message: "修改成功!",
                                    showClose: true
                                });
                                this.getPermissData()
                            }
                        })
                    })
                }
                this.dialogVisible = false;
            }
        },
        watch: {

        },
        computed: {
            ...mapGetters(['Height']),
        }
    }
</script>

<style scoped>
    .right {
        float: right;
    }
</style>