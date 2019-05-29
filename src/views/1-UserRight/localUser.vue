用户维护
<template>
    <div>
        <div>
            <div class="search_bar">
                <el-select v-model="bumenValue" placeholder="请选择部门" clearable size="small" @change="seleChange" class="top_search">
                    <el-option v-for="item in optionSel" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="zuValue" placeholder="请选择组" clearable size="small" @change="seleChangeZu" class="top_search">
                    <el-option v-for="item in optionsZuSel" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
                <el-input v-model.lazy="keyword" placeholder="请输入用户名关键字" size="small" style="width:160px;" class="top_search"></el-input>
                <div class="btn_box">
                    <el-button type="primary" class="top_search" size="small" @click="ChildRights" :disabled="true">品种子权限</el-button>
                    <el-button type="primary" class="top_search" size="small" @click="profitLoss">分配损益</el-button>
                    <el-button type="primary" class="top_search" size="small" @click="distributionArea">辖区权限</el-button>
                    <el-button type="primary" class="top_search" size="small" @click="distributionSub">子账权限</el-button>
                    <el-button type="primary" class="top_search" size="small" icon="el-icon-circle-plus-outline" @click="addinfo"> 新增 </el-button>
                    <el-button type="primary" class="top_search" size="small" @click="seleChangeZu"> 刷新 </el-button>
                </div>

            </div>

            <div>
                <el-table :data="search" :height="Height" v-loadmore="handleScroll" @cell-click="kehucellClick"
                    ref="singleTable" @current-change="handleCurrentChange" highlight-current-row border
                    v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(255, 255, 255, 0.5)">
                    <el-table-column type="index"> </el-table-column>
                    <el-table-column prop="account" label="用户名" width="150"> </el-table-column>
                    <el-table-column prop="name" label="姓名"> </el-table-column>
                    <el-table-column prop="dept" label="部门"> </el-table-column>
                    <el-table-column prop="group" label="组"> </el-table-column>
                    <el-table-column prop="mail" label="邮箱"> </el-table-column>
                    <el-table-column label="角色" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span> {{ getRolesName(scope.row.roles) }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" title="编辑" type="primary" icon="el-icon-edit-outline"
                                @click="handleEdit(scope.$index, scope.row)" circle></el-button>
                            <el-button size="mini" title="删除" type="danger" icon="el-icon-delete"
                                @click="handleDelete(scope.$index, scope.row)" circle></el-button>
                            <el-button size="mini" title="角色分配" type="success" icon="el-icon-share"
                                @click="handAssignPermissions(scope.$index, scope.row)" circle></el-button>
                            <el-button size="mini" title="修改密码" type="warning" icon="el-icon-edit"
                                @click="handUpdataPassword(scope.$index, scope.row)" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- dialog集合 -->
            <div class="dialog">
                <!-- 新增dialog -->
                <el-dialog :title=dialogTitle :visible.sync="dialogVisible" width="30%">
                    <el-form :model="form" ref="form">
                        <el-form-item label="用户名:" :label-width="formLabelWidth" prop="account">
                            <el-input v-model="form.account" auto-complete="off" :disabled="yonghuming"
                                placeholder="请输入用户名">
                            </el-input>
                        </el-form-item>

                        <el-form-item label="密码:" :label-width="formLabelWidth" prop="password" v-show="!yonghuming">
                            <el-input type="password" v-model="form.password" auto-complete="off" placeholder="请输入您的密码">
                            </el-input>
                        </el-form-item>

                        <el-form-item label="密码:" :label-width="formLabelWidth" prop="password" v-show="!yonghuming">
                            <el-input type="password" v-model="form.passwordtwo" auto-complete="off" placeholder="请确认密码"
                                @change="password"> </el-input>
                        </el-form-item>

                        <el-form-item label="姓名:" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="form.name" auto-complete="off" placeholder="请输入您的姓名"></el-input>
                        </el-form-item>

                        <el-form-item label="部门:" :label-width="formLabelWidth" prop="dept">
                            <el-autocomplete class="inline-input" v-model="form.dept" :fetch-suggestions="querySearch"
                                placeholder="请输入部门" @select="seleChangeForm"></el-autocomplete>
                        </el-form-item>

                        <el-form-item label="组:" :label-width="formLabelWidth" prop="group">
                            <el-autocomplete class="inline-input" v-model="form.group"
                                :fetch-suggestions="querySearchZu" placeholder="请输入组"></el-autocomplete>
                        </el-form-item>

                        <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="mail">
                            <el-input v-model="form.mail" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="editSubmit('form')">确定</el-button>
                    </span>
                </el-dialog>
                <!-- 修改密码dialog -->
                <el-dialog title="修改密码" :visible.sync="dialogEditPassword" width="30%" @close="passwordClose">
                    <el-form :model="formPassword">
                        <el-form-item label="用户名" :label-width="formLabelWidth" prop="account">
                            <el-input v-model="formPassword.account" auto-complete="off" :disabled=true> </el-input>
                        </el-form-item>

                        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword" placeholder="密码最少8位；大写字母、小写字母、数字、特殊字符至少两种">
                            <el-input type="password" v-model="formPassword.newPassword" auto-complete="off">
                            </el-input>
                        </el-form-item>

                        <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="checkPassword">
                            <el-input type="password" v-model="formPassword.checkPassword" auto-complete="off" placeholder="密码最少8位；大写字母、小写字母、数字、特殊字符至少两种">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="editPassword">确定</el-button>
                    </span>
                </el-dialog>

                <el-dialog title="分配角色" :visible.sync="dialogAssignPermissions" width="40%">
                    <el-transfer v-model="value1" :data="data1" :titles="rolrTitle" @change="roleChange"
                        @left-check-change="leftRoleChange" @right-check-change="rightRoleChange"></el-transfer>
                    <!-- <span v-for="(item,index) in data1" :key="index">{{item}}</span> -->
                </el-dialog>

                <el-dialog :title="treeTitle" :visible.sync="dialogChildren" width="30%">
                    <el-row v-show="seleShow" style="margin-bottom:10px">
                        <el-select v-model="mainAccountId" placeholder="请选择" size="small">
                            <el-option v-for="item in platSubAccountInfoModels" :key="item.subAccountNo"
                                :label="item.subAccountName" :value="item.subAccountNo"> </el-option>
                        </el-select>
                    </el-row>

                    <!-- 全选按钮 -->
                    <el-checkbox v-show="seleShowArea" v-model="checkAll" @change="checkAllChange">{{checkText}}
                    </el-checkbox>
                    <el-checkbox v-show="seleShowSub" v-model="checkSubAll" @change="checkAllSub"
                        style="margin-left: 0;">
                        {{checkText2}}</el-checkbox>
                    <el-checkbox v-show="marketShow" v-model="checkMarkeAll" @change="checkAllMarke"
                        style="margin-left: 0;"></el-checkbox>
                    {{checkText3}}</el-checkbox>
                    <!-- 反选按钮 -->
                    <el-button v-show="seleShowArea" type="primary" size="mini" @click="invertAreaChange">反选</el-button>
                    <el-button v-show="seleShowSub" type="primary" size="mini" @click="invertSubChange">反选</el-button>
                    <!-- <el-button v-show="marketShow" type="primary" size="mini" @click="invertMarkeChange">反选</el-button> -->

                    <el-tree v-show="marketShow" :data="tree" show-checkbox ref="tree" node-key="label"
                        :props="defaultProps" @check-change="handleCheckChange">
                    </el-tree>

                    <el-checkbox-group v-show="seleShowArea" v-model="areaArr">
                        <el-checkbox v-for="item in clientAreaInfos" :label="item.areaNo"
                            style="display:block;margin-left:10px;padding:5px;" @change="handleCheckChangeArea">
                            {{item.areaName}}
                        </el-checkbox>
                    </el-checkbox-group>

                    <el-checkbox-group v-show="seleShowSub" v-model="subArr">
                        <el-checkbox v-for="item in platSubAccountTree" :label="item.subAccountNo"
                            style="display:block;margin-left:10px;padding:5px;" @change="handleCheckChangeSub">
                            {{item.subAccountName}}
                        </el-checkbox>
                    </el-checkbox-group>

                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="editPermiss">确定</el-button>
                    </span>
                </el-dialog>
            </div>
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
                OA: '',
                data: [],
                page: 1,
                pagesize: 20,
                total: 20,
                loading: true,
                scrollFlag: false,

                // 全选
                checkAll: false,
                checkSubAll: false,
                checkMarkeAll: false,
                arrs: [],
                subs: [],
                markes: [],
                markess: [],
                checkText: "全选",
                checkText2: "全选",
                checkText3: "全选",

                permissionShow: false,
                value1: [],
                catchArr: [],
                leftArr: [],
                rightArr: [],
                data1: [],
                rolrTitle: ['未分配权限', '已分配权限'],
                optionSel: [],
                optionsZuSel: [],
                options: [],
                optionsZu: [],
                CustomerInformation: [],
                dialogVisible: false,
                dialogEditPassword: false,
                dialogAssignPermissions: false,
                form: {
                    account: '',
                    dept: "",
                    group: "",
                    mail: "",
                    password: null,
                    name: ''
                },
                formPassword: {
                    account: "",
                    oldPassword: "",
                    newPassword: "",
                    checkPassword: ""
                },
                formLabelWidth: '100px',
                batchIndex: [],
                keyword: "",
                bumenValue: "",
                zuValue: "",
                dialogTitle: "",
                selected: '', //修改的位置
                yonghuming: true,
                dialogChildren: false,
                treeTitle: "",
                checkKeys: [],
                tree: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                defaultPropsArea: {
                    children: 'children',
                    label: 'areaName'
                },
                defaultPropsSub: {
                    children: 'children',
                    label: 'subAccountName'
                },
                marketArr: [],
                keyArr: [],
                areaArr: [],
                subArr: [],
                platSubAccountInfoModels: [],
                platSubAccountTree: [],
                mainAccountId: "",
                seleShow: false,
                seleShowArea: false,
                seleShowSub: false,
                marketShow: false,
                clientAreaInfos: [],
                flag: false,
            }
        },
        created() {
            this.getId()

            this.seleChangeZu()
            this.getSubNo()
            this.getListInfo()
            this.getExchangePro()
            this.getClientArea()
            this.restaurantsZu = this.optionsZu
        },
        mounted() {

        },
        methods: {
            ...mapActions(['changeSearchStatus']),
            // 获取路由参数
            getId() {
                this.OA = this.$route.params.id
            },
            // 滚动加载事件
            handleScroll(e) {
                if (e == 0 && !this.scrollFlag) {
                    this.scrollFlag = true
                    this.seleChangeZu().then(() => {
                        this.scrollFlag = false
                    }, () => {
                        this.scrollFlag = false
                    })
                }
            },


            // 全选
            checkAllChange(val) {
                if (val) {
                    this.areaArr = this.arrs
                } else {
                    this.areaArr = []
                }
            },
            checkAllSub(val) {
                if (val) {
                    this.subArr = this.subs
                } else {
                    this.subArr = []
                }
            },
            checkAllMarke(val) {
                if (val) {
                    this.$refs.tree.setCheckedNodes(this.markes)
                } else {
                    this.$refs.tree.setCheckedNodes([])
                }
            },
            // 效验两次密码是否一致
            password(val) {
                if (!this.form.password || !val) {
                    this.$message({
                        type: "warning",
                        message: "请先输入密码",
                        showClose: true,
                    })
                }
                if (val != this.form.password) {
                    this.$message({
                        type: "warning",
                        message: "两次密码不一致，请确认您输入的密码",
                        showClose: true,
                    })
                    this.form.passwordtwo = ''
                }
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            querySearchZu(queryString, cb) {
                var restaurants = this.restaurantsZu;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },

            handleSelect(item) {

            },
            replaceFun: function () {
                window.location.reload(true)
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            getUserInfo() {
                return new Promise((reslove, reject) => {
                    this.axios.post(`manage/${this.url}userinfo/queryAllInfo.do`).then(result => {
                        if (result) {
                            this.CustomerInformation = result.data.userInfoModels;
                            this.setCurrent(this.CustomerInformation[0]);
                            this.ind = 0;
                        } else {
                            this.CustomerInformation = [];
                            this.$message({
                                type: 'error',
                                message: '获取用户信息失败!',
                                showClose: true
                            });
                        }
                        this.loading = false;
                    })
                })
            },
            getRole () {

            },
            getClientArea: function () {
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/clientarea/queryAll.do').then(result => {
                        if(result) {
                            let arr = []
                            this.clientAreaInfos = result.data.clientAreaInfos
                            for (let i = 0; i < _this.clientAreaInfos.length; i++) {
                                arr.push(_this.clientAreaInfos[i].areaNo)
                            }
                            this.arrs = arr
                        } else {
                            this.arrs = []
                        }
                    })
                })
            },
            getSubNo: function () {
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/inner/subaccount/queryAll.do').then(result => {
                        if(result) {
                            let platSubAccountInfoModels = result.data.platSubAccountInfoModels
                             for (var i = 0; i < platSubAccountInfoModels.length; i++) {
                                var obj = {}
                                obj["subAccountNo"] = platSubAccountInfoModels[i].subAccountNo
                                obj["subAccountName"] = platSubAccountInfoModels[i].subAccountName
                                this.platSubAccountInfoModels.push(obj)
                                this.platSubAccountTree.push(obj)
                            }
                            this.mainAccountId = this.platSubAccountInfoModels[0].subAccountNo
                            // 获取全选所用的数据
                            for (let i = 0; i < this.platSubAccountInfoModels.length; i++) {
                                this.subs.push(this.platSubAccountInfoModels[i].subAccountNo)
                            }
                        } else {
                            this.platSubAccountInfoModels = []
                        }
                    })
                })
            },
            getListInfo: function () {
                let url = this.url?"manage/nawaauserinfo/queryDepts.do":"manage/dept/queryAll.do"
                return new Promise((reslove, reject) => {
                    this.axios.post(url).then(result => {
                        if (result && result.data.list !== null) {
                            this.optionSel = result.data.list;
                            for (var i = 0; i < this.optionSel.length; i++) {
                                var obj = {}
                                obj["value"] = this.optionSel[i]
                                obj["label"] = this.optionSel[i]
                                this.options.push(obj)
                            }
                            this.restaurants = this.options
                        } else {
                            this.options = []
                        }
                    })
                })
            },
            getExchangePro: function () {
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/inner/underlying/queryAllExchangeProductUnderlying.do').then(result => {
                        if(result) {
                            var testT = [];
                            var marketArr = Object.keys(result.data.exchangeProductMap);
                            this.marketArr = Object.keys(result.data.exchangeProductMap);
                            for (var i = 0; i < marketArr.length; i++) {
                                var obj = {};
                                obj['label'] = marketArr[i];
                                obj.children = [];
                                testT.push(obj);
                            }
                            for (var j = 0; j < marketArr.length; j++) {
                                for (var z = 0; z < result.data.exchangeProductMap[marketArr[j]]
                                    .length; z++) {
                                    var obj = {}
                                    obj['label'] = marketArr[j] + "_" + result.data.exchangeProductMap[marketArr[j]][z]
                                    testT[j].children.push(obj)
                                }
                            }
                            this.tree = testT
                            this.markes = testT
                        }
                    })
                })
            },
            getRolesName: function (e) {
                var test = []
                for (var i = 0; i < e.length; i++) {
                    test.push(e[i].name)
                }
                test = test.join(",");
                return test
            },
            //查询部门
            seleChange: function () {
                let url = this.url?"manage/nawaauserinfo/queryGroups.do":"manage/group/queryAll.do"
                return new Promise((reslove, reject) => {
                    this.axios.post(url, this.qs.stringify({deptName: this.bumenValue})).then(result => {
                        if(result) {
                            this.optionsZuSel = result.data.list;
                        } else {
                            this.optionsZuSel = []
                        }
                    })
                })
                //查询用户信息
                return new Promise((reslove, reject) => {
                    this.axios.post(`manage/${this.url}userinfo/queryAllInfo.d`, this.qs.stringify({
                        deptName: this.bumenValue,
                        groupName: this.zuValue
                    })).then(result => {
                        if (result.success) {
                            this.CustomerInformation = result.data.userInfoModels;
                            this.setCurrent(this.CustomerInformation[0])
                            this.ind = 0
                            this.loading = false;
                        } else {
                            this.loading = false;
                            this.CustomerInformation = [];
                        }
                    })
                })
            },
            //查询组
            seleChangeZu: function () {
                return new Promise((reslove, reject) => {
                    this.axios.post(`manage/${this.url}userinfo/queryAllInfo.do`, this.qs.stringify({
                        deptName: this.bumenValue,
                        groupName: this.zuValue
                    })).then(result => {
                        if (result) {
                            reslove()
                            this.CustomerInformation = result.data.userInfoModels;
                            this.setCurrent(this.CustomerInformation[0])
                            this.ind = 0
                            this.loading = false;
                        } else {
                            this.loading = false;
                            this.CustomerInformation = [];
                        }
                    })
                })
            },
            seleChangeForm: function () {
                let url = this.url?"manage/nawaauserinfo/queryGroups.do":"manage/group/queryAll.do"
                return new Promise((reslove, reject) => {
                    this.axios.post(url, this.qs.stringify({
                        deptName: this.form.dept
                    })).then(result => {
                        if(result) {
                            this.optionsZu = []
                            let list = result.data.list
                            for (var i = 0; i < list.length; i++) {
                                var obj = {}
                                obj["value"] = list[i]
                                obj["label"] = list[i]
                                this.optionsZu.push(obj)
                            }
                            this.restaurantsZu = this.optionsZu
                            this.form.group = "";
                        }
                    })
                })
            },
            //编辑
            handleEdit(index, row) {
                this.dialogTitle = "编辑";
                this.yonghuming = true;
                this.dialogVisible = true;
                this.selected = index;
                this.form = JSON.parse(JSON.stringify(row));
            },
            //新增
            addinfo: function () {
                this.dialogTitle = "新增";
                this.yonghuming = false;
                this.form = {
                    account: '',
                    dept: "",
                    group: "",
                    mail: "",
                    password: null,
                    name: ''
                };
                this.dialogVisible = true;
            },
            //确认
            editSubmit: function (formName) {
                let _this = this
                if (this.form.account == "" ||
                    this.form.password == "" ||
                    this.form.name == "" ||
                    this.form.mail == "" ||
                    this.form.password == "") {
                    this.$message({
                        type: 'error',
                        message: "数据不完整!",
                        showClose: true
                    });
                    return false;
                }
                // var regularPassw = /^(?![^a-zA-Z0-9]+$)(?![^a-zA-Z/D]+$)(?![^0-9/D]+$).{8,18}$/;
                // if (regularPassw.test(this.form.password) == false) {
                // 	this.$message({
                // 		type: 'error',
                // 		message: "密码为8-18位字母数字组合!",
                // 		showClose: true
                // 	});
                // 	return false;
                // }
                if (this.dialogTitle === "新增") {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            return new Promise((reslove, reject) => {
                                this.axios.post(`manage/${this.url}userinfo/doAdd.do`, this.qs.stringify({
                                    account: this.form.account,
                                    password: this.form.password,
                                    name: this.form.name,
                                    dept: this.form.dept,
                                    group: this.form.group,
                                    mail: this.form.mail
                                })).then(result => {
                                    if (result) {
                                        this.CustomerInformation.push(this.form)
                                        this.$message({
                                            type: 'success',
                                            message: '添加成功!',
                                            showClose: true
                                        });
                                        this.getUserInfo()
                                    }
                                })
                            })
                            this.dialogVisible = false;
                        } else {
                            return false;
                        }
                    });
                } else {
                    return new Promise((reslove, reject) => {
                        this.axios.post(`manage/${this.url}userinfo/doUpdate.do`, this.qs.stringify({
                            account: this.form.account,
                            name: this.form.name,
                            dept: this.form.dept,
                            group: this.form.group,
                            mail: this.form.mail
                        })).then(result => {
                            if (result) {
                                Vue.set(this.CustomerInformation, this.selected, this.form);
                                this.$message({
                                    type: 'success',
                                    message: '修改成功',
                                    showClose: true
                                });
                                this.getUserInfo()
                            }
                        })
                    })
                    this.dialogVisible = false;
                }
            },
            handleDelete(index, row) {
                this.$confirm('此操作将删除用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return new Promise((reslove, reject) => {
                        this.axios.post(`manage/${this.url}userinfo/doDelete.do`, this.qs.stringify({
                            account: row.account
                        })).then(result => {
                            if (result) {
                                this.CustomerInformation.splice(index, 1);
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!',
                                    showClose: true
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '删除失败!',
                                    showClose: true
                                });
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
            handAssignPermissions: function (index, row) {
                return new Promise((reslove, reject) => {
                    this.axios.post('manage/role/queryRoles.do').then(result => {
                        if(result) {
                            let reles = result.data.roles
                            this.data1 = []
                            for (var i = 0; i < roles.length; i++) {
                                var obj = {}
                                obj['key'] = roles[i].id
                                obj['label'] = roles[i].name
                                this.data1.push(obj)
                            }
                            this.dialogAssignPermissions = true
                            reslove(row)
                        }
                    })
                }).then((row) => {
                    this.form = JSON.parse(JSON.stringify(row));
                    this.value1 = [];
                    this.catchArr = [];
                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/userinforole/queryUserInfoRole.do', this.qs.stringify({
                            userAccount: row.account
                        })).then(result => {
                            if (result) {
                                let userInfoRoles = result.data.userInfoRoles
                                if (userInfoRoles.length === 0) {
                                    this.value1 = userInfoRoles
                                    this.catchArr = userInfoRoles
                                } else {
                                    for (var i = 0; i < userInfoRoles.length; i++) {
                                        this.value1.push(userInfoRoles[i].roleId)
                                        this.catchArr.push(userInfoRoles[i].roleId)
                                    }
                                }
                            }
                        })
                    })
                })

            },
            roleChange: function () {
                if (this.value1.length > this.catchArr.length) {
                    var jsonObj = {
                        userAccount: this.form.account
                    }
                    jsonObj.roleid = this.form.id;
                    for (var i = 0; i < this.leftArr.length; i++) {
                        jsonObj["ids[" + i + "]"] = this.leftArr[i]
                    }

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/userinforole/assign.do', this.qs.stringify(jsonObj)).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    message: '分配权限成功!',
                                    showClose: true
                                });
                            }
                        })
                    })
                } else {
                    var jsonObj = {
                        userAccount: this.form.account
                    }
                    jsonObj.roleid = this.form.id;
                    for (var i = 0; i < this.rightArr.length; i++) {
                        jsonObj["ids[" + i + "]"] = this.rightArr[i]
                    }

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/userinforole/unassign.do', this.qs.stringify(jsonObj)).then(result => {
                             if (result) {
                                this.$message({
                                    type: 'success',
                                    message: '分配权限成功!',
                                    showClose: true
                                });
                            }
                        })
                    })
                }
                this.catchArr = this.value1
            },
            leftRoleChange: function (val) {
                this.leftArr = val;
            },
            rightRoleChange: function (val) {
                this.rightArr = val;
            },
            handUpdataPassword: function (index, row) {
                this.formPassword.account = row.account;
                this.dialogEditPassword = true;
            },
            editPassword: function () {
                // if (this.formPassword.password == "" || this.formPassword
                //   .checkPassword == "") {
                //   this.$message({
                //     type: 'error',
                //     showClose: true,
                //     message: '表单数据不完整'
                //   });
                //   return false;
                // }
                if (this.formPassword.newPassword != this.formPassword.checkPassword) {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: '输入的密码不一致'
                    });
                    return false;
                }

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/userinfo/doUpdatePassword.do', this.qs.stringify({
                        account: this.formPassword.account,
                        password: this.formPassword.newPassword
                    })).then(result => {
                        if (result) {
                            this.$message({
                                type: 'success',
                                message: '修改密码成功!',
                                showClose: true
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '修改失败!',
                                showClose: true
                            });
                        }
                    })
                })
                this.dialogEditPassword = false;
            },
            kehucellClick: function (row) {
                this.ind = this.CustomerInformation.indexOf(row);
            },
            passwordClose: function () {
                this.formPassword = {
                    account: "",
                    oldPassword: "",
                    newPassword: "",
                    checkPassword: ""
                }
            },
            ChildRights: function () {
                this.treeTitle = "分配子权限";
                this.seleShow = false;
                this.marketShow = true;
                this.seleShowArea = false;
                this.seleShowSub = false;
                this.form = JSON.parse(JSON.stringify(this.CustomerInformation[this.ind]));

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/inner/userProductPermission/query.do', this.qs.stringify({
                        userAccount: this.form.account
                    })).then(result => {
                        if (result) {
                            var checkArr = [];
                            let userProductPermissions = result.data.userProductPermissions
                            if (userProductPermissions.length === 0) {
                                this.checkKeys = [];
                            } else {
                                for (var i = 0; i < userProductPermissions.length; i++) {
                                    var str = userProductPermissions[i].exchange + "_" + userProductPermissions[i].product;
                                    checkArr.push(str)
                                    this.checkKeys = checkArr;
                                }
                            }
                        } else {
                            this.checkKeys = [];
                        }
                        this.$refs.tree.setCheckedKeys(this.checkKeys);
                    })
                })
                this.dialogChildren = true
            },
            profitLoss: function () {
                let _this = this
                this.treeTitle = "分配损益";
                this.seleShow = true;
                this.marketShow = true;
                this.seleShowArea = false;
                this.seleShowSub = false;
                this.form = JSON.parse(JSON.stringify(this.CustomerInformation[this.ind]));

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/inner/traderProduct/queryTraderProductByUserAccount.do', this.qs.stringify({
                        userAccount: this.form.account
                    })).then(result => {
                        if (result) {
                            let TraderProducts = result.data.TraderProducts
                            if (TraderProducts.length === 0) {
                                this.checkKeys = [];
                            } else {
                                var checkArr = [];
                                for (let i = 0; i < TraderProducts.length; i++) {
                                    var str = TraderProducts[i].exchange + "_" + TraderProducts[i].product;
                                    checkArr.push(str)
                                }
                                this.checkKeys = checkArr;
                            }
                        } else {
                            this.checkKeys = [];
                        }
                        this.marketArr = this.checkKeys
                        this.$refs.tree.setCheckedKeys(this.checkKeys);
                    })
                })
                this.dialogChildren = true
            },
            distributionArea: function () {
                let _this = this
                this.treeTitle = "分配辖区";
                this.seleShow = false;
                this.marketShow = false;
                this.seleShowArea = true;
                this.seleShowSub = false;
                this.form = JSON.parse(JSON.stringify(this.CustomerInformation[this.ind]));

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/userareapermission/query.do', this.qs.stringify({
                        userAccount: this.form.account
                    })).then(result => {
                        if (result) {
                            let userAreaPermissions = result.data.userAreaPermissions
                            if (userAreaPermissions.length === 0) {
                                this.checkKeys = [];
                            } else {
                                var checkArr = [];
                                for (let i = 0; i < userAreaPermissions.length; i++) {
                                    checkArr.push(userAreaPermissions[i].areaNo)
                                }
                                this.checkKeys = checkArr;
                            }
                        } else {
                            this.checkKeys = [];
                        }
                        // this.$refs.treeArea.setCheckedKeys(this.checkKeys);
                        this.areaArr = this.checkKeys
                    })
                })
                this.dialogChildren = true;
            },
            distributionSub: function () {
                this.treeTitle = "分配子账";
                this.seleShow = false;
                this.marketShow = false;
                this.seleShowArea = false;
                this.seleShowSub = true;
                this.form = JSON.parse(JSON.stringify(this.CustomerInformation[this.ind]));
                let _this = this

                return new Promise((reslove, reject) => {
                    this.axios.post('manage/usersubaccountpermission/query.do', this.qs.stringify({
                        userAccount: this.form.account
                    })).then(result => {
                        if (result) {
                            let userSubAccountPermissions = result.data.userSubAccountPermissions
                            if (userSubAccountPermissions.length === 0) {
                                this.checkKeys = [];
                            } else {
                                var checkArr = [];
                                for (var i = 0; i < userSubAccountPermissions.length; i++) {
                                    checkArr.push(userSubAccountPermissions[i].subAccountNo)
                                }
                                this.checkKeys = checkArr;
                            }
                        } else {
                            this.checkKeys = [];
                        }
                        // this.$refs.treeSub.setCheckedKeys(this.checkKeys);
                        this.subArr = this.checkKeys
                    })
                })

                this.dialogChildren = true;
            },
            handleCheckChange() {
                var keyArr = this.$refs.tree.getCheckedKeys()
                for (var i = 0; i < this.marketArr.length; i++) {
                    var index = keyArr.indexOf(this.marketArr[i]);
                    if (index > -1) {
                        keyArr.splice(index, 1)
                    }
                }
                this.keyArr = keyArr
            },
            handleCheckChangeArea: function () {
                // this.areaArr = this.$refs.treeArea.getCheckedKeys()
                if (this.arrs.length == this.areaArr.length) {
                    this.checkAll = true
                } else {
                    this.checkAll = false
                }
            },
            handleCheckChangeSub: function () {
                if (this.subs.length == this.subArr.length) {
                    this.checkSubAll = true
                } else {
                    this.checkSubAll = false
                }
            },
            handleCheckChangeMarke() {
                if (this.markes.length == this.marketArr.length) {
                    this.checkMarkeAll = true
                } else {
                    this.checkMarkeAll = false
                }
            },
            // handleCheckChangeSub: function () {
            //   this.subArr = this.$refs.treeSub.getCheckedKeys()
            // },
            editPermiss: function () {
                if (this.treeTitle === "分配子权限") {
                    var UserProductPermission = new Array();
                    for (var i = 0; i < this.keyArr.length; i++) {
                        UserProductPermission.push({
                            userAccount: this.form.account,
                            exchange: this.keyArr[i].split("_")[0],
                            product: this.keyArr[i].split("_")[1],
                            productType: '0'
                        });
                    }
                    var datas = {};
                    datas.userAccount = this.form.account;
                    datas.userProductPermissions = UserProductPermission;

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/inner/userProductPermission/doAdds.do', this.qs.stringify(datas)).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    message: '分配子权限成功!',
                                    showClose: true
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '分配失败!',
                                    showClose: true
                                })
                            }
                        })
                    })
                } else if (this.treeTitle === "分配损益") {
                    var TraderProduct = new Array();
                    for (var i = 0; i < this.keyArr.length; i++) {
                        TraderProduct.push({
                            userAccount: this.form.account,
                            subAccountNo: this.mainAccountId,
                            exchange: this.keyArr[i].split("_")[0],
                            product: this.keyArr[i].split("_")[1],
                            productType: '0'
                        });
                    }
                    var datas = {};
                    datas.userAccount = this.form.account;
                    datas.traderProducts = TraderProduct;

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/inner/traderProduct/doAdds.do', this.qs.stringify(datas)).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    message: '分配损益成功!',
                                    showClose: true
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '分配失败!',
                                    showClose: true
                                })
                            }
                        })
                    })
                } else if (this.treeTitle === "分配辖区") {
                    var UserAreaPermission = new Array();
                    let _this = this
                    for (var i = 0; i < this.areaArr.length; i++) {
                        UserAreaPermission.push({
                            userAccount: this.form.account,
                            areaNo: this.areaArr[i]
                        });
                    }
                    var datas = {};
                    datas.userAccount = this.form.account;
                    datas.userAreaPermissions = UserAreaPermission;

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/userareapermission/doAdds.do', this.qs.stringify(datas)).then(result => {
                            this.areaArr = []
                            redirect(result, this)
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    message: '分配辖区成功!',
                                    showClose: true
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '分配失败!',
                                    showClose: true
                                })
                            }
                        })
                    })
                } else {
                    if (this.subArr.length === 0) {
                        this.$message({
                            type: 'error',
                            message: "请至少选择一个子账",
                            showClose: true
                        });
                        return false;
                    }
                    var UserSubAccountPermission = new Array();
                    for (var i = 0; i < this.subArr.length; i++) {
                        UserSubAccountPermission.push({
                            userAccount: this.form.account,
                            subAccountNo: this.subArr[i]
                        });
                    }
                    var datas = {};
                    datas.userAccount = this.form.account;
                    datas.userSubAccountPermissions = UserSubAccountPermission;

                    return new Promise((reslove, reject) => {
                        this.axios.post('manage/usersubaccountpermission/doAdds.do', this.qs.stringify(datas)).then(result => {
                            if (result) {
                                this.$message({
                                    type: 'success',
                                    message: '分配子账成功!',
                                    showClose: true
                                })
                            } else {
                                 this.$message({
                                    type: 'error',
                                    message: '分配子账失败!',
                                    duration: 2000
                                })
                            }
                        })
                    })
                }
                this.dialogChildren = false;
            },
            // 反选
            invertAreaChange() {
                let selectArr = this.areaArr
                let allArr = [...this.arrs]
                for (let i = 0; i < allArr.length; i++) {
                    for (let j = 0; j < selectArr.length; j++) {
                        if (allArr[i] == selectArr[j]) {
                            allArr.splice(i, 1)
                            i--
                        }
                    }
                }
                this.areaArr = allArr
                if (this.areaArr.length == this.arrs.length && this.areaArr.length != 0) {
                    this.checkAll = true
                } else {
                    this.checkAll = false
                }
            },
            invertSubChange() {
                let selectArr = this.subArr
                let allArr = [...this.subs]
                for (let i = 0; i < allArr.length; i++) {
                    for (let j = 0; j < selectArr.length; j++) {
                        if (allArr[i] == selectArr[j]) {
                            allArr.splice(i, 1)
                            i--
                        }
                    }
                }
                this.subArr = allArr
                if (this.subArr.length == this.subs.length && this.subArr.length != 0) {
                    this.checkSubAll = true
                } else {
                    this.checkSubAll = false
                }
            },
            invertMarkeChange() {
                let currentArr = this.$refs.tree.getCheckedKeys()
                for (let i = 0; i < this.markess.length; i++) {
                    for (let j = 0; j < currentArr.length; j++) {
                        if (this.markess[i] == currentArr[j]) {
                            this.markess.splice(i, 1)
                            i--
                        }
                    }
                }
                this.$refs.tree.setCheckedKeys(this.markess)
            },
        },
        components: {
            fuzzyQuery,
            Page,
            dateField
        },
        watch: {
            heckAll(newValue, oldValue) {
                if (newValue) {
                    this.checkText = "取消全选"
                } else {
                    this.checkText = "全选"
                }
            },
            checkSubAll(newValue, oldValue) {
                if (newValue) {
                    this.checkText2 = "取消全选"
                } else {
                    this.checkText2 = "全选"
                }
            },
            checkMarkeAll(newValue, oldValue) {
                if (newValue) {
                    this.checkText3 = "取消全选"
                } else {
                    this.checkText3 = "全选"
                }
            }
        },
        computed: {
            url() {
                if (this.OA == 1) {
                    return ""
                } else if (this.OA == 2) {
                    return "nawaa"
                }
            },
            ...mapGetters(['Height']),

            search() {
                //搜索数据
                return this.CustomerInformation.filter(function (item) {
                    return item.name.indexOf(this.keyword) != -1 || this.keyword == ''
                }.bind(this))
            }
        }
    }
</script>

<style scoped lang="scss">
.top_search {
    margin-right: 6px;
    margin-left: 0 !important;
    float: left;
}

.btn_box {
    float: right;
}

.el-input__inner {
    width: 180px !important;
}
</style>