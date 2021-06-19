<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{ title_name }}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%">
                    <template v-if="isGameSelect">
                        <span class="demonstration" style="margin-right: 10px">玩法选择</span>
                        <el-select v-model="gameSelect" placeholder="玩法选择" style="margin-right: 50px">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
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
                <el-card class="box-card">
                    <el-table :data="tableData" style="100%" border>
                        <template v-if="isWidth">
                            <el-table-column :width="col_width" align="center" v-for="(item, i) in titleData" :key="i" :prop="item.key" :label="item.name"></el-table-column>
                        </template>
                        <template v-else>
                            <el-table-column align="center" v-for="(item, i) in titleData" :key="i" :prop="item.key" :label="item.name"></el-table-column>
                        </template>
                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px">
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
    export default {
        data () {
            return {
                title_name: '场次总览',
                request_url: 'session_data',
                isGameSelect: true,
                isWidth: false,
                col_width: 150,
                querydate: '',
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                tableData: [],
                titleData: [],
                options: [
                    { value: 5, label: 'Rummy' },
                    { value: 4, label: 'TeenPatti' },
                    { value: 0, label: 'Practice' },
                    { value: 7, label: 'Rummy(2人)' },
                    { value: 8, label: 'TeenPatti(speed)' },
                    { value: 9, label: 'AK47' },
                    { value: 10, label: 'LowestJoker' },
                    { value: 11, label: 'HighestJoker' },
                    { value: 12, label: 'DragonVSTiger' },
                ],
                gameSelect: 5,
            }
        },
        created() {
            // console.log('base data created.');
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        beforeDestroy() {
            // console.log('base data beforeDestroy.');
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted() {
            // console.log('base data mounted.');
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                console.log('base data on change package id : ', this.gt.getApkId());
                this.resetSearch();
            })
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getTodaySymbol();
            this.querydate = [startdate, enddate];
            this.resetSearch();
        },
        methods: {
            onChangePage(val) {
                this.page = val;
                console.log('base data onChangePage : ', this.page);
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
                    console.log('base data search.');
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    let params = { apk_id: apkId, startdate, enddate, page: this.page, pageSize: this.pageSize };
                    if (this.isGameSelect) {
                        params.game_select = this.gameSelect;
                    }
                    this.gt.httpPost(this.request_url, params).then((response) => {
                        console.log('base data response.data :', response.data);
                        const result = response.data.result;
                        this.page = result.page;
                        this.page_total = result.page_total;
                        if (this.isGameSelect) {
                            this.titleData = [];
                            for (let i = 0; i < result.titleData.length; i++) {
                                const item = result.titleData[i];
                                this.titleData.push(item);
                            }
                        }
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