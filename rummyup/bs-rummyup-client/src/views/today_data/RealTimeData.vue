<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>实时数据(今日-用户)</strong></h3>
        </el-row>
        <el-row>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>新增</h5>
                    <h1>{{newRegister}}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>活跃</h5>
                    <h1>{{ todayActive }}</h1>
                </el-card>
            </el-col>
            <!-- <el-col :span="4">
                <el-card class="box-card">
                    <h5>总场次</h5>
                    <h1>{{ todaySessiontotal }}</h1>
                </el-card>
            </el-col> -->
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>总在线</h5>
                    <h1>{{ online.hall + online.game }}</h1>
                </el-card>
            </el-col>
             <el-col :span="4">
                <el-card class="box-card">
                    <h5>最高在线</h5>
                    <h1>{{ onlineMax }}</h1>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>累计用户</h5>
                    <h1>{{ totalUsers }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>大厅在线</h5>
                    <h1>{{ online.hall }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>游戏在线</h5>
                    <h1>{{ online.game }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4" v-if="userlevel === 3">
                <el-card class="box-card">
                    <h5>金币池数值</h5>
                    <h1>{{ goldPool }}</h1>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<style>
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
    }
    .span {
        text-align: center;
        display:block;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    import { getUser } from '@/utils/Cookies.js'
    export default {
        name: 'RealTimeData',
        data () {
            return {
                online: 0,
                todayActive: 0,
                totalUsers: 0,
                todaySession: { rummy: 0, teenpatti: 0 },
                onlineMax: 0,
                newRegister: 0,
                userlevel: 0,
                goldPool: 0
                // todaySessiontotal: 0
            }
        },
        created () {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        beforeDestroy () {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted () {
            this.userlevel = JSON.parse(getUser()).level;
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                console.log('on change package id : ', this.gt.getApkId());
            })
            this.getData();
        },
        methods: {
            getData() {
                this.gt.httpGet('/realtime_data', { type: 1 }).then((response) => {
                    const result = response.data.result;
                    console.log('result', result);
                    this.online = result.online;
                    this.todaySession = result.todaySession;
                    this.todayActive = result.todayActive;
                    this.totalUsers = result.totalUsers;
                    this.onlineMax = result.onlineMax;
                    this.newRegister = result.newRegister;
                    this.goldPool = result.goldPool;
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
</script>