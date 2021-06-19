<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>破产活动</strong></h3>
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
                        <el-table-column align="center" v-for="(item, i) in titleData" :key="i" :prop="item.prop" :label="item.label"></el-table-column>
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
                col_width: 180,
                request_url: '/activity_limit_data',
                titleData: [
                    {prop: 'date_time',                label: '日期'},
                    {prop: 'numberOfPopUp',            label: '弹出次数'},
                    {prop: 'rBuyCount',                label: '购买次数(充值用户)'},
                    {prop: 'rBuyUserCount',            label: '购买人数(充值用户)'},
                    {prop: 'nBuyCount',                label: '购买次数(非充值用户)'},
                    {prop: 'nBuyUserCount',            label: '购买人数(非充值用户)'},
                ],
                tableData: [],
                querydate: [],
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表,
                type: 5 // 5破产活动
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
                const params = { startdate, enddate, page: this.page, pageSize: this.pageSize, type: this.type };
                this.gt.httpPost(this.request_url, params).then((response) => {
                    console.log('response.data :', response.data);
                    const result = response.data.result;
                    const data = result.tableData;
                    this.tableData = [];
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const obj = {};
                        obj.date_time = item.date;
                        obj.numberOfPopUp = item.numberOfPopUp;
                        obj.rBuyCount = item.rBuyCount;
                        obj.rBuyUserCount = item.rBuyUserCount;
                        obj.nBuyCount = item.nBuyCount;
                        obj.nBuyUserCount = item.nBuyUserCount;
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