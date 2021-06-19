<template>
    <el-card class="box-card">
        <el-row>
            <div class="block">
                <span class="demonstration" style="margin-right: 20px">日期选择</span>
                <el-date-picker v-model="querydate" :picker-options="pickerOptions" @change="onChangeDate"
                    :clearable="false" align="right" type="date" placeholder="选择日期" >
                </el-date-picker>
            </div>
        </el-row>
        <el-row style="margin-top: 50px">
            <div id="echarts_online" style="width: 100%; height:400px;"></div>
        </el-row>
        <el-row style="margin-top: 100px">
            <div id="echarts_recharge" style="width: 100%; height:400px;"></div>
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
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        mounted() {
            this.querydate = this.gt.getDateByAdd(0);
            this.init();
        },
        methods: {
            onChangeDate () {
                this.querydate = this.gt.transferDate(this.querydate);
                console.log('this.querydate : ', this.querydate);
                this.init();
            },
            init() {
                const data = { querydate: this.querydate };
                this.gt.httpPost('/online_recharge_charts', data).then((response) => {
                    const result = response.data.result;
                    console.log('result : ', result);
                    this.initOnline(result.online);
                    this.initRecharge(result.recharge);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initOnline(onlinedata) {
                let onlineChart = echarts.init(document.getElementById('echarts_online'));
                const option = {
                    title: { text: '在线数据图' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['今日在线', '昨日在线', '七日在线'] },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00',],
                    },
                    yAxis: { type: 'value', scale: true },
                    series: [
                        {
                            name: '今日在线',
                            type: 'line',
                            // stack: '总量',
                            data: onlinedata[0]
                        },
                        {
                            name: '昨日在线',
                            type: 'line',
                            // stack: '总量',
                            data: onlinedata[1]
                        },
                        {
                            name: '七日在线',
                            type: 'line',
                            // stack: '总量',
                            data: onlinedata[2]
                        }
                    ]
                };
                onlineChart.setOption(option);
            },
            initRecharge(rechargedata) {
                let rechargeChart = echarts.init(document.getElementById('echarts_recharge'));
                const option = {
                    title: { text: '今日充值数据图' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['充值人数', '充值笔数', '充值金额'] },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00',],
                    },
                    yAxis: { type: 'value', scale: true },
                    series: [
                        {
                            name: '充值人数',
                            type: 'line',
                            // stack: '总量',
                            data: rechargedata[0]
                        },
                        {
                            name: '充值笔数',
                            type: 'line',
                            // stack: '总量',
                            data: rechargedata[1]
                        },
                        {
                            name: '充值金额',
                            type: 'line',
                            // stack: '总量',
                            data: rechargedata[2]
                        }
                    ]
                };
                rechargeChart.setOption(option);
            }
        }
    }
</script>