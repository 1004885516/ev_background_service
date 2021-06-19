<template>
    <el-card class="box-card">
        <el-row>
            <div class="block">
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
                <span class="demonstration" style="margin-right: 10px;">玩法选择</span>
                <el-select v-model="optionSelect" placeholder="玩法选择" style="margin-right: 10px; width: 150px" @change="handleChange">
                    <el-option v-for="(item, index) in gameTypes" :key="index + 3" :label="item" :value="index + 3"></el-option>
                </el-select>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card" shadow="never">
                    <el-table :data="sessionTable" style="100%" border>
                        <el-table-column :width="120" align="center" prop="date" label="日期"></el-table-column>
                        <el-table-column :width="80" align="center" prop="a1" label="1-5"></el-table-column>
                        <el-table-column align="center" prop="a2" label="5-10"></el-table-column>
                        <el-table-column align="center" prop="a3" label="10-20"></el-table-column>
                        <el-table-column align="center" prop="a4" label="20-30"></el-table-column>
                        <el-table-column align="center" prop="a5" label="30-40"></el-table-column>
                        <el-table-column align="center" prop="a6" label="40-50"></el-table-column>
                        <el-table-column align="center" prop="a7" label="50-60"></el-table-column>
                        <el-table-column align="center" prop="a8" label="60-70"></el-table-column>
                        <el-table-column align="center" prop="a9" label="70-80"></el-table-column>
                        <el-table-column align="center" prop="a10" label="80-90"></el-table-column>
                        <el-table-column align="center" prop="a11" label="90-100"></el-table-column>
                        <el-table-column align="center" prop="a12" label="100-120"></el-table-column>
                        <el-table-column align="center" prop="a13" label="120-150"></el-table-column>
                        <el-table-column align="center" prop="a14" label="150-200"></el-table-column>
                        <el-table-column align="center" prop="a15" label="200-300"></el-table-column>
                        <el-table-column align="center" prop="a16" label=">300"></el-table-column>
                        <el-table-column align="center" prop="total" label="总"></el-table-column>
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
            <el-col :span="12">
                <div id="echarts_session_0" style="width: 100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="echarts_session_1" style="width: 100%; height:400px;"></div>
            </el-col>
        </el-row>
        <el-row style="margin-top: 100px">
            <el-col :span="12">
                <div id="echarts_session_2" style="width: 100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="echarts_session_3" style="width: 100%; height:400px;"></div>
            </el-col>
        </el-row>
        <el-row style="margin-top: 100px">
            <el-col :span="12">
                <div id="echarts_session_4" style="width: 100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="echarts_session_5" style="width: 100%; height:400px;"></div>
            </el-col>
        </el-row>
        <el-row style="margin-top: 100px">
            <el-col :span="12">
                <div id="echarts_session_6" style="width: 100%; height:400px;"></div>
            </el-col>
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
                gameTypes: [ 'TeenPatti', 'QuickTP', 'Ak47', 'Rummy', 'Rummy2User', 'LowJoker', 'HighJoker' ],
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
                optionSelect: 3,
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                sessionTable: []
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, true);
        },
        beforeDestroy() {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted() {
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
                const startdate = this.gt.transferDate(value[0]);
                const enddate = this.gt.transferDate(value[1]);
                this.querydate = [startdate, enddate];
                this.init();
            },
            init() {
                const apkId = this.gt.getApkId();
                const startdate = this.gt.transferDate(this.querydate[0]);
                const enddate = this.gt.transferDate(this.querydate[1]);
                if (apkId !== this.gd.NoInit) {
                    const data = { querydate: this.querydate, apk_id: apkId, startdate, enddate, page: this.page, pageSize: this.pageSize, dataType: this.optionSelect };
                    this.gt.httpPost('/session_charts', data).then((response) => {
                        const result = response.data.result;
                        console.log('result---', result);
                        for (let i = 0; i < result.data.length; i++) {
                            const item = result.data[i];
                            this.initUserSessionData(i, item);
                        }
                        this.sessionTable = result.table.tableData;
                        this.page_total = result.table.page_total;
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            initUserSessionData(type, sessiondata) {
                let userSessionChart = echarts.init(document.getElementById(`echarts_session_${type}`));
                const option = {
                    title: { text: `${this.gameTypes[type]}场次段人数(x)` },
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
                        data: [ 
                            'x = 0', 'x <= 5', 'x <= 10', 'x <= 20', 'x <= 30',
                            'x <= 40', 'x <= 50', 'x <= 60', 'x <= 70', 'x <= 80',
                            'x <= 90', 'x <= 100', 'x <= 120', 'x <= 150', 'x <= 200',
                            'x <= 300', 'x > 300'
                        ],
                        axisLabel: {  
                            interval: 0,
                            // rotate:40
                        }
                    },
                    yAxis: { type: 'value', scale: true },
                    series: [
                        // {
                        //     name: '场次段人数',
                        //     type: 'line',
                        //     data: sessiondata
                        // }
                        {
                            name: '今日人数',
                            type: 'line',
                            data: sessiondata[0]
                        },
                        {
                            name: '昨日人数',
                            type: 'line',
                            data: sessiondata[1]
                        },
                        {
                            name: '七日人数',
                            type: 'line',
                            data: sessiondata[2]
                        }
                    ]
                };
                userSessionChart.setOption(option);
            },
            handleChange(val) {
                console.log('val---', val);
                this.optionSelect = val;
                this.init();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.init();
            },
            onChangePage(val) {
                this.page = val;
                console.log('base data onChangePage : ', this.page);
                this.init();
            },
        }
    }
</script>