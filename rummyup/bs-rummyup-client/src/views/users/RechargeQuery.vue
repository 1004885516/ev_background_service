<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>充值查询</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">用户ID</span>
                    <el-input placeholder="请输入用户ID" v-model="queryUserId" style="width:200px; margin-right: 30px"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="8">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <span class="demonstration" style="margin-right: 10px">订单状态</span>
                    <el-select v-model="orderStatus" placeholder="订单状态" style="margin-right: 50px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px">金额</span>
                    <el-select v-model="amountType" placeholder="金额" style="margin-right: 50px">
                        <el-option v-for="item in amountOptions" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px">选择查询日期范围</span>
                    <el-date-picker
                        :clearable="false"
                        v-model="querydate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width: 375px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click.native="resetSearch()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-card class="box-card" style="width: 100%" shadow="never">
                <el-row>
                    <el-col :span="3" style="text-align: right"><span>订单数(总) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ order_count }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>订单数(完成) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ order_finish }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>订单数(创建) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ order_create }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>订单数(异常) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ order_error }}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3" style="text-align: right"><span>新用户订单数(总) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ new_order_count }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>新用户订单数(完成) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ new_order_finish }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>新用户订单数(创建) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ new_order_create }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>新用户订单数(异常) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ new_order_error }}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3" style="text-align: right"><span>老用户订单数(总) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ old_order_count }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>老用户订单数(完成) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ old_order_finish }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>老用户订单数(创建) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ old_order_create }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>老用户订单数(异常) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ old_order_error }}</span></el-col>
                </el-row>
            </el-card>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-card class="box-card" style="width: 100%" shadow="never">
                <el-row>
                    <el-col :span="3" style="text-align: right"><span>充值人数(总) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ recharge_user_count }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值人数(新,首) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ recharge_user_new_first }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值人数(新,复) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ recharge_user_new_plural }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值人数(老,首) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ recharge_users_old }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值人数(老,复) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ recharge_users_rep }}</span></el-col>
                </el-row>
                <el-row>
                    <el-col :span="3" style="text-align: right"><span>充值金额(总) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ amount }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值金额(新,首) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ first_amount_new }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值金额(新,复) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ plural_amount_new }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值金额(老,首) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ recharge_count_old }}</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>充值金额(老,复) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ recharge_count_rep }}</span></el-col>
                </el-row>
            </el-card>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-card class="box-card" style="width: 100%" shadow="never">
                <el-row>
                    <el-col :span="3" style="text-align: right"><span>新用户成功率 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ new_success_rate }}%</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>老用户成功率 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ old_success_rate }}%</span></el-col>
                    <el-col :span="3" style="text-align: right"><span>成功率 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ success_rate }}%</span></el-col>
                    <el-col :span="3" style="text-align: right"><span> </span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{  }}</span></el-col>
                </el-row>
            </el-card>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-table :data="tableData" style="100%" border>
                <el-table-column width="50" align="center" prop="Serial" label="序号"></el-table-column>
                <el-table-column width="150" align="center" prop="UserId" label="用户ID" >
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
                <el-table-column width="250" align="center" prop="CreateTime" label="创建时间"></el-table-column>
                <el-table-column width="250" align="center" prop="EndTime" label="完成时间"></el-table-column>
                <el-table-column width="300" align="center" prop="Txnid" label="订单ID"></el-table-column>
                <el-table-column width="100" align="center" prop="ProductId" label="商品ID"></el-table-column>
                <el-table-column width="100" align="center" prop="Amount" label="付款金额"></el-table-column>
                <el-table-column width="250" align="center" prop="FirstName" label="名字"></el-table-column>
                <el-table-column width="320" align="center" prop="Email" label="邮箱"></el-table-column>
                <el-table-column width="150" align="center" prop="Phone" label="电话"></el-table-column>
                <el-table-column width="150" align="center" prop="Balance" label="当前余额"></el-table-column>
                <el-table-column width="100" align="center" prop="OrderStatus" label="状态"></el-table-column>
                <el-table-column width="100" align="center" prop="PayWay" label="渠道"></el-table-column>
                
                <el-table-column v-if="userlevel > 2" width="185" align="center" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-col v-if="scope.row.OrderStatus === 3" >
                            <el-button @click="notifyChangeStatus(scope.row.UserId, scope.row.Txnid, 1)" type="danger" size="mini">同意</el-button>
                            <el-button @click="notifyChangeStatus(scope.row.UserId, scope.row.Txnid, 0)" type="primary" size="mini">拒绝</el-button>
                        </el-col>
                        <span v-else>不可操作</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-col :span="24" style="margin-right: 0px">
                <el-card class="box-card" style="margin-top: 20px; margin-right: 0px;" shadow="never">
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

