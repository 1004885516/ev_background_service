<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{ title_name }}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">MediaSource</span>
                    <el-cascader
                        v-model="value"
                        :options="options"
                        style="width: 535px"
                        @change="handleChange">
                    </el-cascader>
                    <span class="demonstration" style="margin-right: 10px; margin-left: 10px">用户类型</span>
                    <el-select v-model="optionSelect" placeholder="用户类型" style=" width: 140px">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px; margin-left: 30px">选择查询日期范围</span>
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
                        <el-table-column width="200" align="center" prop="CreateDate" label="日期"></el-table-column>
                        <el-table-column v-if="this.optionSelect === 0" width="150" align="center" prop="NewUsers" label="新增"></el-table-column>
                        <el-table-column v-else-if="this.optionSelect === 1" width="150" align="center" prop="NewUsers" label="活跃"></el-table-column>
                        <el-table-column v-else width="150" align="center" prop="NewUsers" label="活跃(付费)"></el-table-column>
                        <el-table-column width="150" align="center" prop="RR2" label="RR2"></el-table-column>
                        <el-table-column width="150" align="center" prop="RR3" label="RR3"></el-table-column>
                        <el-table-column width="150" align="center" prop="RR7" label="RR7"></el-table-column>
                        <el-table-column width="150" align="center" prop="RR15" label="RR15"></el-table-column>
                        <el-table-column width="150" align="center" prop="RR30" label="RR30"></el-table-column>
                        <el-table-column width="300" align="center" prop="MediaSource" label="MediaSource"></el-table-column>
                        <el-table-column align="center" prop="Campaign" label="Campaign"></el-table-column>
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
                isWidth: false,
                col_width: 150,
                querydate: [],
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                title_name: '用户留存',
                request_url: '/user_keep',
                value: [],
                options: [],
                tableData: [],
                typeOptions: [
                    { value: 0, label: '新增用户' },
                    { value: 1, label: '活跃用户' },
                    { value: 2, label: '付费活跃用户' },
                ],
                optionSelect: 0,
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
                // this.search();
                // this.updateApkId();
                this.updateMediaSource();
            })
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
            this.querydate = [startdate, enddate];
            this.updateMediaSource();
            // this.search();
        },
        methods: {
            handleChange(value) {
                console.log('value : ', value);
            },
            async dateHandleChange(value) {
                const startdate = this.gt.transferDate(value[0]);
                const enddate = this.gt.transferDate(value[1]);
                this.querydate = [startdate, enddate];
                await this.updateMediaSource();
            },
            async updateMediaSource() {
                const apkId = this.gt.getApkId();
                if (apkId !== this.gd.NoInit) {
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    const params = { apk_id: apkId, startdate, enddate };
                    this.gt.httpPost('/user_keep_mediasource', params).then((response) => {
                            console.log('response.data :', response.data);
                            const MediaSources = response.data.result.MediaSources;
                            this.options = [];
                            this.value = [];
                            if (MediaSources && MediaSources.length > 0) {
                                for (let i = 0; i < MediaSources.length; i++) {
                                    const item = MediaSources[i];
                                    let data = { value: item.MediaSource, label: item.MediaSource };
                                    if (item.Campaigns) {
                                        data.children = [];
                                        for (let j = 0; j < item.Campaigns.length; j++) {
                                            const campaign = item.Campaigns[j];
                                            data.children.push({ value: campaign, label: campaign })
                                        }
                                    }
                                    this.options.push(data);
                                }
                                if (this.options.length > 0) {
                                    this.value = [ 'All' ];
                                }
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                }
            },
            search() {
                const apkId = this.gt.getApkId();
                if (apkId === this.gd.NoInit) {
                    console.log('未初始化完成渠道包信息,等待完成');
                } else if (this.value.length === 0) {
                    this.$message({ message: '没有MediaSource' });
                } else {
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    const media_source = this.value[0];
                    const campaign = media_source === 'All' ? 'All' : this.value[1];
                    let params = { apk_id: apkId, media_source, campaign, startdate, enddate, page: this.page, pageSize: this.pageSize, user_type: this.optionSelect };
                    this.gt.httpPost(this.request_url, params).then((response) => {
                            console.log('response.data :', JSON.stringify(response.data));
                            const result = response.data.result;
                            this.tableData = [];
                            for (let i = 0; i < result.tableData.length; i++) {
                                const data = result.tableData[i];
                                data.RR2 = this.gt.signFigures((data.ActiveUsers2 / data.NewUsers).toFixed(4) * 100) + '%';
                                data.RR3 = this.gt.signFigures((data.ActiveUsers3 / data.NewUsers).toFixed(4) * 100) + '%';
                                data.RR7 = this.gt.signFigures((data.ActiveUsers7 / data.NewUsers).toFixed(4) * 100) + '%';
                                data.RR15 = this.gt.signFigures((data.ActiveUsers15 / data.NewUsers).toFixed(4) * 100) + '%';
                                data.RR30 = this.gt.signFigures((data.ActiveUsers30 / data.NewUsers).toFixed(4) * 100) + '%';
                                if (media_source === 'All') {
                                    data.MediaSource = 'All';
                                }
                                if (campaign === 'All') {
                                    data.Campaign = 'All';
                                }
                                this.tableData.push(data);
                            }
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