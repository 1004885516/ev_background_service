<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>事件数据</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">版本选择</span>
                    <el-select v-model="packageSelect" placeholder="版本选择" style="margin-right: 50px" @change="handleChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                    </el-select>
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
    .span {
        text-align: center;
        display:block;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data() {
            return {
                request_url: '/event_data',
                baseData: [],
                TPBaseData: [],
                clickLogin: [],
                loginSuccess: [],
                loginFail: [],
                locationNo: [],
                options: [{ value: this.gd.All, label: this.gd.All }],
                packageSelect: this.gd.All,
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
                this.getData();
                this.updateApkId();
            })
            this.updateApkId();
            this.getData();
        },
        methods: {
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
            getData(package_id) {
                const apkId = this.gt.getApkId();
                if (apkId === this.gd.NoInit) {
                    console.log('未初始化完成渠道包信息,等待完成');
                } else {
                    this.gt.httpPost(this.request_url, { apk_id: apkId, package_id: package_id ? package_id : this.packageSelect }).then((response) => {
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
            handleChange(value) {
                this.getData(value);
            },
        }
    }
</script>