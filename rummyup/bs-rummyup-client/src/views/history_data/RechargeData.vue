<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{ title_name }}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">版本选择</span>
                    <el-select v-model="packageSelect" placeholder="版本选择" style="margin-right: 50px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px">选择查询日期范围</span>
                    <el-date-picker
                        :clearable="false"
                        v-model="querydate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click.native="resetSearch()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card" shadow="never">
                    <el-table :data="tableData" style="100%" border>
                        <template v-if="isWidth">
                            <el-table-column :width="col_width" align="center" v-for="(item, i) in titleData" :key="i" :prop="item.key" :label="item.name"></el-table-column>
                        </template>
                        <template v-else>
                            <el-table-column align="center" v-for="(item, i) in titleData" :key="i" :prop="item.key" :label="item.name"></el-table-column>
                        </template>

                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px" shadow="never">
                    <el-pagination 
                        background 
                        @current-change="onChangePage" 
                        @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next"
                        :page-sizes="sizeData"
                        :page-size="pageSize"
                        :total="page_total"></el-pagination>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                isWidth: true,
                col_width: 150,
                title_name: '历史数据',
                request_url: '/recharge_data',
                querydate: '',
                page: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                page_total: 1,
                tableData: [],
                titleData: [
                    { key: 'date',                  name: '日期' },
                    { key: 'package_id',            name: 'PackageId'},
                    { key: 'activate',              name: '激活' },
                    { key: 'register',              name: '注册' },
                    { key: 'register_rate',         name: '注册率' },
                    { key: 'dau',                   name: '日活(总)' },
                    { key: 'dau_old',               name: '日活(老玩家)' },
                    { key: 'recharge_users',        name: '充值人数(总)' },
                    { key: 'recharge_count',        name: '充值金额(总)' },
                    { key: 'recharge_users_new',    name: '充值人数(新)' },
                    { key: 'recharge_count_new',    name: '充值金额(新)' },

                    { key: 'recharge_users_old',    name: '充值人数(老,首)' },
                    { key: 'recharge_count_old',    name: '充值金额(老,首)' },
                    { key: 'recharge_users_rep',    name: '充值人数(老,复)' },
                    { key: 'recharge_count_rep',    name: '充值金额(老,复)' },

                    { key: 'withdraw_users',        name: '提现人数' },
                    { key: 'witddraw_count',        name: '提现金额' },
                    { key: 'witddraw_real_count',   name: '提现金额(到账)' },
                    { key: 'tax_count',             name: '抽水金额' },
                    { key: 'tax_rebate_count',      name: '抽水返利金额' },
                    { key: 'arpu_register',         name: 'ARPU(注册)' },
                    { key: 'arpu_dau',              name: 'ARPU(活跃)' },
                    { key: 'arpu_recharge',         name: 'ARPU(充值)' },
                    { key: 'pay_rate',              name: '付费率(活跃)' },
                    { key: 'pay_rate_new',          name: '付费率(注册)' },
                    { key: 'withdraw_rate',         name: '提现率' },
                ],
                options: [{ value: this.gd.All, label: this.gd.All }],
                packageSelect: this.gd.All,
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, true);
        },
        beforeDestroy() {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted() {
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                // console.log('base data on change package id : ', this.gt.getApkId());
                this.updateApkId();
                this.resetSearch();
            })
            this.updateApkId();
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
            this.querydate = [startdate, enddate];
            this.resetSearch();
        },
        methods: {
            updateApkId() {
                const apkId = this.gt.getApkId();
                if (apkId !== this.gd.NoInit) {
                    this.options = [];
                    this.options.push({ value: this.gd.All, label: this.gd.All });
                    const packageIds = this.gt.getPackageIds();
                    for (let i = 0; i < packageIds.length; i++) {
                        const ele = packageIds[i];
                        this.options.push({ value: ele, label: ele });
                    }
                    this.packageSelect = this.gd.All;
                }
            },
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
                    console.log('未初始化完成渠道包信息,等待完成');
                } else {
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    let params = { apk_id: apkId, package_id: this.packageSelect, startdate, enddate, page: this.page, pageSize: this.pageSize };
                    this.gt.httpPost(this.request_url, params).then((response) => {
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
                }
            }
        }
    }
</script>
