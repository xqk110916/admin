客户基本资料
<template>
  <div>
    <div class="search_bar">
      <fuzzyQuery search></fuzzyQuery>
      <div class="right">
        <el-button type="primary" size="mini" @click="addkehuinfo">添加客户</el-button>
        <el-button type="primary" size="mini" @click="editkehuinfo" :disabled="disabtn" title="点击修改">修改客户</el-button>
        <el-button type="primary" size="mini" :disabled="disabtn" @click="addkuozhaninfo">增加扩展信息</el-button>
        <el-button type="primary" size="mini" :disabled="kehudis" @click="editkuozhaninfo">修改扩展信息</el-button>
        <el-button type="primary" size="mini" @click="replaceFun"> 刷新 </el-button>
        <el-button type="primary" size="mini" :disabled="!totalPrice.length" @click="daochuInfo">客户资料导出</el-button>
        <!-- <el-button type="primary" size="mini" :disabled="disabtn" @click="daochuExtend">扩展信息导出</el-button> -->
        <el-button type="primary" size="mini" @click="daochuExtend">扩展信息导出</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table">
      <el-table :data="totalPrice" v-loading="loading" element-loading-text="拼命加载中" :height="Height"
        element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)"
        :highlight-current-row=true border @row-dblclick="dbclick" @cell-click="cellClick" style="width: 100%">
        <el-table-column fixed type="index" width="50"> </el-table-column>
        <el-table-column fixed :show-overflow-tooltip="true" label="客户编号">
          <template slot-scope="scope">
            <span> {{ clientNoFun(scope.row.clientType,scope.row.clientNo) }} </span>
          </template>
        </el-table-column>
        <el-table-column fixed :show-overflow-tooltip="true" label="客户类型">
          <template slot-scope="scope">
            <span> {{ clientType(scope.row.clientType) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="clientIdentityId" label="证件号码" width="120">
        </el-table-column>
        <el-table-column width="180" :show-overflow-tooltip="true" prop="clientName" label="客户名称">
        </el-table-column>
        <el-table-column width="100px" :show-overflow-tooltip="true" label="建档日期">
          <template slot-scope="scope">
            <span> {{ shijianchui(scope.row.filingDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="phoneNumber" label="客户电话"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="email" label="电子邮箱" width="170"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="faxNumber" label="传真号码"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="address" label="客户地址"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="介绍人所在部门">
          <template slot-scope="scope">
            <span> {{ areaNo(scope.row.areaNo) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="agent" label="介绍人"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="保证金类型">
          <template slot-scope="scope">
            <span> {{ marginType(scope.row.marginType) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="specialMarginRate" label="客户特殊保证金率%"
          :formatter="changespecialMarginRate">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="protocolNo" label="协议编号"> </el-table-column>
        <el-table-column width="150" :show-overflow-tooltip="true" label="企业类型">
          <template slot-scope="scope">
            <span> {{ enterpriseType(scope.row.enterpriseType) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="enterpriseCode" label="组织机构代码"> </el-table-column>
        <el-table-column width="150" :show-overflow-tooltip="true" prop="industryType" label="行业类型"
          :formatter="changeindustryType">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="interestRate" label="客户可用利息利率"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="账户类型">
          <template slot-scope="scope">
            <span> {{ accountType(scope.row.accountType) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="" label="行情绑定账号" width="120"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="" label="交易绑定账号" width="120"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="contacts" label="联系人"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="legalPerson" label="法人代表"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="legalPersonId" label="法人代表身份证" width="150">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="tradePassword" label="交易口令"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="description" label="客户描述信息"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="clientId" label="客户ID"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="客户等级">
          <template slot-scope="scope">
            <span> {{ clientLevel(scope.row.clientLevel) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="openAccountDate" label="首次开户日期" :formatter="openC">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="protoUpdateDate" label="协议更新日期" :formatter="updateC">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="protoVersion" label="协议版本" :formatter="ver">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="clientId" label="ID"> </el-table-column>
      </el-table>

      <el-table :data="clientOtherInfos" :fit=false border :highlight-current-row=true @cell-click="kehucellClick"
        style="width: 100%">
        <el-table-column type="index" fixed label="序号" width="50"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="contactName" label="联系人" width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="contactPhone" label="联系人电话" width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="authorizerName" label="授权人" width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="authorizerId" label="授权人证件" width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="authorizerPhone" label="授权人电话" width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="email" label="电子邮箱" width="120"> </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="bankAccountName" label="账户名" width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="bankAccount" label="银行账户" width="120">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="开户银行" width="120">
          <template slot-scope="scope">
            <span> {{ bankInfosfun(scope.row.bankNo) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="bankBranch" label="开户支行"> </el-table-column>
      </el-table>
    </div>
    <!-- page -->
    <Page :total="total" @update:page="changePage" @update:pagesize="changPageSize"></Page>
    <!-- dialog  -->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="dialogClose" width="80%"
        :before-close="beforeClose">
        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 客户类型: </el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.clientType" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 客户等级: </el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.clientLevel" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 客户编号: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.clientNo" placeholder="请输入内容" size="mini" :disabled=true></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 建档日期: </el-col>
          <el-col :span="4">
            <el-date-picker v-model="dialogdata.filingDate" size="mini" type="date" value-format="timestamp"
              placeholder="选择日期"> </el-date-picker>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 企业证号*: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.clientIdentityId" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 企业全名*: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.clientName" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 电话号码: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.phoneNumber" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 地址:</el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.address" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 传真号码:</el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.faxNumber" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 电子邮箱: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.email" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 业务员:</el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.agent" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 营业部:</el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.saleDepartmentNo" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in departmentInfos" :key="item.departmentNo" :label="item.departmentName"
                :value="item.departmentNo"> </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 联系人:</el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.contacts" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 辖区:</el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.areaNo" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in clientAreaInfos" :key="item.areaNo" :label="item.areaName" :value="item.areaNo">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 法人代表:</el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.legalPerson" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 法人身份证号: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.legalPersonId" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
        </el-row>

        <el-row class="qiye"
          style="border: 1px solid #ccc;padding: 10px;position: relative;margin-top: 15px;margin-bottom: 10px">
          <el-col :span="24"
            style="position: absolute;display: inline-block;width: 120px;top: -10px;left: 20px;background-color: #fff;">
            开通交易的交易所
          </el-col>
          <el-col :span="24">
            <el-checkbox-group v-model="dialogdata.isOpenAccount">
              <el-checkbox label="中国金融期货交易所"></el-checkbox>
              <el-checkbox label="郑州商品交易所" checked></el-checkbox>
              <el-checkbox label="大连商品交易所" checked></el-checkbox>
              <el-checkbox label="上海能源交易中心" checked></el-checkbox>
              <el-checkbox label="上海黄金交易所" checked></el-checkbox>
              <el-checkbox label="上海期货交易所" checked></el-checkbox>
              <el-checkbox label="上海证券交易所"></el-checkbox>
              <el-checkbox label="深圳证券交易所"></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="4" align="right" class="dialog-col-two"> 是否在易利权开户: </el-col>
          <el-col :span="4">
            <el-switch v-model="dialogdata.isOpenEasyOption" active-text="是" inactive-text="否"> </el-switch>
          </el-col>
          <el-col :span="4" align="right" class="dialog-col-two"> 是否可以交易: </el-col>
          <el-col :span="4">
            <el-switch v-model="dialogdata.tradeStatus" active-text="是" inactive-text="否"> </el-switch>
          </el-col>
          <el-col :span="4" align="right" class="dialog-col-two"> 开通境外产品资质: </el-col>
          <el-col :span="4">
            <el-switch v-model="dialogdata.isOpenOverSea" active-text="是" inactive-text="否"> </el-switch>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 保证金类型: </el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.marginType" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 保证金率%: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.specialMarginRate" placeholder="请输入内容" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 协议编号: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.protocolNo" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 行业类型: </el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.industryType" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 企业类型: </el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.enterpriseType" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 组织机构代码: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.enterpriseCode" placeholder="请输入内容" size="mini"></el-input>
          </el-col>

          <el-col :span="2" class="dialog-col-two" align="right"> 账户类型: </el-col>
          <el-col :span="4">
            <el-select v-model="dialogdata.accountType" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 可用利息利率: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.interestRate" placeholder="请输入内容" size="mini">
              <template slot="append">%</template>
            </el-input>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 行情绑定账号: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.quoteBindAccount" placeholder="请输入内容" size="mini"></el-input>
          </el-col>

          <el-col :span="2" class="dialog-col-two" align="right"> 交易绑定账号: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.tradeBindAccount" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 交易口令: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.tradePassword" placeholder="请输入内容" size="mini"></el-input>
          </el-col>

          <el-col :span="2" class="dialog-col-two" align="right"> 客户描述信息: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.description" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="2" class="dialog-col-two" align="right"> 资金密码: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.fundPassword" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 客户管理人: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.productManager" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="2" class="dialog-col-two" align="right"> 客户委托人: </el-col>
          <el-col :span="4">
            <el-input v-model="dialogdata.productOrder" placeholder="请输入内容" size="mini"></el-input>
          </el-col>

        </el-row>
        <el-row class="dialog-row">
          <el-col :span="4" class="dialog-col-two" :offset="2"> 首次开户日期：</el-col>
          <el-col :span="4">
            <el-date-picker v-model="openAccountDate" type="date" size="small" placeholder="选择首次开户日期"
              @change="openDate">
            </el-date-picker>
          </el-col>
          <el-col :span="4" class="dialog-col-two" :offset="2"> 协议更新日期：</el-col>
          <el-col :span="4">
            <el-date-picker v-model="protoUpdateDate" type="date" size="small" placeholder="选择协议更新日期"
              @change="updateChange">
            </el-date-picker>
          </el-col>
          <el-col :span="4" class="dialog-col-two" :offset="2"> 协议版本:</el-col>
          <el-col :span="4">
            <el-select v-model="agreement" placeholder="请选择">
              <el-option v-for="item in agreementOptions" :key="item.value" :label="item.label" :value="item.value"
                @change="agreementChange">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button @click="beforeClose">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title=kuozhanDialogTitle :visible.sync="dialogKuozhan" width="50%">
        <el-row class="dialog-row">
          <el-col :span="3" class="dialog-col-two" align="right"> 联系人：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.contactName" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="3" class="dialog-col-two" align="right" :offset="2"> 联系人电话：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.contactPhone" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="3" class="dialog-col-two" align="right"> 授权人：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.authorizerName" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="3" class="dialog-col-two" align="right" :offset="2"> 授权人电话：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.authorizerPhone" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="3" class="dialog-col-two" align="right"> 授权人证件：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.authorizerId" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="3" class="dialog-col-two" align="right" :offset="2"> 电子邮箱：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.email" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="3" class="dialog-col-two" align="right"> 账户名：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.bankAccountName" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
          <el-col :span="3" class="dialog-col-two" align="right" :offset="2"> 银行账户：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.bankAccount" placeholder="请输入内容" size="mini"></el-input>
          </el-col>
        </el-row>

        <el-row class="dialog-row">
          <el-col :span="3" class="dialog-col-two" align="right"> 开户银行：</el-col>
          <el-col :span="8">
            <el-select v-model="kuozhanDialogData.bankNo" placeholder="请选择" size="mini" width="100px">
              <el-option v-for="item in bankInfos" :key="item.bankNo" :label="item.bankName" :value="item.bankNo">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="dialog-col-two" align="right" :offset="2"> 开户支行：</el-col>
          <el-col :span="8">
            <el-input v-model="kuozhanDialogData.bankBranch" placeholder="请输入内容" size="mini"></el-input>
          </el-col>

        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogKuozhan = false">取 消</el-button>
          <el-button type="primary" @click="dialogkuozhanbtn">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import fuzzyQuery from '@/components/fuzzyQuery'
  import Page from '@/components/page'
  export default {
    name: 'clientDetails',
    data() {
      return {
        NoOptions: [],
        clientId: '',

        firstDate: '',
        agreementOptions: [{
          label: "SAC2014",
          value: 1
        }, {
          label: "SAC2015",
          value: 2
        }, {
          label: "ISDA",
          value: 3
        }, {
          label: "NAFMII",
          value: 4
        }, {
          label: "OTHER",
          value: 5
        }],
        agreement: '',
        openAccountDate: '',
        protoUpdateDate: '',
        permissionShow: false,
        totalPriceInd: 0,
        disabtn: true,
        kehudis: true,
        selec: 0,
        dialogTitle: "",
        kuozhanDialogTitle: "",
        dialogVisible: false,
        dialogKuozhan: false,
        options: [],
        options1: [],
        departmentInfos: [],
        clientAreaInfos: [],
        bankInfos: [],
        options4: [],
        options5: [],
        options6: [],
        options7: [],
        dialogdata: {
          accountType: "",
          address: "",
          agent: "",
          areaNo: "",
          clientId: "",
          clientIdentityId: "",
          clientLevel: "",
          clientName: "",
          clientNo: "",
          clientType: "",
          contacts: "",
          description: "",
          email: "",
          enterpriseCode: "",
          enterpriseType: "",
          faxNumber: "",
          filingDate: "",
          fundPassword: "",
          industryType: "",
          interestRate: "",
          isOpenAccount: [],
          isOpenEasyOption: false,
          isOpenOverSea: false,
          legalPerson: "",
          legalPersonId: "",
          marginType: "",
          otherNextNo: "",
          phoneNumber: "",
          productManager: "",
          productOrder: "",
          protocolNo: "",
          quoteBindAccount: "",
          saleDepartmentNo: "",
          specialMarginRate: "",
          tradeBindAccount: "",
          tradePassword: "",
          tradeStatus: true
        },
        ind: "",
        clientOtherInfos: [],
        kuozhanDialogData: {
          authorizerId: "",
          authorizerName: "",
          authorizerPhone: "",
          bankAccount: "",
          bankAccountName: "",
          bankBranch: "",
          bankNo: "",
          clientNo: "",
          clientOtherNo: "",
          clientType: "",
          contactName: "",
          contactPhone: "",
          email: "",
          openAccountDate: '',
          protoUpdateDate: '',
          protoVersion: '',
        },
        cellClickIndex: "",
        kuozhenIndex: "",
        clientInfos: [],
        loading: '',

        clientNo: '',
        clientTypes: '',

        // 页码
        page: 1,
        total: 20,
        pageSize: 20,
      }
    },
    created() {
      this.query()
      this.getInfo()
    },
    methods: {
      setDefault() {
        this.options = this.g.letDate.options;
        this.dialogdata.clientType = this.options[0].value
        this.options1 = this.g.letDate.options1;
        this.options4 = this.g.letDate.options4;
        this.dialogdata.marginType = this.options4[0].value
        this.options5 = this.g.letDate.options5;
        this.dialogdata.industryType = this.options5[0].value
        this.options6 = this.g.letDate.options6;
        this.dialogdata.enterpriseType = this.options6[0].value
        this.options7 = this.g.letDate.options7;
        this.dialogdata.accountType = this.options7[0].value
        this.dialogdata.specialMarginRate = 2
        this.agreement = this.agreementOptions[0].value
      },
      daochuInfo() {
        window.open(`${ajaxurl}manage/inner/excel/exportClientBaseInfo.do`)
      },
      daochuExtend() {
        window.open(
          // `${ajaxurl}manage/inner/excel/exportRepairClientOtherInfos.do?clientNo=${this.clientNo}&clientType=${this.clientTypes}`
          `${ajaxurl}manage/inner/excel/exportRepairClientOtherInfos.do`
        )
      },
      queryClient() {
        if (!this.clientId) {
          this.query()
          return
        }

        return new Promise((reslove, reject) => {
          this.axios.post('manage/clientinfo/query.do', this.qs.stringify({
            clientId: this.clientId
          })).then(result => {
            if (result) {
              this.clientInfos = [result.data.clientInfo]
              this.clientOtherInfos = []
              this.pageno = 1
              this.total = 1
            }
          })
        })
      },
      getNow() {
        let nows = Date.now()
        this.kuozhanDialogData.protoUpdateDate = new Date(nows)
        this.protoUpdateDate = nows
        this.kuozhanDialogData.openAccountDate = new Date(nows)
        this.openAccountDate = nows
        this.dialogdata.filingDate = nows
      },
      openC(obj) {
        return this.timeyyM(obj.openAccountDate)
      },
      updateC(obj) {
        return this.timeyyM(obj.protoUpdateDate)
      },
      timeyyM(str) {
        let time = new Date(str);
        let y = time.getFullYear().toString();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        m = m.toString().padStart(2, "0")
        d = d.toString().padStart(2, "0")
        let sj = y + '-' + m + '-' + d;
        return sj
      },
      agreementChange(val) {
        this.kuozhanDialogData.protoVersion = val
      },
      openDate(val) {
        this.kuozhanDialogData.openAccountDate = new Date(this.openAccountDate)
      },
      updateChange(val) {
        this.kuozhanDialogData.protoUpdateDate = new Date(this.protoUpdateDate)
      },
      query() {
        //获取客户信息
        return new Promise((reslove, reject) => {
          this.axios.post('manage/clientinfo/queryPage.do', this.qs.stringify({
            pageno: this.page,
            pagesize: this.pageSize
          })).then(result => {
            if (result) {
              this.clientInfos = result.data.page.obj;
              this.total = result.data.page.totalsize
            } else {
              this.permissionShow = true
            }
          })
        })
        //获取分部信息
        return new Promise((reslove, reject) => {
          this.axios.post('manage/departmentinfo/queryAll.do').then(result => {
            if (result) {
              this.departmentInfos = result.data.departmentInfos;
              this.dialogdata.saleDepartmentNo = this.departmentInfos[0].departmentNo
            }
          })
        })
        //获取辖区信息

        return new Promise((reslove, reject) => {
          this.axios.post("manage/clientarea/queryAll.do").then(result => {
            if (result) {
              this.clientAreaInfos = result.data.clientAreaInfos;
              this.dialogdata.areaNo = this.clientAreaInfos[0].areaNo
            }
          })
        })
        //获取银行信息

        return new Promise((reslove, reject) => {
          this.axios.post("manage/bankinfo/queryAll.do").then(result => {
            if (result) {
              this.bankInfos = result.data.bankInfos
            }
          })
        })
      },
      replaceFun () {
        this.query()
        this.clientOtherInfos = []
      },
      clientNoFun: function (e, s) {
        var cType = String.fromCharCode(e);
        var cNum;
        if (s < 10) {
          cNum = "000" + s.toString();
        } else if (s < 100) {
          cNum = "00" + s.toString();
        } else if (s < 1000) {
          cNum = "0" + s.toString();
        } else {
          cNum = s.toString();
        }
        return cType + cNum
      },
      shijianchui: function (e) {
        var date = new Date(e);
        Y = date.getFullYear().toString();
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1)
          .toString();
        D = date.getDate() < 10 ? '0' + (date.getDate()).toString() : date.getDate().toString();
        var NewDate = Y + M + D;
        return NewDate
      },
      clientType: function (e) {
        for (var j = 0; j < this.options.length; j++) {
          if (e == this.options[j].value) {
            e = this.options[j].label;
          }
        }
        return e
      },
      clientLevel: function (e) {
        for (var j = 0; j < this.options1.length; j++) {
          if (e == this.options1[j].value) {
            e = this.options1[j].label;
          }
        }
        return e
      },
      marginType: function (e) {
        for (var j = 0; j < this.options4.length; j++) {
          if (e == this.options4[j].value) {
            e = this.options4[j].label;
          }
        }
        return e
      },
      enterpriseType: function (e) {
        for (var j = 0; j < this.options6.length; j++) {
          if (e == this.options6[j].value) {
            e = this.options6[j].label;
          }
        }
        return e
      },
      accountType: function (e) {
        for (var j = 0; j < this.options7.length; j++) {
          if (e == this.options7[j].value) {
            e = this.options7[j].label;
          }
        }
        return e
      },
      areaNo: function (e) {
        for (var j = 0; j < this.departmentInfos.length; j++) {
          if (e == this.departmentInfos[j].departmentNo) {
            e = this.departmentInfos[j].departmentName;
          }
        }
        return e
      },
      bankInfosfun: function (e) {
        for (var j = 0; j < this.bankInfos.length; j++) {
          if (e == this.bankInfos[j].bankNo) {
            e = this.bankInfos[j].bankName;
          }
        }
        return e
      },
      changespecialMarginRate(obj) {
        return (obj.specialMarginRate * 100).toFixed(2)
      },
      dbclick: function (row) {

      },
      resetdate: function () {
        this.dialogdata = {
          accountType: this.options7[0].value,
          address: "",
          agent: "",
          areaNo: this.clientAreaInfos[0].areaNo,
          clientId: "",
          clientIdentityId: "",
          clientLevel: this.options1[0].value,
          clientName: "",
          clientNo: "",
          clientType: this.options[0].value,
          contacts: "",
          description: "",
          email: "",
          enterpriseCode: "",
          enterpriseType: this.options6[0].value,
          faxNumber: "",
          filingDate: "",
          fundPassword: "",
          industryType: this.options5[0].value,
          interestRate: "",
          isOpenAccount: [],
          isOpenEasyOption: false,
          isOpenOverSea: false,
          legalPerson: "",
          legalPersonId: "",
          marginType: this.options4[0].value,
          otherNextNo: "",
          phoneNumber: "",
          productManager: "",
          productOrder: "",
          protocolNo: "",
          quoteBindAccount: "",
          saleDepartmentNo: this.departmentInfos[0].departmentNo,
          specialMarginRate: 2,
          tradeBindAccount: "",
          tradePassword: "",
          tradeStatus: true,
          openAccountDate: '',
          protoUpdateDate: '',
          protoVersion: '',
        }
        // this.dialogdata.clientType = this.options[0].value
        // this.dialogdata.marginType = this.options4[0].value
        // this.dialogdata.industryType = this.options5[0].value
        // this.dialogdata.enterpriseType = this.options6[0].value
        // this.dialogdata.accountType = this.options7[0].value
        // this.dialogdata.specialMarginRate = 2
      },
      addkehuinfo: function () {
        this.resetdate();
        this.getNow()
        this.dialogTitle = "增加客户信息";
        this.dialogVisible = true;
      },
      editkehuinfo: function () {
        this.dialogTitle = "修改客户信息";
        this.dialogdata = (JSON.parse(JSON.stringify(this.clientInfos[this.totalPriceInd])));

        this.dialogVisible = true;
      },
      editSubmit: function () {

        if (this.dialogdata.isOpenEasyOption == true) {
          this.dialogdata.isOpenEasyOption = 1;
        } else {
          this.dialogdata.isOpenEasyOption = 0;
        }

        if (this.dialogdata.isOpenOverSea == true) {
          this.dialogdata.isOpenOverSea = 1;
        } else {
          this.dialogdata.isOpenOverSea = 0;
        }

        if (this.dialogdata.tradeStatus == true) {
          this.dialogdata.tradeStatus = 1;
        } else {
          this.dialogdata.tradeStatus = 0;
        }

        for (var j = 0; j < this.dialogdata.isOpenAccount.length; j++) {
          switch (this.dialogdata.isOpenAccount[j]) {
            case "中国金融期货交易所":
              this.dialogdata.isOpenAccount[j] = 1;
              break;
            case "郑州商品交易所":
              this.dialogdata.isOpenAccount[j] = 2;
              break;
            case "大连商品交易所":
              this.dialogdata.isOpenAccount[j] = 4;
              break;
            case "上海能源交易中心":
              this.dialogdata.isOpenAccount[j] = 8;
              break;
            case "上海黄金交易所":
              this.dialogdata.isOpenAccount[j] = 16;
              break;
            case "上海期货交易所":
              this.dialogdata.isOpenAccount[j] = 32;
              break;
            case "上海证券交易所":
              this.dialogdata.isOpenAccount[j] = 64;
              break;
            case "深圳证券交易所":
              this.dialogdata.isOpenAccount[j] = 128;
              break;
            default:

          }
        }
        var NewfilingDate = new Date(this.dialogdata.filingDate);
        var s = 0;
        for (var i = this.dialogdata.isOpenAccount.length - 1; i >= 0; i--) {
          s += this.dialogdata.isOpenAccount[i];
        }
        this.dialogdata.isOpenAccount = s;
        if (this.dialogTitle === "修改客户信息") {
          return new Promise((reslove, reject) => {
            this.axios.post('manage/clientinfo/doUpdate.do', this.qs.stringify({
              accountType: this.dialogdata.accountType,
                address: this.dialogdata.address,
                agent: this.dialogdata.agent,
                areaNo: this.dialogdata.areaNo,
                clientId: this.dialogdata.clientId,
                clientNo: this.dialogdata.clientNo,
                clientIdentityId: this.dialogdata.clientIdentityId,
                clientLevel: this.dialogdata.clientLevel,
                clientName: this.dialogdata.clientName,
                clientType: this.dialogdata.clientType,
                contacts: this.dialogdata.contacts,
                description: this.dialogdata.description,
                email: this.dialogdata.email,
                enterpriseCode: this.dialogdata.enterpriseCode,
                enterpriseType: this.dialogdata.enterpriseType,
                faxNumber: this.dialogdata.faxNumber,
                filingDate: NewfilingDate,
                fundPassword: this.dialogdata.fundPassword,
                industryType: this.dialogdata.industryType,
                interestRate: this.dialogdata.interestRate,
                isOpenAccount: this.dialogdata.isOpenAccount,
                isOpenEasyOption: this.dialogdata.isOpenEasyOption,
                isOpenOverSea: this.dialogdata.isOpenOverSea,
                legalPerson: this.dialogdata.legalPerson,
                legalPersonId: this.dialogdata.legalPersonId,
                marginType: this.dialogdata.marginType,
                otherNextNo: 3,
                phoneNumber: this.dialogdata.phoneNumber,
                productManager: this.dialogdata.productManager,
                productOrder: this.dialogdata.productOrder,
                protocolNo: this.dialogdata.protocolNo,
                quoteBindAccount: this.dialogdata.quoteBindAccount,
                saleDepartmentNo: this.dialogdata.saleDepartmentNo,
                specialMarginRate: this.dialogdata.specialMarginRate,
                tradeBindAccount: this.dialogdata.tradeBindAccount,
                tradePassword: this.dialogdata.tradePassword,
                tradeStatus: this.dialogdata.tradeStatus,
                openAccountDate: new Date(this.dialogdata.openAccountDate),
                protoUpdateDate: new Date(this.dialogdata.protoUpdateDate),
                protoVersion: this.agreement,
            })).then(result => {
              if (result) {
                this.$message({
                    type: "success",
                    message: "修改客户成功",
                    showClose: true
                  })
                  this.queryClient()
              }
            })
          })

        } else {
          if (this.dialogdata.clientIdentityId == '') {
            this.$message({
              message: "企业证号不能为空",
              type: "warning",
              showClose: true
            })
            return
          }

          if (this.dialogdata.clientName == '') {
            this.$message({
              message: "企业全名不能为空",
              type: "warning",
              showClose: true
            })
            return
          }


          return new Promise((reslove, reject) => {
            this.axios.post("manage/clientinfo/doAdd.do", this.qs.stringify({
              accountType: this.dialogdata.accountType,
              address: this.dialogdata.address,
              agent: this.dialogdata.agent,
              areaNo: this.dialogdata.areaNo,
              clientIdentityId: this.dialogdata.clientIdentityId,
              clientLevel: this.dialogdata.clientLevel,
              clientName: this.dialogdata.clientName,
              clientType: this.dialogdata.clientType,
              contacts: this.dialogdata.contacts,
              description: this.dialogdata.description,
              email: this.dialogdata.email,
              enterpriseCode: this.dialogdata.enterpriseCode,
              enterpriseType: this.dialogdata.enterpriseType,
              faxNumber: this.dialogdata.faxNumber,
              filingDate: NewfilingDate,
              fundPassword: this.dialogdata.fundPassword,
              industryType: this.dialogdata.industryType,
              interestRate: this.dialogdata.interestRate,
              isOpenAccount: this.dialogdata.isOpenAccount,
              isOpenEasyOption: this.dialogdata.isOpenEasyOption,
              isOpenOverSea: this.dialogdata.isOpenOverSea,
              legalPerson: this.dialogdata.legalPerson,
              legalPersonId: this.dialogdata.legalPersonId,
              marginType: this.dialogdata.marginType,
              otherNextNo: 3,
              phoneNumber: this.dialogdata.phoneNumber,
              productManager: this.dialogdata.productManager,
              productOrder: this.dialogdata.productOrder,
              protocolNo: this.dialogdata.protocolNo,
              quoteBindAccount: this.dialogdata.quoteBindAccount,
              saleDepartmentNo: this.dialogdata.saleDepartmentNo,
              specialMarginRate: this.dialogdata.specialMarginRate,
              tradeBindAccount: this.dialogdata.tradeBindAccount,
              tradePassword: this.dialogdata.tradePassword,
              tradeStatus: this.dialogdata.tradeStatus,
              openAccountDate: new Date(this.openAccountDate),
              protoUpdateDate: new Date(this.protoUpdateDate),
              protoVersion: this.agreement,
            })).then(result => {
              if (result) {
                 this.$message({
                  type: "success",
                  message: "添加成功",
                  showClose: true
                })
                this.queryClient()
              }
            })
          })
        }
        this.dialogVisible = false;
        this.disabtn = true;
      },
      cellClick: function (row) {
        this.disabtn = false;
        this.kehudis = true;
        //this.dialogdata = (JSON.parse( JSON.stringify(row) ));

        this.totalPriceInd = this.totalPrice.indexOf(row);
        this.clientNo = row.clientNo
        this.clientTypes = row.clientType

        return new Promise((reslove, reject) => {
          this.axios.post("manage/clientotherinfo/queryAllByClientNoAndClientType.do", this.qs.stringify({
            clientNo: row.clientNo,
            clientType: row.clientType
          })).then(result => {
            if (result) {
              this.clientOtherInfos = result.data.clientOtherInfos
            } else {
               this.clientOtherInfos = []
            }
          })
        })
      },
      dialogClose: function () {
        //this.disabtn = true;
        this.kehudis = true;
      },
      kehucellClick: function (row) {
        this.kehudis = false;
        this.kuozhanDialogData = (JSON.parse(JSON.stringify(row)));
        this.kuozhenIndex = this.clientOtherInfos.indexOf(row);
      },
      addkuozhaninfo: function () {
        this.kuozhanDialogTitle = "增加扩展信息";
        this.kuozhanDialogData = {
          authorizerId: "",
          authorizerName: "",
          authorizerPhone: "",
          bankAccount: "",
          bankAccountName: "",
          bankBranch: "",
          bankNo: "",
          clientNo: "",
          clientOtherNo: "",
          clientType: "",
          contactName: "",
          contactPhone: "",
          email: ""
        };
        this.dialogKuozhan = true;
      },
      editkuozhaninfo: function () {
        this.kuozhanDialogTitle = "修改扩展信息"
        this.dialogKuozhan = true;
      },
      dialogkuozhanbtn: function () {
        this.dialogKuozhan = false;
        this.dialogdata = (JSON.parse(JSON.stringify(this.clientInfos[this.totalPriceInd])));
        if (this.kuozhanDialogTitle === "增加扩展信息") {
          this.kuozhanDialogData.clientNo = this.dialogdata.clientNo;
          this.kuozhanDialogData.clientType = this.dialogdata.clientType;

          return new Promise((reslove, reject) => {
            this.axios.post("manage/clientotherinfo/doAdd.do", this.qs.stringify(this.kuozhanDialogData)).then(result => {
              if (result) {
                this.clientOtherInfos.push(this.kuozhanDialogData)
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                  showClose: true
                });
              }
            })
          })
          //this.tableData[this.cellClickIndex].kuozhandata.push(this.kuozhanDialogData);
        } else {

          return new Promise((reslove, reject) => {
            this.axios.post("manage/clientotherinfo/doUpdate.do", this.qs.stringify(this.kuozhanDialogData)).then(result => {
              if (result) {
                // Vue.set(this.clientOtherInfos, this.kuozhenIndex, this.kuozhanDialogData);
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                  showClose: true
                });
                this.queryClient()
              }
            })
          })
        }
        this.kehudis = true;
      },
      beforeClose(done) {
        this.$confirm('此操作将清空已输入信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = false
        }, () => {

        })
      },
      // 表格数据处理
      ver(obj) {
        let s = obj.protoVersion
        if (s == 1) {
          return 'SAC2014'
        }
        if (s == 2) {
          return 'SAC2015'
        }
        if (s == 3) {
          return 'ISDA'
        }
        if (s == 4) {
          return 'NAFMII'
        }
        if (s == 5) {
          return 'OTHER'
        }
      },
      changeindustryType(obj) {
        return letDate.options5[obj.industryType].label
      },
      // 分页器的事件处理函数
      changePage (val) {
        this.page = val
      },
      changePageSize (val) {
        this.pageSize = val
      },
    },
    components: {
      fuzzyQuery
    },
    computed: {
      ...mapGetters(['Height'])
    }
  }
</script>

<style scoped>
  .table {
    display: flex;
  }
</style>