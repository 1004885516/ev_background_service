<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>档位输赢</strong></h3>
            </div>
        </div>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <span class="demonstration" style="margin-right: 10px">用户ID</span>
                    <el-input placeholder="请输入用户ID" v-model="queryUserId" style="width:200px; margin-right: 30px"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="8">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <span class="demonstration" style="margin-right: 10px">查询范围</span>
                    <el-date-picker
                        v-model="querydate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        :editable = false
                        :clearable = false
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand" label-width="auto">
                                    <el-row>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="开始M值:" label-width="auto"><span>{{ props.row.start_m }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="结束M值:" label-width="auto"><span>{{ props.row.end_m }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="开始N值:" label-width="auto"><span>{{ props.row.start_n }}</span></el-form-item>
                                        </el-col>
                                         <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="结束N值:" label-width="auto"><span>{{ props.row.end_n }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="不可提赠送:" label-width="auto"><span>{{ props.row.give_connot }}</span></el-form-item>
                                        </el-col>
                                         <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="不可提充值:" label-width="auto"><span>{{ props.row.recharge_connot }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="可提赠送:" label-width="auto"><span>{{ props.row.give_con }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="可提充值:" label-width="auto"><span>{{ props.row.recharge_con }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="AI可提现(赠):" label-width="auto"><span>{{ props.row.robot_give_can }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="AI可提现(充):" label-width="auto"><span>{{ props.row.robot_recharge_can }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="抽水总额:" label-width="auto"><span>{{ props.row.revenue }}</span></el-form-item>
                                        </el-col>
                                         <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="场次额度:" label-width="auto"><span>{{ props.row.add_rank }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="输赢真人的充值金币开始值:" label-width="auto"><span>{{ props.row.BPayGoldStat }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="输赢真人的充值金币结束值:" label-width="auto"><span>{{ props.row.EPayGoldStat }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="开始充提比:" label-width="auto"><span>{{ props.row.BPayinOutPer }}</span></el-form-item>
                                        </el-col>
                                         <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="结束充提比:" label-width="auto"><span>{{ props.row.EPayinOutPer }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="玩家充值级别:" label-width="auto"><span>{{ props.row.PayinLevel }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="玩家充提比档位:" label-width="auto"><span>{{ props.row.PayinRank }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            
                                        </el-col>
                                         <el-col :span="6" style="margin-right: 0px">
                                            
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column :width="180" align="center" prop="date_time" label="时间"></el-table-column>
                        <el-table-column align="center" prop="game_name" label="玩法"></el-table-column>
                        <el-table-column align="center" prop="room_level" label="场次"></el-table-column>
                        <el-table-column align="center" prop="win_type" label="赢类型"></el-table-column>
                        <el-table-column align="center" prop="event_id" label="剧情ID"></el-table-column>
                        <el-table-column :width="100" align="center" prop="player_rank" label="档位"></el-table-column>
                        <el-table-column :width="100" align="center" prop="start_rank" label="开始档位值"></el-table-column>
                        <el-table-column :width="100" align="center" prop="end_rank" label="结束档位值"></el-table-column>
                        <el-table-column :width="100" align="center" prop="difference_rank" label="档位值差值"></el-table-column>
                        <el-table-column :width="150" align="center" prop="player_give_cannot" label="真人不可提现(赠)"></el-table-column>
                        <el-table-column :width="150" align="center" prop="player_recharge_cannot" label="真人不可提现(充)"></el-table-column>
                        <el-table-column :width="140" align="center" prop="player_give_can" label="真人可提现(赠)"></el-table-column>
                        <el-table-column :width="140" align="center" prop="player_recharge_can" label="真人可提现(充)"></el-table-column>
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
    </div>
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
    .el-form--inline  .el-form-item {
        width: 100%;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data() {
            return {
                col_width: 180,
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                request_url: 'user_gears',
                queryUserId: '',
                querydate: [],
                tableData: [],
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
                let params = { startdate, enddate, page, userId, pageSize: this.pageSize };
                this.gt.httpPost(this.request_url, params).then((response) => {
                    console.log('base data response.data :', response.data);
                    const result = response.data.result;
                    this.tableData = result.tableData;
                    this.page_total = result.page_total;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>