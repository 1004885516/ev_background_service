<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>{{title_name}}</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">MediaSource</span>
                    <el-cascader
                        v-model="value"
                        :options="options"
                        @change="handleChange"
                        style="width: 550px;"></el-cascader>
                    <span class="demonstration" style="margin-right: 10px; margin-left: 50px">选择查询日期范围</span>
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
       <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand" label-width="auto">
                                    <el-row>
                                        <el-col :span="4">
                                            <el-form-item label="新增FB未游戏:" label-width="auto"><span>{{ props.row.noGame_fb }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-form-item label="新增手机未游戏:" label-width="auto"><span>{{ props.row.noGame_phone }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-form-item label="新增游客未游戏:" label-width="auto"><span>{{ props.row.noGame_tourist }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="4">
                                            <el-form-item label="新增FB未签到:" label-width="auto"><span>{{ props.row.noSign_fb }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-form-item label="新增手机未签到:" label-width="auto"><span>{{ props.row.noSign_phone }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-form-item label="新增游客未签到:" label-width="auto"><span>{{ props.row.noSign_tourist }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="4">
                                            <el-form-item label="新增FB未转盘:" label-width="auto"><span>{{ props.row.noWheel_fb }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-form-item label="新增手机未转盘:" label-width="auto"><span>{{ props.row.noWheel_ph }}</span></el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-form-item label="新增游客未转盘:" label-width="auto"><span>{{ props.row.noWheel_tourist }}</span></el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column :width="150" align="center" v-for="(item, i) in titleData" :key="i" :prop="item.key" :label="item.name"></el-table-column>
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
        data() {
            return {
                isWidth: true,
                col_width: 150,
                querydate: [],
                title_name: '用户来源',
                request_url: 'active_data',
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                mediasources: '',
                campaignId: '',
                options: [
                    {
                        value: 'all',
                        label: 'all'
                    }
                ],
                value: [],
                tableData: [],
                titleData: [
                    { key: 'create_date',           name: '日期' },
                    { key: 'online_max',            name: '当天最高在线' },
                    { key: 'login_users',           name: '活跃用户数' },
                    { key: 'new_users',             name: '新增注册(总)' },
                    { key: 'new_fb_user',           name: '新增FB注册' },
                    { key: 'new_phone_user',        name: '新增手机注册' },
                    { key: 'new_guest',             name: '新增游客' },
                    { key: 'recharge_users',        name: '充值人数(总)' },
                    { key: 'new_recharge_users',    name: '新增充值人数' },
                    { key: 'rummy_number',          name: 'Rummy场次' },
                    { key: 'user2rummy_number',     name: '2人Rummy场次' },
                    { key: 'teenpatti_number',      name: 'TP场次' },
                    { key: 'speed_teenpatti_number',name: '快速TP场次' },
                    { key: 'relation_number',       name: '练习场' },
                    { key: 'noGame',                name: '新增未游戏(总)' },
                    // { key: 'noGame_fb',             name: '新增FB未游戏' },
                    // { key: 'noGame_phone',          name: '新增手机未游戏' },
                    // { key: 'noGame_tourist',        name: '新增游客未游戏' },
                    { key: 'noSign',                name: '新增未签到' },
                    // { key: 'noSign_fb',             name: '新增FB未签到' },
                    // { key: 'noSign_phone',          name: '新增手机未签到' },
                    // { key: 'noSign_tourist',        name: '新增游客未签到' },
                    { key: 'noWheel_total',         name: '新增未转盘(总)' },
                    // { key: 'noWheel_fb',            name: '新增未转盘(FB)' },
                    // { key: 'noWheel_ph',            name: '新增未转盘(手机)' },
                    // { key: 'noWheel_tourist',       name: '新增未转盘(游客)' }
                ],
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
                this.getOptionMenu();
            })
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
            this.querydate = [startdate, enddate];
            this.getOptionMenu();
        },
        methods: {
            onChangePage(val) {
                this.page = val;
                console.log('base data onChangePage : ', this.page);
                this.search();
            },
            getOptionMenu() {
                const apkId = this.gt.getApkId();
                if (apkId !== this.gd.NoInit) {
                    const startdate = this.gt.transferDate(this.querydate[0]);
                    const enddate = this.gt.transferDate(this.querydate[1]);
                    const params = { apk_id: apkId, startdate, enddate };
                    this.gt.httpPost('/option_menu', params).then((response) => {
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
                    const mediasources = this.value[0];
                    const campaignId = mediasources === 'All' ? 'All' : this.value[1];
                    const page = this.page;
                    let params = { startdate, enddate, page, apkId, mediasources, campaignId, pageSize: this.pageSize };
                    this.gt.httpPost(this.request_url, params).then((response) => {
                        console.log('base data response.data :', response.data);
                        const result = response.data.result.tableData;
                        this.tableData = [];
                        this.page_total = response.data.result.page_total;
                        for (let i = 0; i < result.length; i++) {
                            const item = result[i];
                            this.tableData.push(item);
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }

            },
            handleChange(value) {
                console.log('value------', value)
                // this.apkId = value[0];
                // this.mediasources = value[1];
                // this.campaignId = value[2];
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.search();
            },
        }
    }
</script>
