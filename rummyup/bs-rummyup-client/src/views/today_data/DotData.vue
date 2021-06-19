<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>打点数据</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">类型选择</span>
                    <el-select v-model="typeSelect" placeholder="类型选择" style="margin-right: 50px">
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
                        <el-table-column width="250" align="center" prop="CreateTime" label="创建时间"></el-table-column>
                        <el-table-column width="200" align="center" prop="UserId" label="用户ID"></el-table-column>
                        <el-table-column width="100" align="center" prop="DotType" label="打点类型"></el-table-column>
                        <el-table-column align="center" prop="Info" label="详细信息"></el-table-column>
                        <el-table-column width="200" align="center" prop="ApkId" label="ApkId"></el-table-column>
                        <el-table-column width="200" align="center" prop="PackageId" label="PackageId"></el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px" shadow="never">
                    <el-pagination background @current-change="onChangePage" layout="prev, pager, next" :total="page_total"></el-pagination>
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
                request_url: '/getdotdata',
                querydate: '',
                page: 1,
                page_total: 1,
                tableData: [],
                options: [
                    { value: 0, label: '首充' },
                ],
                typeSelect: 0,
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        beforeDestroy() {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted() {
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                this.resetSearch();
            })
            const startdate = this.gt.getTodaySymbol();
            const enddate = this.gt.getTodaySymbol();
            this.querydate = [startdate, enddate];
            this.resetSearch();
        },
        methods: {
            onChangePage(val) {
                this.page = val;
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
                    // this.gt.httpPost('/dotdata').then((response) => {
                    //     console.log('dot data response.data :', response.data); 
                    // }).catch(function(error) {
                    //     console.log(error);
                    // })
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    let params = { apk_id: apkId, startdate, enddate, page: this.page, dottype: this.typeSelect };
                    this.gt.httpPost(this.request_url, params).then((response) => {
                        console.log('dot data response.data :', response.data);
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