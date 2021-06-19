<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{ title_name }}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">筛选</span>
                    <el-select v-model="selectIndex" placeholder="类型选择" style="margin-right: 50px">
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
                    <el-button type="primary" icon="el-icon-search" @click.native="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card" shadow="never">
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column align="center" v-for="(item, i) in titleData" :key="i" :prop="item.key" :label="item.name"></el-table-column>
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
                col_width: 150,
                title_name: '充值统计',
                request_url: '/recharge_statistics',
                querydate: '',
                page: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                page_total: 1,
                tableData: [],
                titleData: [
                    { key: 'date',         name: '日期' },
                    { key: 'amount20',           name: '20'},
                    { key: 'amount50',           name: '50' },
                    { key: 'amount100',          name: '100' },
                    { key: 'amount200',          name: '200' },
                    { key: 'amount500',          name: '500' },
                    { key: 'amount1000',         name: '1000' },
                    { key: 'amount2000',         name: '2000' },
                    { key: 'amount5000',         name: '5000' }
                ],
                selectIndex: 0,
                options: [
                    { value: 0, label: '充值次数' },
                    { value: 1, label: '充值人数' },
                    { value: 2, label: '充值总金额' }
                ],
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        beforeDestroy() {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted() {
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
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
                let params = { startdate, enddate, page: this.page, pageSize: this.pageSize, type: this.selectIndex };
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
</script>
