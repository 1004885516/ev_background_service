<template>
    <el-row>
        <el-col :span="12" class="left-show">
            <span style="margin-right: 20px">{{ channel_id }}</span>
            <el-cascader v-show="isShow" v-model="selectValue" :options="options" @change="handleChange"></el-cascader>
        </el-col>
        <el-col :span="12" class="right-show">
            <span style="margin-right: 100px">{{ mode }}</span>
            <span style="margin-right: 20px">{{ name }}</span>
            <el-dropdown>
                <i class="el-icon-setting" style="margin-right: 30px"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>查看</el-dropdown-item>
                    <el-dropdown-item>新增</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
</template>

<style>
    .el-header {
        background-color: #ffffff;
        line-height: 60px;
        width: 100%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .left-show {
        text-align: left !important;
    }
    .right-show {
        text-align: right !important;
    }
    .el-row {
        display:flex;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    import { getUser } from '@/utils/Cookies.js'
    export default {
        data() {
            return {
                channel_id: this.gd.ChannelId,
                isShow: true,
                selectValue: '',
                options: [],
                name: 'aaa',
                mode: `${process.env.NODE_ENV}(${process.env.VUE_APP_REQUEST_URL})`,
            };
        },
        beforeDestroy () {
            EventBus.$off(this.gd.EventId.CHANNEL_APK_VISIBLE);
            EventBus.$off(this.gd.EventId.UPDATE_APK_ID);
        },
        created() {
            this.queryChannelPackage();
            
            // console.log('this : ', this.$route);
            this.checkShowChannelSelect();

            EventBus.$on(this.gd.EventId.CHANNEL_APK_VISIBLE, (isShow) => {
                console.log('on channel package visible : ', isShow);
                this.isShow = isShow;
            });

            EventBus.$on(this.gd.EventId.UPDATE_APK_ID, () => {
                this.queryChannelPackage();
            });
        },
        mounted() {
            const data = getUser();
            const user = JSON.parse(data);
            this.name = user.userName;
        },
        methods: {
            checkShowChannelSelect() {
                const path = this.$route.path;
                if (path === this.gd.RoutePath.RealTime_Data || path === this.gd.RoutePath.Active_Data
                || path === this.gd.RoutePath.Session_Data) {
                    this.isShow = false;
                } else {
                    this.isShow = true;
                }
            },
            handleChange(value) {
                console.log('event emit name : ' + this.$route.name + ', value : ' + value[0]);
                console.log(this.$route.name);
                this.gt.setApkId(value[0]);
                EventBus.$emit(this.gd.EventId.CHANGE_APK_ID);
            },
            queryChannelPackage() {
                this.gt.httpGet('/channel_package').then((response) => {
                    if (!response.data.result) {
                        this.$message({ message: '无数据返回' });
                        return false;
                    }
                    this.options = [];
                    this.gt.clearPackageIds();
                    for (let i = 0; i < response.data.result.length; i++) {
                        const data = response.data.result[i];
                        this.gt.addPackageId(data.apk_id, data.package_id);
                        if (i === 0) {
                            this.selectValue = data.apk_id;
                        }
                    }
                    const packageIds = this.gt.getPackageIdsByAll();
                    for (const key in packageIds) {
                        let item = { value: key, label: key };
                        this.options.push(item);
                    }
                    this.gt.setApkId(this.selectValue);
                    
                    EventBus.$emit(this.gd.EventId.CHANGE_APK_ID);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
    };
</script>