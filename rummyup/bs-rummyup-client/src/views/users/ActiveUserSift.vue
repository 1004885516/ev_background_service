<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>排行榜</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">查询参数</span>
                    <el-select v-model="optionSelect" placeholder="查询参数" style="margin-right: 50px">
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
                    <el-button type="primary" icon="el-icon-search" @click.native="resetSearch()">查询</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card" shadow="never">
                    <el-table :data="tableData" style="width: 100%" border>
                        <el-table-column align="center" type="expand">
                            <!---------- el-form-item中使用label-width="auto"属性则el-form也得用，否则会报错。或者都不用，用:span控制宽度即可 ----------->
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-row>
                                        <el-col :span="7" style="margin-right: 0px">
                                            <el-form-item label="RegTime:" ><span>{{ props.row.RegTime }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="LoginTime:" ><span>{{ props.row.LoginTime }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="9" style="margin-right: 0px">
                                            <el-form-item label="FbId:" ><span>{{ props.row.FbId }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="FbBusiToken:" ><span>{{ props.row.FbBusinessToken }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="7" style="margin-right: 0px">
                                            <el-form-item label="Phone:" ><span>{{ props.row.Phone }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="BindUser:" ><span>{{ props.row.BindUser }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="9" style="margin-right: 0px">
                                            <el-form-item label="Campaign:" ><span>{{ props.row.Campaign }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="MediaSource:" ><span>{{ props.row.MediaSource }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="7" style="margin-right: 0px">
                                            <el-form-item label="DeviceId:" ><span>{{ props.row.DeviceId }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="AfStatus:" ><span>{{ props.row.AfStatus }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="9" style="margin-right: 0px">
                                            <el-form-item label="FirstPay:" ><span>{{ props.row.FirstPay }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="6" style="margin-right: 0px">
                                            <el-form-item label="isDelete:" ><span>{{ props.row.isDelete }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="UserId" label="用户ID"></el-table-column>
                        <el-table-column :width="310" align="center" prop="Account" label="账号"></el-table-column>
                        <el-table-column :width="180" align="center" prop="NickName" label="昵称"></el-table-column>
                        <el-table-column align="center" prop="WinGold" label="金币(可提现赠)"></el-table-column>
                        <el-table-column align="center" prop="Gold" label="金币(不可提现赠)"></el-table-column>
                        <el-table-column align="center" prop="PayWinGold" label="金币(可提现充)"></el-table-column>
                        <el-table-column align="center" prop="PayGold" label="金币(不可提现充)"></el-table-column>
                        <el-table-column align="center" prop="RobotGold" label="金币(RobotGold)"></el-table-column>
                        <el-table-column :width="80" align="center" prop="TotalPayIn" label="总充值"></el-table-column>
                        <el-table-column :width="80" align="center" prop="TotalPayOut" label="总提现"></el-table-column>
                        <el-table-column align="center" prop="ApkId" label="ApkId"></el-table-column>
                        <el-table-column align="center" prop="PackageId" label="PackageId"></el-table-column>
                        <el-table-column v-if="isShowTotal === true" align="center" prop="TotalSession" label="TotalSession"></el-table-column>
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
    .el-form-item {
        width: 100%;
        text-align: left;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                request_url: '/active_user_sift',
                querydate: '',
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                tableData: [],
                isShowTotal: false,
                options: [
                    { value: 1, label: '总金币最多' },
                    { value: 2, label: '档位金币最多' },
                    { value: 3, label: '可提现最多' },
                    { value: 4, label: '不可提现最多' },
                    { value: 5, label: '充值最多' },
                    { value: 6, label: '提现最多' },
                    { value: 0, label: '最近活跃' },
                    { value: 7, label: 'TeenPatti场次最多' },
                    { value: 8, label: 'Rummy场次最多' },
                    { value: 9, label: 'Rummy2User场次最多' },
                    { value: 10, label: 'QuickTP场次最多' },
                    { value: 11, label: 'Ak47场次最多' },
                    { value: 12, label: 'LowestJoker场次最多' },
                    { value: 13, label: 'HighestJoker场次最多' },
                ],
                optionSelect: 1,
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, true);
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
                    let params = { apk_id: apkId, startdate, enddate, page: this.page, queryType: this.optionSelect, pageSize: this.pageSize };
                    this.gt.httpPost(this.request_url, params).then((response) => {
                        const result = response.data.result;
                        this.page = result.page;
                        this.page_total = result.page_total;
                        this.tableData = [];
                        for (let i = 0; i < result.tableData.length; i++) {
                            const item = result.tableData[i];
                            console.log('item : ', JSON.stringify(item));
                            this.tableData.push(item);
                        }
                        if (this.optionSelect > 6 && this.optionSelect < 14) {
                            this.isShowTotal = true;
                        } else {
                            this.isShowTotal = false;
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }
        }
    }
</script>