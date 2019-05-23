角色维护
<template>
    <div>
        <div class="search_bar">
            <div class="right">
                <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addRoles">新增
                </el-button>
                <el-button type="primary" size="small" @click="replaceFun"> 刷新 </el-button>
            </div>
        </div>
        <!-- table表格 -->
        <div>
            <el-table :data="roles" stripe style="width: 100%" :height="Height" border>
                <el-table-column type="index" width="60"> </el-table-column>
                <el-table-column prop="name" label="角色名称"> </el-table-column>
                <el-table-column prop="description" label=" 角色描述"> </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" title="编辑" type="primary" icon="el-icon-edit-outline"
                            @click="handleEdit(scope.$index, scope.row)" circle></el-button>
                        <el-button size="mini" title="删除" type="danger" icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)" circle></el-button>
                        <el-button size="mini" title="权限" type="success" icon="el-icon-setting"
                            @click="permissions(scope.$index, scope.row)" circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- dialog盒子 -->
        <div>
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
                <el-form :model="form">
                    <el-form-item label="角色名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" :label-width="formLabelWidth">
                        <el-input v-model="form.description" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="editSubmit">确定</el-button>
                </span>
            </el-dialog>

            <el-dialog title="分配权限" :visible.sync="dialogTree" width="50%">
                <el-row>
                    <el-tree :data="testTree" show-checkbox ref="tree" node-key="id" default-expanded-keys="[1]"
                        :props="defaultProps" @check-change="handleCheckChange">
                    </el-tree>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogTree = false">取消</el-button>
                    <el-button type="primary" @click="addPermission">确定</el-button>
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
        name: 'PECG',
        data() {
            return {
                permissionShow: false,
                roles: [],
                dialogVisible: false,
                form: {
                    name: '',
                    description: '',
                    id: ""
                },
                formLabelWidth: '120px',
                batchIndex: [],
                dialogTitle: "",
                selected: '', //修改的位置
                dialogTree: false,
                testTree: [],
                expandedArr: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                List: []
            }
        },
        created() {
            this.getRoleData()
        },
        methods: {
            // 滚动加载事件
            handleScroll(e) {
                if (e == 0 && !this.scrollFlag) {
                    this.scrollFlag = true
                    this.query().then(() => {
                        this.scrollFlag = false
                    }, () => {
                        this.scrollFlag = false
                    })
                }
            },

            getJurisdiction() {
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/permission/queryPermissions.do').then(result => {
                        if (result) {
                            let testT = [];
                            let permissions = result.data.permissions
                            testT.push(permissions[0])
                            for (let i = 0; i < permissions.length; i++) {
                                if (testT[0].id == permissions[i].pid) {
                                    testT[0]["children"].push(permissions[i])
                                }
                            }
                            for (let i = 0; i < testT[0].children.length; i++) {
                                for (let j = 0; j < permissions.length; j++) {
                                    if (testT[0].children[i].id == permissions[j].pid) {
                                        testT[0].children[i]["children"].push(permissions[j]);
                                    }
                                }
                            }
                            for (let i = 0; i < testT[0].children.length; i++) {
                                for (let j = 0; j < testT[0].children[i].children.length; j++) {
                                    for (let z = 0; z < permissions.length; z++) {
                                        if (testT[0].children[i].children[j].id == permissions[z].pid) {
                                            testT[0].children[i].children[j]["children"].push(
                                                permissions[z])
                                        }
                                    }
                                }
                            }
                            this.testTree = testT;
                        } else {
                            this.testTree = []
                        }
                    })
                })
            },
            replaceFun: function () {
                window.location.reload(true)
            },
            getRoleData: function () {
                this.roles = [];
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/role/queryRoles.do').then(result => {
                        if (result) {
                             this.roles = result.data.roles
                        } else {
                             this.permissionShow = true
                        }
                    })
                })
            },
            //增加
            addRoles: function () {
                this.dialogVisible = true;
                this.dialogTitle = "新增";
                this.form = {
                    name: "",
                    description: "",
                    id: ""
                }
            },
            //确认
            editSubmit: function () {
                if (this.form.name == "" || this.form.description == "") {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: '表单数据不完整'
                    });
                    return false;
                }
                if (this.dialogTitle === "新增") {
                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/role/addRole.do', this.qs.stringify({
                            name: this.form.name,
                            description: this.form.description
                        })).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    showClose: true,
                                    message: '新增成功'
                                })
                                this.getRoleData()
                            }
                        })
                    })
                } else {
                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/role/updateRole.do', this.qs.stringify({
                            id: this.form.id,
                            name: this.form.name,
                            description: this.form.description
                        })).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    showClose: true,
                                    message: '新增成功'
                                });
                                this.getRoleData()
                            }
                        })
                    })
                }
                this.dialogVisible = false;
            },
            handleEdit: function (index, row) {
                this.dialogVisible = true;
                this.dialogTitle = "编辑";
                this.form = JSON.parse(JSON.stringify(row));
                this.selected = index;
            },
            //分配权限
            permissions: function (index, row) {
                this.form = JSON.parse(JSON.stringify(row));

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/rolePermission/queryRolePermission.do', this.qs.stringify({
                        roleId: row.id
                    })).then(result => {
                        if (result) {
                            this.expandedArr = [];
                            let rolePermissions = result.data.rolePermissions
                            for (let i = 0; i < rolePermissions.length; i++) {
                                this.expandedArr.push(rolePermissions[i].permissionId);
                            }
                            var parentArr = [];
                            for (let i = 0; i < 1; i++) {
                                if (this.testTree[0].children.length > 0) {
                                    parentArr.push(this.testTree[0].id);
                                }
                                for (let j = 0; j < this.testTree[0].children.length; j++) {
                                    if (this.testTree[0].children[j].children.length > 0) {
                                        parentArr.push(this.testTree[0].children[j].id);
                                        for (let z = 0; z < this.testTree[0].children[j].children
                                            .length; z++) {
                                            if (this.testTree[0].children[j].children[z].children
                                                .length >
                                                0) {
                                                parentArr.push(this.testTree[0].children[j].children[z]
                                                    .id);
                                            }
                                        }
                                    }
                                }
                            }
                            for (let i = 0; i < parentArr.length; i++) {
                                if (this.expandedArr.indexOf(parentArr[i]) > -1) {
                                    var index = this.expandedArr.indexOf(parentArr[i]);
                                    this.expandedArr.splice(index, 1);
                                }
                            }
                            this.$refs.tree.setCheckedKeys(this.expandedArr);
                        }
                    })
                })
                this.dialogTree = true;
            },
            handleCheckChange: function () {
                this.List = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys());
            },
            //添加权限
            addPermission: function () {
                var jsonObj = {
                    roleid: ""
                }
                jsonObj.roleid = this.form.id;
                for (let i = 0; i < this.List.length; i++) {
                    jsonObj["ids[" + i + "]"] = this.List[i]
                }

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/rolePermission/doAdd.do', this.qs.stringify(jsonObj)).then(result => {
                        if (result) {
                            this.$message({
                                type: 'success',
                                message: '分配成功!',
                                showClose: true
                            })
                        }
                    })
                })
                this.dialogTree = false;
            },
            //删除角色
            handleDelete: function (index, row) {
                this.$confirm('此操作将删除用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/role/deleteRole.do', this.qs.stringify({
                            id: row.id
                        })).then(result => {
                            if (result) {
                                this.roles.splice(index, 1);
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                            } else {
                                this.$message({
                                    type: 'info',
                                    message: '删除失败!'
                                })
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

</style>