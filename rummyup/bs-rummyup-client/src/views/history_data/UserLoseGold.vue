<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{ title_name }}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">流失日期</span>
                    <el-select v-model="optionSelect" placeholder="流失日期" style="margin-right: 10px; width: 110px">
                        <el-option v-for="item in loseOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px; margin-left: 50px">选择查询日期范围</span>
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
                        <el-table-column align="center" prop="date" label="日期"></el-table-column>
                        <el-table-column align="center" prop="lt1" label="金币小于1"></el-table-column>
                        <el-table-column align="center" prop="lt2" label="金币小于2"></el-table-column>
                        <el-table-column align="center" prop="lt3" label="金币小于3"></el-table-column>
                        <el-table-column align="center" prop="lt5" label="金币小于5"></el-table-column>
                        <el-table-column align="center" prop="lt10" label="金币小于10"></el-table-column>
                        <el-table-column align="center" prop="lt20" label="金币小于20"></el-table-column>
                        <el-table-column align="center" prop="lt50" label="金币小于50"></el-table-column>
                        <el-table-column align="center" prop="lt100" label="金币小于100"></el-table-column>
                        <el-table-column align="center" prop="gt100" label="金币大于100"></el-table-column>
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
                querydate: [],
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                title_name: '用户流失金币',
                request_url: '/user_lose_gold',
                loseOptions: [
                    { value: 0, label: '3日流失' },
                    { value: 1, label: '7日流失' }
                ],
                optionSelect: 0,
                tableData: [],
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, true);
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
                const apkId = this.gt.getApkId();
                if (apkId === this.gd.NoInit) {
                    console.log('未初始化完成渠道包信息,等待完成');
                } else {
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    let params = { apk_id: apkId, startdate, enddate, page: this.page, lose_type: this.optionSelect, pageSize: this.pageSize };
                    this.gt.httpPost(this.request_url, params).then((response) => {
                            console.log('response.data :', JSON.stringify(response.data));
                            const result = response.data.result;
                            console.log(result)
                            this.tableData = [];
                            this.tableData = result.tableData;
                            this.page_total = result.page_total;
                        }).catch(function (error) {
                            console.log(error);
                        });
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
        }
    }
</script>