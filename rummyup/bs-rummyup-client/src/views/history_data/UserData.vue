<template>
    <el-card class="box-card">
        <div class="row mb-4 mb-xl-3">
            <el-row :gutter="20">
                <h3><strong>{{ title_name }}</strong></h3>
            </el-row>
        </div>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <span class="demonstration" style="margin-right: 10px">用户ID</span>
                    <el-input placeholder="请输入用户ID" v-model="queryUserId" style="width:200px; margin-right: 30px"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="8">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <span class="demonstration" style="margin-right: 10px; margin-left: 10px">获取方式</span>
                    <el-select v-model="optionSelect" placeholder="获取方式"  style="width:100px; margin-right: 30px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px">查询范围</span>
                    <el-date-picker
                        v-model="querydate"
                        type="daterange"
                        :clearable="false"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row style="margin-top: 20px">
            <el-card class="box-card" style="width: 100%" shadow="never">
                <el-row>
                    <el-col :span="4" style="text-align: right"><span>Rummy把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ rummy_session }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>Rummy胜率 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ rummy_win_rate }}%</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>Teenpatti把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ teenpatti_session }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>Teenpatti胜率 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ teenpatti_win_rate }}%</span></el-col>
                </el-row>
                <el-row style="margin-top: 30px">
                    <el-col :span="4" style="text-align: right"><span>Rummy把数(2人) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ rummy_two_count }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>Rummy胜率(2人) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ rummy_two_win_rate }}%</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>Teenpatti把数(speed) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ quick_tp_count }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>Teenpatti胜率(speed) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ quick_teenpatti_win_rate }}%</span></el-col>
                </el-row>
                <el-row style="margin-top: 30px">
                    <el-col :span="4" style="text-align: right"><span>Practice把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ practice_session }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>第一次破产把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ first_broke_session }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>第二次破产把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ second_broke_session }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>rummy最大连赢把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ rummy_winning }}</span></el-col>
                </el-row>
                <el-row style="margin-top: 30px">
                    <el-col :span="4" style="text-align: right"><span>rummy最大连输把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ rummy_losing }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span></span>teenpatti最大连赢把数 :</el-col>
                    <el-col :span="4" style="text-align: left"><span></span>{{ teenpatti_winning }}</el-col>
                    <el-col :span="4" style="text-align: right"><span>teenpatti最大连输把数 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ teenpatti_losing }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span>签到领取总额 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ signin_total_money }}</span></el-col>
                </el-row>
                 <el-row style="margin-top: 30px">
                    <el-col :span="4" style="text-align: right"><span>转盘获取总额 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ turntable_total_money }}</span></el-col>
                    <el-col :span="4" style="text-align: right"><span></span></el-col>
                    <el-col :span="4" style="text-align: left"><span></span></el-col>
                    <el-col :span="4" style="text-align: right"><span></span></el-col>
                    <el-col :span="4" style="text-align: left"><span></span></el-col>
                    <el-col :span="4" style="text-align: right"><span></span></el-col>
                    <el-col :span="4" style="text-align: left"><span></span></el-col>
                </el-row>
            </el-card>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="width: 100%" border>
                        <el-table-column align="center" prop="datetime" label="日期"></el-table-column>
                        <el-table-column align="center" prop="userId" label="ID"></el-table-column>
                        <el-table-column align="center" prop="access" label="获取方式"></el-table-column>
                        <el-table-column align="center" prop="coinNum" label="金额"></el-table-column>
                        <el-table-column align="center" prop="balance" label="剩余金币"></el-table-column>
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

<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .custom-row {
        margin: 0px;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data() {
            return {
                title_name: '用户数据',
                request_url: 'user_data',
                querydate: [],
                date: '',
                queryUserId: '',
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                tableData: [],
                rummyNumbers: 0,
                teenpattiNumbers: 0,
                practiceNumbers: 0,

                rummy_session: 0,
                teenpatti_session: 0,
                practice_session:0,
                rummy_two_count: 0,
                quick_tp_count: 0,
                rummy_win_rate: 0,
                rummy_two_win_rate: 0,
                teenpatti_win_rate: 0,
                quick_teenpatti_win_rate: 0,
                first_broke_session: 0,
                second_broke_session: 0,
                rummy_winning: 0,
                rummy_losing: 0,
                teenpatti_winning: 0,
                teenpatti_losing: 0,
                signin_total_money: 0,
                turntable_total_money: 0,
                options: [
                    { value: 0, label: '全部' },
                    { value: 1, label: '游戏' },
                    { value: 2, label: '充值' },
                    { value: 3, label: '提现' },
                    { value: 4, label: '活动' },
                    { value: 5, label: '系统' },
                ],
                optionSelect: 0
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        mounted () {
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getTodaySymbol();
            this.querydate = [startdate, enddate];
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
                const page = this.page;
                const userId = this.queryUserId;
                if (!userId) {
                    this.$message({ message: '请输入用户ID' });
                    return;
                }
                let params = { startdate, enddate, page, userId, pageSize: this.pageSize, type: this.optionSelect };
                this.gt.httpPost(this.request_url, params).then((response) => {
                    console.log('base data response.data :', response.data);
                    const result = response.data.result;
                    this.tableData = [];
                    this.tableData = result.tableData;
                    this.page_total = result.page_total;
                    this.rummy_session = result.numbers.rummy_session;
                    this.teenpatti_session = result.numbers.teenpatti_session;
                    this.practice_session = result.numbers.practice_session;
                    this.rummy_winning = result.numbers.rummy_winning;
                    this.rummy_losing = result.numbers.rummy_losing;
                    this.teenpatti_winning = result.numbers.teenpatti_winning;
                    this.teenpatti_losing = result.numbers.teenpatti_losing;
                    this.rummy_win_rate = result.numbers.rummy_win_rate;
                    this.teenpatti_win_rate = result.numbers.teenpatti_win_rate;
                    this.signin_total_money = result.numbers.signin_total_money;
                    this.turntable_total_money = result.numbers.turntable_total_money;
                    this.rummy_two_count = result.numbers.rummy_two_count;
                    this.rummy_two_win_rate = result.numbers.rummy_two_win_rate;
                    this.quick_tp_count = result.numbers.quick_tp_count;
                    this.quick_teenpatti_win_rate = result.numbers.quick_teenpatti_win_rate;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>