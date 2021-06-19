<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>提现管理</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">状态选择</span>
                    <el-select v-model="selectStatus" placeholder="状态选择" style="margin-right: 30px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px">用户ID</span>
                    <el-input placeholder="请输入用户ID" v-model="queryUserId" style="width:250px; margin-right: 30px"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="25">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <span class="demonstration" style="margin-right: 10px">查询范围</span>
                    <el-date-picker
                        :clearable="false"
                        v-model="querydate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="resetSearch()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card" shadow="never">
                    <el-table :data="tableData" style="width: 100%" border>
                        <el-table-column align="center" type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" class="demo-table-expand" label-width="auto">
                                    <el-row>
                                        <el-col :span="6">
                                            <el-form-item label="VerifyTime:" label-width="auto"><span>{{ props.row.VerifyTime }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="EndTime:" label-width="auto"><span>{{ props.row.EndTime }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="Mobile:" label-width="auto"><span>{{ props.row.Details.Mobile }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="ServerNotify:" label-width="auto"><span>{{ props.row.Details.ServerNotify }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-if="props.row.PayWay === 'Fun'">
                                        <el-col :span="6">
                                            <el-form-item label="BankCard:" label-width="auto"><span>{{ props.row.Details.BankCard }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="Ifsc:" label-width="auto"><span>{{ props.row.Details.Ifsc }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="PayAmount:" label-width="auto"><span>{{ props.row.Details.PayAmount }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="UserName:" label-width="auto"><span>{{ props.row.Details.UserName }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-else-if="props.row.PayWay === 'BMart'">
                                        <el-col :span="6">
                                            <el-form-item label="PayAccount:" label-width="auto"><span>{{ props.row.Details.PayAccount }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="AccountOwner:" label-width="auto"><span>{{ props.row.Details.AccountOwner }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="PayAmount:" label-width="auto"><span>{{ props.row.Details.PayAmount }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="BankCode:" label-width="auto"><span>{{ props.row.Details.BankCode }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row v-else-if="props.row.PayWay === 'SerPay'">
                                        <el-col :span="6">
                                            <el-form-item label="UpiId:" label-width="auto"><span>{{ props.row.Details.UpiId }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="UserName:" label-width="auto"><span>{{ props.row.Details.UserName }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-form-item label="PayAmount:" label-width="auto"><span>{{ props.row.Details.PayAmount }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6">
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column width="200" align="center" prop="CreateTime" label="CreateTime"></el-table-column>
                        <el-table-column width="300" align="center" prop="PayoutId" label="PayoutId"></el-table-column>
                        <!-- <el-table-column width="150" align="center" prop="UserId" label="UserId"></el-table-column> -->
                        <el-table-column width="150" align="center" prop="UserId" label="UserId" >
                            <template slot-scope="scope">
                                <el-popover
                                    placement="bottom"
                                    width="260"
                                    trigger="click">
                                    <el-button style="border:none; background-color:transparent;" slot="reference" @click="getDetail(scope.row.UserId)">{{scope.row.UserId}}</el-button>
                                    <div>
                                        <li v-for="(value, name) in detailData" :key="name" style="list-style:none">
                                            {{name}} : {{ value }}
                                        </li>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column width="150" align="center" prop="Amount" label="Amount"></el-table-column>
                        <el-table-column width="150" align="center" prop="RealAmount" label="RealAmount"></el-table-column>
                        <el-table-column width="350" align="center" prop="Email" label="Email"></el-table-column>
                        <el-table-column align="center" prop="Phone" label="Phone"></el-table-column>
                        <el-table-column width="100" align="center" prop="PayType" label="PayType"></el-table-column>
                        <el-table-column width="100" align="center" prop="PayWay" label="PayWay"></el-table-column>
                        <el-table-column width="150" align="center" label="PayoutStatus">
                            <template slot-scope="scope">
                                <span>{{ getPayoutStatusText(scope.row.PayoutStatus) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="userlevel > 2" width="185" align="center" fixed="right" label="操作">
                            <template slot-scope="scope">
                                <el-col v-if="scope.row.PayoutStatus == 1" >
                                    <el-button @click="notifyChangeStatus(scope.row.PayoutId, true)" type="danger" size="mini">同意</el-button>
                                    <el-button @click="notifyChangeStatus(scope.row.PayoutId, false)" type="primary" size="mini">拒绝</el-button>
                                </el-col>
                                <span v-else>不可操作</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px" shadow="never">
                    <el-pagination background 
                        @current-change="onChangePage" 
                        @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next"
                        :total="page_total"
                        :page-sizes="sizeData"
                        :page-size="pageSize"></el-pagination>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<style scoped>
    .el-form-item {
        width: 100% !important;
        text-align: left;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    import { getUser } from '@/utils/Cookies.js'
    export default {
        data () {
            return {
                querydate: '',
                tableData: [],
                options: [],
                selectStatus: '',
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                queryUserId: 0,
                userlevel: 0,
                detailData: {
                    'UserId': '',
                    '不可提(赠)': 0,
                    '不可提(充)': 0,
                    '可提(赠)': 0,
                    '可提(充)': 0,
                    'FB': 0,
                    'Phone':0,
                    '注册时间': 0,
                    '总充值': 0,
                    '总提现': 0
                }
            }
        },
        created() {
            this.options = [];
            this.options.push({ value: this.gd.All, label: this.gd.All });
            for (let i = 1; i < 12; i++) {
                const ele = this.getPayoutStatusText(i);
                this.options.push({ value: i, label: ele });
            }
            this.selectStatus = this.gd.All;

            const startdate = this.gt.getTodaySymbol();
            const enddate = this.gt.getTodaySymbol();
            this.querydate = [startdate, enddate];
        },
        mounted() {
            this.userlevel = JSON.parse(getUser()).level;
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
            this.resetSearch();
        },
        methods: {
            onChangePage(val) {
                this.page = val;
                this.search();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.search();
            },
            resetSearch() {
                this.page = 1;
                this.page_total = 1;
                this.tableData = [];
                if (this.queryUserId != 0 &&  this.queryUserId.length < 8) {
                    this.$message({ message: '请输入正确的用户ID' });
                        return;
                    }
                this.search();
            },
            search() {
                const startdate = this.gt.transferDate(this.querydate[0]);
                const enddate = this.gt.transferDate(this.querydate[1]);
                let params = { startdate, enddate, page: this.page, payout_status: this.selectStatus, userId: this.queryUserId, pageSize: this.pageSize };
                this.gt.httpPost('/withdraw_manage', params).then((response) => {
                    const result = response.data.result;
                    this.page = result.page;
                    this.page_total = result.page_total;
                    this.tableData = [];
                    for (let i = 0; i < result.tableData.length; i++) {
                        const item = result.tableData[i];
                        this.tableData.push(item);
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            notifyChangeStatus(payoutId, isAgree) {
                this.$confirm(`是否确定${isAgree ? "同意" : "拒绝"}此订单?`).then(() => {
                    let params = { payout_id: payoutId, isAgree };
                    this.gt.httpPost('/withdraw_manage_notify', params).then((response) => {
                        const msg = response.data.msg;
                        this.$message({ message: `操作${msg}` });
                        const data = this.tableData.find(item => {
                            return item.PayoutId === payoutId;
                        });
                        if (data) {
                            data.PayoutStatus = isAgree ? 2 : 3;
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                });
            },
            getPayoutStatusText(payoutStatus) {
                if (payoutStatus == 1) {
                    return '提现请求创建(1)';
                } else if (payoutStatus == 2) {
                    return '审核通过(2)';
                } else if (payoutStatus == 3) {
                    return '提现请求被拒绝(3)';
                } else if (payoutStatus == 4) {
                    return '平台审批中(4)';
                } else if (payoutStatus == 5) {
                    return '平台支付完成(5)';
                } else if (payoutStatus == 6) {
                    return '平台审核不通过(6)';
                } else if (payoutStatus == 7) {
                    return '平台审核通过(7)';
                } else if (payoutStatus == 8) {
                    return '平平台打款中(8)';
                } else if (payoutStatus == 9) {
                    return '平台打款失败(9)';
                } else if (payoutStatus == 10) {
                    return '提交平台失败(10)';
                } else if (payoutStatus == 11) {
                    return '订单异常(11)';
                }
                return payoutStatus;
            },
            getDetail(userId){
                const params = { userId: userId };
                this.gt.httpPost('get_user_detail', params).then((response) => {
                    const result = response.data.result;
                    console.log('result : ', result);
                    this.$set(this.detailData, 'UserId', result.UserId);
                    this.$set(this.detailData, '不可提(赠)', result.Gold);
                    this.$set(this.detailData, '不可提(充)', result.PayGold);
                    this.$set(this.detailData, '可提(赠)', result.WinGold);
                    this.$set(this.detailData, '可提(充)', result.PayWinGold);
                    this.$set(this.detailData, 'FB', result.FbId);
                    this.$set(this.detailData, 'Phone', result.Phone);
                    this.$set(this.detailData, '注册时间', result.RegTime);
                    this.$set(this.detailData, '总充值', result.TotalPayIn);
                    this.$set(this.detailData, '总提现', result.TotalPayOut);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
</script>