<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>分包数据</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">版本选择</span>
                    <el-select v-model="packageSelect" placeholder="版本选择" style="margin-right: 50px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 30px">选择查询日期</span>
                    <el-date-picker
                        v-model="querydate"
                        :clearable="false"
                        :editable="false"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">点击登录按钮</span>
                    <el-table :data="clickLogin" style="100%">
                        <el-table-column align="center" prop="name" label="名称"></el-table-column>
                        <el-table-column align="center" prop="data" label="值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">成功登录大厅</span>
                    <el-table :data="loginSuccess" style="100%">
                        <el-table-column align="center" prop="name" label="名称"></el-table-column>
                        <el-table-column align="center" prop="data" label="值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">登录失败</span>
                    <el-table :data="loginFail" style="100%">
                        <el-table-column align="center" prop="name" label="名称"></el-table-column>
                        <el-table-column align="center" prop="data" label="值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">定位不允许</span>
                    <el-table :data="locationNo" style="100%">
                        <el-table-column align="center" prop="name" label="名称"></el-table-column>
                        <el-table-column align="center" prop="data" label="值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">数据统计</span>
                    <el-table :data="baseData" style="100%">
                        <el-table-column align="center" prop="name" label="名称"></el-table-column>
                        <el-table-column align="center" prop="data" label="值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
             <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">TP数据统计</span>
                    <el-table :data="TPBaseData" style="100%">
                        <el-table-column align="center" prop="name" label="名称"></el-table-column>
                        <el-table-column align="center" prop="data" label="值"></el-table-column>
                    </el-table>
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
                querydate: '',
                baseData: [],
                TPBaseData: [],
                clickLogin: [],
                loginSuccess: [],
                loginFail: [],
                locationNo: [],
                packageSelect: this.gd.All,
                options: [{ value: this.gd.All, label: this.gd.All }],
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
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, true);
        },
        beforeDestroy () {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted () {
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                console.log('on change package id : ', this.gt.getApkId());
                this.updateApkId();
                this.search();
            });
            this.updateApkId();
            this.querydate = this.gt.getTodaySymbol();
            this.search();
        },
        methods: {
            search() {
                const apkId = this.gt.getApkId();
                if (apkId === this.gd.NoInit) {
                    console.log('未初始化完成渠道包信息,等待完成');
                } else {
                    console.log('event data init data.');
                    const date = this.gt.transferDate(this.querydate);
                    this.gt.httpPost('/package_data', { apk_id: apkId, package_id: this.packageSelect, date }).then((response) => {
                        console.log('response.data :', response.data);
                        const result = response.data.result;
                        this.baseData = result.baseData;
                        this.clickLogin = result.clickLogin;
                        this.loginSuccess = result.loginSuccess;
                        this.loginFail = result.loginFail;
                        this.locationNo = result.locationNo;
                        this.TPBaseData = result.TPBaseData;
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            updateApkId() {
                const apkId = this.gt.getApkId();
                if (apkId !== this.gd.NoInit) {
                    this.options = [];
                    this.options.push({ value: this.gd.All, label: this.gd.All });
                    const packageIds = this.gt.getPackageIds();
                    for (let i = 0; i < packageIds.length; i++) {
                        const ele = packageIds[i];
                        this.options.push({ value: ele, label: ele });
                    }
                    this.packageSelect = this.gd.All;
                }
            },
        }
    }
</script>