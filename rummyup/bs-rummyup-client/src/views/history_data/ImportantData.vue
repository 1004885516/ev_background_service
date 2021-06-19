<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{ title_name }}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px;">选择查询日期范围</span>
                    <el-date-picker
                        :clearable="false"
                        v-model="querydate"
                        @change="dateHandleChange"
                        type="daterange"
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
                <el-card class="box-card" shadow="never">
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column width="100" align="center" prop="date" label="日期"></el-table-column>
                        <el-table-column align="center" prop="total_active" label="总活跃"></el-table-column>
                        <el-table-column align="center" prop="fb_active" label="FB活跃"></el-table-column>
                        <el-table-column width="100" align="center" prop="ph_active" label="手机活跃"></el-table-column>
                        <el-table-column width="100" align="center" prop="to_active" label="游客活跃"></el-table-column>
                        <el-table-column width="120" align="center" prop="pay_active" label="付费用户活跃"></el-table-column>
                        <el-table-column width="120" align="center" prop="room_average" label="平均游戏人数"></el-table-column>
                        <el-table-column width="120" align="center" prop="room_max" label="最高游戏人数"></el-table-column>
                        <el-table-column width="120" align="center" prop="online_average" label="平均在线人数"></el-table-column>
                        <el-table-column width="120" align="center" prop="online_max" label="最高在线人数"></el-table-column>
                        <el-table-column width="120" align="center" prop="witddraw_count" label="提现金额"></el-table-column>
                        <el-table-column width="120" align="center" prop="withdraw_users" label="提现人数"></el-table-column>
                        <el-table-column width="160" align="center" prop="gold_free" label="每日总免费发放金币"></el-table-column>
                        <el-table-column width="120" align="center" prop="recharge_total" label="每日总充值"></el-table-column>
                        <el-table-column width="170" align="center" prop="gold_active" label="活跃用户金币库存"></el-table-column>
                        <el-table-column width="170" align="center" prop="gold_cashout" label="可cashout金币库存"></el-table-column>
                        <el-table-column width="200" align="center" prop="robot_win_recharge" label="机器人赢取充值金币总额"></el-table-column>
                        <el-table-column width="200" align="center" prop="robot_win_give" label="机器人赢取赠送金币总额"></el-table-column>
                        <el-table-column width="200" align="center" prop="robot_lose" label="机器人输给玩家总额"></el-table-column>
                        <el-table-column width="100" align="center" prop="card_probability" label="玩牌率"></el-table-column>
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
    .el-cascader-menu__wrap {
        height: 500px !important;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data() {
            return {
                isGameSelect: true,
                querydate: [],
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                title_name: '关键数据',
                request_url: '/important_data',
                optionSelect: 0,
                tableData: [],
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        beforeDestroy() {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted () {
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                this.search();
            })
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
            this.querydate = [startdate, enddate];
            this.search();
        },
        methods: {
            async dateHandleChange(value) {
                const startdate = this.gt.transferDate(value[0]);
                const enddate = this.gt.transferDate(value[1]);
                this.querydate = [startdate, enddate];
            },
            search() {
                const startdate = this.gt.transferDate(this.querydate[0]);
                const enddate = this.gt.transferDate(this.querydate[1]);
                let params = { startdate, enddate, page: this.page, pageSize: this.pageSize };
                this.gt.httpPost(this.request_url, params).then((response) => {
                    console.log('response.data :', response.data);
                    const result = response.data.result;
                    console.log(result)
                    this.tableData = [];
                    this.tableData = result.tableData;
                    this.page_total = result.page_total;
                }).catch(function (error) {
                    console.log(error);
                });
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
        }
    }
</script>