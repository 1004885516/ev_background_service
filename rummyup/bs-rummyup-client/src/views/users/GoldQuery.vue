<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>金币变化</strong></h3>
            </div>
        </div>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <span class="demonstration" style="margin-right: 30px">选择查询日期范围</span>
                    <el-date-picker
                        v-model="querydate"
                        type="daterange"
                        :clearable="false"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click.native="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column :width="col_width" align="center" v-for="(item, i) in titleData" :key="i" :prop="item.prop" :label="item.label"></el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px">
                    <el-pagination
                        background
                        @current-change="onChangePage"
                        @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next"
                        :total="page_total"
                        :page-sizes="sizeData"
                        :page-size="pageSize">
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                col_width: 150,
                request_url: '/gold_query',
                titleData: [
                    {prop: 'date_time',                 label: '时间'},
                    {prop: 'gold_total',                label: '获取免费金币'},
                    {prop: 'gold_total_recharge',       label: '获取充值金币'},
                    {prop: 'gold_win_give',             label: 'AI赢玩家赠送'},
                    {prop: 'gold_win_recharge',         label: 'AI赢玩家充值'},
                    {prop: 'gold_lose',                 label: 'AI输玩家金币'},
                    // {prop: 'gold_lose_give',            label: 'AI输玩家赠送'},
                    // {prop: 'gold_lose_win',             label: 'AI输玩家充值'},

                    {prop: 'revenue_give',              label: '抽水赠送'},
                    {prop: 'revenue_payin',             label: '抽水充值'},
                    {prop: 'payout_give',               label: '提现赠送'},
                    {prop: 'payout_payin',              label: '提现充值'},
                    {prop: 'gold_pool',                 label: '金币池'},
                    {prop: 'win_ai',                    label: '玩家赢AI(金币池)'},
                    {prop: 'win_player',                label: 'AI赢玩家(金币池)'},
                ],
                tableData: [],
                querydate: [],
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        mounted() {
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getTodaySymbol();
            this.querydate = [startdate, enddate];
            this.search();
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
            search() {
                const startdate = this.gt.transferDate(this.querydate[0]);
                const enddate = this.gt.transferDate(this.querydate[1]);
                const params = { startdate, enddate, page: this.page, pageSize: this.pageSize };
                this.gt.httpPost(this.request_url, params).then((response) => {
                    console.log('response.data :', response.data);
                    const result = response.data.result;
                    const data = result.tableData;
                    this.tableData = [];
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const obj = {};
                        obj.date_time = item.Date;
                        obj.gold_total = item.PlayerGive;
                        obj.gold_total_recharge = item.PlayerPayin
                        obj.gold_win_give = item.RbWinGive;
                        obj.gold_win_recharge = item.RbWinPay;
                        obj.gold_lose = item.RbLoseGold;
                        obj.revenue_give = item.RevenueGive;
                        obj.revenue_payin = item.RevenuePayin;
                        obj.revenue_total = item.RevenueTotal;
                        obj.payout_give = item.PayoutGive;
                        obj.payout_payin = item.PayoutPayin;
                        obj.gold_pool = item.Jackpot;
                        obj.win_ai = item.PlayerWinAi;
                        obj.win_player = item.AiWinPlayer;
                        this.tableData.push(obj);
                    }
                    this.page = result.page;
                    this.page_total = result.page_total;
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },

    }
</script>