<script>
    import EventBus from '@/utils/EventBus.js'
    import { getUser } from '@/utils/Cookies.js'
    export default {
        data () {
            return {
                isWidth: false,
                col_width: 150,
                request_url: '/recharge_query',
                request_option_url: '/amount_option',
                querydate: '',
                queryUserId: 0,
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                rechargeInfo: {},
                tableData: [],
                options: [
                    { value: '0', label: '已创建' },
                    { value: '1', label: '已完成' },
                    { value: '2', label: '订单异常' },
                    { value: '3', label: '待确认' },
                    { value: '4', label: '全部' },
                ],
                orderStatus: '1',
                amountOptions: [
                     { value: '0', label: 'ALL' },
                ],
                amountLit: [],
                amountType: 'ALL',
                recharge_user_count: 0,
                recharge_user_new_first: 0,
                recharge_user_new_plural: 0,
                recharge_users_old: 0, // 充值人数(老,首)
                recharge_count_old: 0, // 充值金额(老,首)
                recharge_users_rep: 0, // 充值人数(老,复)
                recharge_count_rep: 0, // 充值金额(老,复)
                order_count: 0,
                order_finish: 0,
                order_create: 0,
                order_error: 0,

                new_order_count: 0,
                new_order_finish: 0,
                new_order_create: 0,
                new_order_error: 0,
                old_order_count: 0,
                old_order_finish: 0,
                old_order_create: 0,
                old_order_error: 0,

                amount: 0,
                first_amount_new: 0,
                plural_amount_new: 0,
                success_rate: 0,
                new_success_rate: 0,
                old_success_rate: 0,
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
                },
                userlevel: 0,
                userName: '',
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        mounted() {
            this.userlevel = JSON.parse(getUser()).level;
            this.userName = JSON.parse(getUser()).userName;
            if (this.userlevel === 2 && this.userName !== 'sonia') {
                this.options.splice(3, 1);
            }
            const startdate = this.gt.getTodaySymbol();
            const enddate = this.gt.getTodaySymbol();
            this.querydate = [startdate, enddate];
            this.resetSearch();
            this.getAmountOptions();
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
                this.search();
            },
            search() {
                const apkId = this.gt.getApkId();
                if (apkId === this.gd.NoInit) {
                    // console.log('未初始化完成渠道包信息,等待完成');
                } else {
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDateByEnd(this.querydate[1]);
                    let params = { userId: this.queryUserId, startdate, enddate, orderStatus: this.orderStatus, page: this.page, pageSize: this.pageSize, amountType: this.amountType, options: this.amountLit };
                    this.gt.httpPost(this.request_url, params).then((response) => {
                        const result = response.data.result;
                        console.log('result : ', result);
                        this.tableData = [];
                        for (let i = 0; i < result.data.length; i++) {
                            const ele = result.data[i];
                            ele.Serial = i + 1;
                            this.tableData.push(ele);
                        }
                        this.page = result.page;
                        this.page_total = result.page_total;
                        this.recharge_user_count = result.recharge_user_count;
                        this.recharge_user_new = result.recharge_user_new;
                        this.recharge_user_new_first = result.recharge_user_new_first;
                        this.recharge_user_new_plural = result.recharge_user_new_plural;
                        this.order_count = result.order_count;
                        this.order_finish = result.order_finish;
                        this.order_create = result.order_create;
                        this.order_error = result.order_error;
                        this.amount = result.amount;
                        this.first_amount_new = result.first_amount_new;
                        this.plural_amount_new = result.plural_amount_new;
                        this.success_rate = result.success_rate;
                        this.recharge_users_old = result.recharge_users_old;
                        this.recharge_count_old = result.recharge_count_old;
                        this.recharge_users_rep = result.recharge_users_rep;
                        this.recharge_count_rep = result.recharge_count_rep;

                        this.new_order_count = result.new_order_count;
                        this.new_order_finish = result.new_order_finish;
                        this.new_order_create = result.new_order_create;
                        this.new_order_error = result.new_order_error;
                        this.old_order_count = result.old_order_count;
                        this.old_order_finish = result.old_order_finish;
                        this.old_order_create = result.old_order_create;
                        this.old_order_error = result.old_order_error;
                        this.new_success_rate = result.new_success_rate;
                        this.old_success_rate = result.old_success_rate;
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            getDetail(userId){
                const params = { userId: userId };
                this.gt.httpPost('get_user_detail', params).then((response) => {
                    const result = response.data.result;
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
            },
            getAmountOptions() {
                this.gt.httpPost(this.request_option_url).then((response) => {
                    const result = response.data.result;
                    const itemList = result.TemplateData[0].ItemList;
                    for (let i = 0; i < itemList.length; i++) {
                        const obj = {};
                        obj.value = i + 1;
                        obj.label = Math.ceil(itemList[i].Count);
                        this.amountOptions.push(obj);
                        this.amountLit.push(obj.label);
                    }
                    this.amountOptions.push({ value: this.amountOptions.length, label: '其他' });
                }).catch(function (error) {
                    console.log(error);
                });
            },
            notifyChangeStatus(userId, orderId, isAgree) {
                this.$confirm(`是否确定${isAgree ? "同意" : "拒绝"}此订单?`).then(() => {
                    let params = { user_id: userId, order_id: orderId, isAgree };
                    this.gt.httpPost('/order_manage_notify', params).then((response) => {
                        const msg = response.data.msg;
                        this.$message({ message: `操作${msg}` });
                        const data = this.tableData.find(item => {
                            return item.orderId === orderId;
                        });
                        if (data) {
                            data.PayoutStatus = isAgree ? 2 : 3;
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                });
            },
        }
    }
</script>