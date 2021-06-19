<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{ title_name }}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">玩家类型</span>
                        <el-select v-model="selectIndex" placeholder="玩家类型" style="margin-right: 50px">
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
                        <el-table-column align="center" v-for="(item, i) in titleData" :key="i" :prop="item.prop" :label="item.label"></el-table-column>
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
                title_name: '金币结余',
                request_url: '/gold_surplus',
                querydate: '',
                page: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                page_total: 1,
                tableData: [],
                titleData: [
                    { prop: 'date',                label: '日期' },
                    { prop: 'pay_gold',            label: '不可提赠' },
                    { prop: 'gold',                label: '不可提充' },
                    { prop: 'win_gold',            label: '可提赠' },
                    { prop: 'win_pay_gold',        label: '可提充' },
                    { prop: 'total_gold',          label: '不可提总' },
                    { prop: 'total_win_gold',      label: '可提总' },
                    { prop: 'tatal_surplus',       label: '总结余' },
                ],
                options: [
                    { value: 0, label: '充值玩家' },
                    { value: 1, label: '非充值玩家' }
                ],
                selectIndex: 0,
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
                this.search();
            },
            search() {
                const apkId = this.gt.getApkId();
                if (apkId === this.gd.NoInit) {
                    console.log('未初始化完成渠道包信息,等待完成');
                } else {
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    let params = { apk_id: apkId, package_id: this.packageSelect, startdate, enddate, page: this.page, pageSize: this.pageSize, type: this.selectIndex };
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
