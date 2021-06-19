<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>用户管理</strong></h3>
        </el-row>
        <el-row>
            <el-card class="box-card" shadow="never">
                <span class="demonstration" style="margin-right: 10px">查询用户</span>
                <el-input placeholder="请输入用户ID" v-model="queryUserId" style="width:200px; margin-right: 30px" autocomplete="on"
                    onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="8">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button type="primary" icon="el-icon-search" @click="onQueryUser()">搜索</el-button>
            </el-card>
        </el-row>
        <template v-if="isShowUserInfo">
            <template v-if="isHasUser">
                <el-row>
                    <el-card class="box-card" style="width: 100%" shadow="never">
                        <el-row>
                            <el-col :span="2" style="text-align: right"><span>用户ID :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.UserId }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>昵称 :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.NickName }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>注册时间 :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.RegTime }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>登录时间 :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.LoginTime }}</span></el-col>
                        </el-row>
                        <el-row style="margin-top: 30px">
                            <el-col :span="2" style="text-align: right"><span>PackageId :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.PackageId }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>ApkId :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.ApkId }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>MediaSource :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.MediaSource }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>Campaign :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.Campaign }}</span></el-col>
                        </el-row>
                        <el-row style="margin-top: 30px">
                            <el-col :span="2" style="text-align: right"><span>FB :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.FbId }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>Phone :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.Phone }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>总充值 :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.TotalPayIn }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>总提现 :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.TotalPayOut }}</span></el-col>
                        </el-row>
                        <el-row style="margin-top: 30px">
                            <el-col :span="2" style="text-align: right"><span>不可提(赠) :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.Gold }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>不可提(充) :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.PayGold }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>可提(赠) :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.WinGold }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>可提(充) :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.PayWinGold }}</span></el-col>
                        </el-row>
                        <el-row style="margin-top: 30px">
                            <el-col :span="2" style="text-align: right"><span>是否删除 :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.IsDelete }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>BindUser :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.BindUser }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>AfStatus :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.AfStatus }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>DeviceId :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.DeviceId }}</span></el-col>
                        </el-row>
                        <el-row style="margin-top: 30px">
                            <el-col :span="2" style="text-align: right"><span>用户类型 :</span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{ userInfo.userType }}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>金币(Robot): </span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{userInfo.RobotGold}}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span>提现成功次数: </span></el-col>
                            <el-col :span="4" style="text-align: left"><span>{{userInfo.withdrawCount}}</span></el-col>
                            <el-col :span="2" style="text-align: right"><span> </span></el-col>
                            <el-col :span="4" style="text-align: left"><span> </span></el-col>
                        </el-row>
                    </el-card>
                </el-row>
                <el-row v-if="userlevel > 2">
                    <el-card class="box-card" style="width: 75%" shadow="never">
                        <el-row style="margin-bottom: 0px">
                            <el-col :span="24" style="text-align: left">
                                <span style="margin-right: 20px">增减金币(不可提现赠送)</span>
                                <el-input placeholder="请输入金币数" v-model="changeGold" style="width:200px; margin-right: 30px" maxlength="20"></el-input>
                                <el-button type="primary" @click="onChangeGold(1)">确定</el-button>
                            </el-col>
                        </el-row>
                        <!-- <el-row style="margin-bottom: 0px">
                            <el-col :span="24" style="text-align: left">
                                <span style="margin-right: 20px">增减金币(不可提现充值)</span>
                                <el-input placeholder="请输入金币数" v-model="changeGoldR" style="width:200px; margin-right: 30px" maxlength="20"></el-input>
                                <el-button type="primary" @click="onChangeGold(2)">确定</el-button>
                            </el-col>
                        </el-row> -->
                    </el-card>
                </el-row>
            </template>
            <template v-else>
                <el-card>
                    <span>无此用户</span>
                </el-card>
            </template>
        </template>
    </el-card>
</template>

<style>
    .el-row {
        margin-bottom: 0px;
    }
    .el-card {
        margin-top: 20px;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    import { getUser } from '@/utils/Cookies.js'
    export default {
        data () {
            return {
                isShowUserInfo: false,
                isHasUser: false,
                changeGold: 0, // 增减金币(不可提现赠送)
                changeGoldR: 0, // 增减金币(不可提现充值)
                changeGears: 0, // 当前挡位值
                queryUserId: '',// 查询用户ID
                cards: '',
                ghostCard: '',
                userInfo: {},
                userlevel: 0,
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        mounted() {
            this.userlevel = JSON.parse(getUser()).level;
        },
        methods: {
            onQueryUser() {
                const data = { user_id: this.queryUserId };
                this.gt.httpPost('/gm_query_user', data).then((response) => {
                        const result = response.data.result;
                        this.isShowUserInfo = true;
                        this.isHasUser = result.UserInfo ? true : false;
                        if (this.isHasUser) {
                            for (const key in result.UserInfo) {
                                if (Object.hasOwnProperty.call(result.UserInfo, key)) {
                                    const ele = result.UserInfo[key];
                                    this.$set(this.userInfo, key, ele);
                                }
                            }
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            onChangeGold(type) {
                const data = { user_id: this.queryUserId, type };
                if (type === 1) {
                    data.change_gold = this.changeGold;
                } else if (type === 2) {
                    data.change_gold = this.changeGoldR;
                }
                this.gt.httpPost('/gm_change_gold', data).then((response) => {
                    const result = response.data.msg;
                    this.$message({ message: `修改${result}` });
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>