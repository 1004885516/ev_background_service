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
            <div id="echarts_pcinfo" style="width: 100%; height:400px;"></div>
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
                this.init();
            },
            init() {
                const data = { querydate: this.querydate };
                this.gt.httpPost('/pc_info_charts', data).then((response) => {
                    const result = response.data.result;
                    console.log('result : ', result);
                    this.initPCInfo(result.data);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initPCInfo(data) {
                let pcInfoChart = echarts.init(document.getElementById('echarts_pcinfo'));
                const option = {
                    title: { text: '性能监控' },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            let data = params[0].name + '<br>' + params[0].seriesName + ' : ' + params[0].data + 'G';
                            data += '<br>' + params[1].seriesName + ' : ' + params[1].data + '%';
                            data += '<br>' + params[2].seriesName + ' : ' + params[2].data + '%';
                            return data;
                        }
                    },
                    legend: { data: ['空闲内存', '内存占用率', 'CPU占用率'] },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: data[3],
                        axisLabel: {  
                            interval: 1,
                            // rotate:40
                        }
                    },
                    yAxis: { type: 'value', scale: true, min: 0, max: 100 },
                    series: [
                        {
                            name: '空闲内存',
                            type: 'line',
                            data: data[0]
                        },
                        {
                            name: '内存占用率',
                            type: 'line',
                            data: data[1]
                        },
                        {
                            name: 'CPU占用率',
                            type: 'line',
                            data: data[2]
                        }
                    ]
                };
                pcInfoChart.setOption(option);
            }
        }
    }
</script>