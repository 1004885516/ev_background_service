<template>
    <el-card class="box-card">
        <el-row>
            <div class="block">
                <!-- <span class="demonstration" style="margin-right: 20px">日期选择</span>
                <el-date-picker v-model="querydate" :picker-options="pickerOptions" @change="onChangeDate"
                    :clearable="false" align="right" type="date" placeholder="选择日期" >
                </el-date-picker> -->
                <span class="demonstration" style="margin-right: 10px;">选择查询日期范围</span>
                <el-date-picker
                    :clearable="false"
                    v-model="querydate"
                    @change="onChangeDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                </el-date-picker>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card" shadow="never">
                    <el-table :data="totalGoldTable" style="100%" border>
                        <el-table-column align="center" prop="date" label="日期"></el-table-column>
                        <el-table-column align="center" prop="t1" label="0-1"></el-table-column>
                        <el-table-column align="center" prop="t2" label="1-2"></el-table-column>
                        <el-table-column align="center" prop="t4" label="2-4"></el-table-column>
                        <el-table-column align="center" prop="t5" label="4-5"></el-table-column>
                        <el-table-column align="center" prop="t8" label="5-8"></el-table-column>
                        <el-table-column align="center" prop="t10" label="8-10"></el-table-column>
                        <el-table-column align="center" prop="t40" label="10-40"></el-table-column>
                        <el-table-column align="center" prop="t50" label="40-50"></el-table-column>
                        <el-table-column align="center" prop="t80" label="50-60"></el-table-column>
                        <el-table-column align="center" prop="t100" label="80-100"></el-table-column>
                        <el-table-column align="center" prop="t200" label="100-200"></el-table-column>
                        <el-table-column align="center" prop="t400" label="200-400"></el-table-column>
                        <el-table-column align="center" prop="t500" label="400-500"></el-table-column>
                        <el-table-column align="center" prop="t800" label="500-800"></el-table-column>
                        <!-- <el-table-column width="90" align="center" prop="14" label="800以上"></el-table-column> -->
                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px" shadow="never">
                    <el-pagination 
                        background 
                        @current-change="onChangePage"
                        @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next" 
                        :total="page_total"
                        :page-sizes="sizeData"
                        :page-size="pageSize"
                        ></el-pagination>
                </el-card>
            </el-col>
        </el-row>
        <el-row style="margin-top: 50px">
            <div id="echarts_total_gold" style="width: 100%; height:400px;"></div>
        </el-row>
        <el-row style="margin-top: 100px">
            <div id="echarts_robot_gold" style="width: 100%; height:400px;"></div>
        </el-row>
    </el-card>
</template>

<script>
    import echarts from 'echarts'
    import EventBus from '@/utils/EventBus.js'
    export default {
        data() {
            return {
                baseData: [],
                querydate: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                        picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                        }
                    }]
                },
                totalGoldTable: [],
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, true);
        },
        beforeDestroy() {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted() {
            // this.querydate = this.gt.getDateByAdd(-1);
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
            this.querydate = [startdate, enddate];
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                this.init();
            })
            this.init();
        },
        methods: {
            onChangeDate (value) {
                // this.querydate = this.gt.transferDate(this.querydate);
                const startdate = this.gt.transferDate(value[0]);
                const enddate = this.gt.transferDate(value[1]);
                this.querydate = [startdate, enddate];
                console.log('this.querydate : ', this.querydate);
                this.init();
            },
            init() {
                const apkId = this.gt.getApkId();
                if (apkId !== this.gd.NoInit) {
                    console.log('this.querydate', this.querydate);
                    // const data = { querydate: this.querydate, apk_id: apkId };
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    const data = { querydate: this.querydate, apk_id: apkId, startdate, enddate, page: this.page, pageSize: this.pageSize };
                    this.gt.httpPost('/user_gold_charts', data).then((response) => {
                        const result = response.data.result;
                        console.log('result : ', result);
                        this.initTotalGold(result.totalGold);
                        this.initRobotGold(result.robotGold);
                        // 列表
                        this.totalGoldTable = result.totalGoldTable.tableData;
                        console.log('this.totalGoldTable---', this.totalGoldTable);
                        this.page_total = result.totalGoldTable.page_total;

                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            initTotalGold(totalGolddata) {
                let totalGoldChart = echarts.init(document.getElementById('echarts_total_gold'));
                const option = {
                    title: { text: '玩家剩余总金币(x)' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: [ '今日人数', '昨日人数', '七日人数' ] },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [ 'x <= 1', 'x <= 2', 'x <= 4', 'x <= 5', 'x <= 8', 'x <= 10', 'x <= 40', 'x <= 50', 'x <= 80', 'x <= 100', 'x <= 200', 'x <= 400', 'x <= 500', 'x <= 800' ],
                    },
                    yAxis: { type: 'value', scale: true },
                    series: [
                        {
                            name: '今日人数',
                            type: 'line',
                            data: totalGolddata[0]
                        },
                        {
                            name: '昨日人数',
                            type: 'line',
                            data: totalGolddata[1]
                        },
                        {
                            name: '七日人数',
                            type: 'line',
                            data: totalGolddata[2]
                        }
                    ]
                };
                totalGoldChart.setOption(option);
            },
            initRobotGold(robotGoldData) {
                let robotGoldChart = echarts.init(document.getElementById('echarts_robot_gold'));
                const option = {
                    title: { text: '玩家输赢机器人金币(x)' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: [ '今日人数', '昨日人数', '七日人数' ] },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [ 'x <= -1000', 'x <= -500', 'x <= -300', 'x <= -150', 'x <= -100', 'x <= -80', 'x <= -60', 'x <= -50', 'x <= -40', 'x <= -30',
                        'x <= -20', 'x <= -10', 'x <= 0', 'x <= 10', 'x <= 20', 'x <= 30', 'x <= 40', 'x <= 50', 'x <= 60', 'x <= 80', 'x <= 100', 'x <= 200' ],
                    },
                    yAxis: { type: 'value', scale: true },
                    series: [
                        {
                            name: '今日人数',
                            type: 'line',
                            data: robotGoldData[0]
                        },
                        {
                            name: '昨日人数',
                            type: 'line',
                            data: robotGoldData[1]
                        },
                        {
                            name: '七日人数',
                            type: 'line',
                            data: robotGoldData[2]
                        }
                    ]
                };
                robotGoldChart.setOption(option);
            },
            onChangePage(val) {
                this.page = val;
                this.init();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.init();
            },
        }
    }
</script>