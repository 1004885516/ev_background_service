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
                            <el-col :span="4" style="text-align: left"><span> {{userInfo.withdrawCount}} </span></el-col>
                            <el-col :span="2" style="text-align: right"><span> </span></el-col>
                            <el-col :span="4" style="text-align: left"><span> </span></el-col>
                        </el-row>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card class="box-card" style="width: 100%" shadow="never">
                        <el-row style="margin-bottom: 0px">
                            <el-col :span="9" style="text-align: left">
                                <span style="margin-right: 20px">增减金币(不可提现赠送)</span>
                                <el-input placeholder="请输入金币数" v-model="changeGold" style="width:200px; margin-right: 30px" maxlength="20"></el-input>
                                <el-button type="primary" @click="onChangeGold(1)">确定</el-button>
                            </el-col>
                            <el-col :span="15" style="text-align: left">
                                <span style="margin-right: 20px">修改当前挡位值</span>
                                <el-input placeholder="请输入挡位值" v-model="changeGears" style="width:200px; margin-right: 30px" maxlength="20"></el-input>
                                <el-button type="primary" @click="onChangeGears()">确定</el-button>
                                <span style="font-size: 20px; margin-left: 20px">(实际数值,不要x10000)</span>
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
                <el-row>
                    <el-card class="box-card" style="width: 75%;" shadow="never">
                        <el-row>
                            <span>Rummy调牌</span>
                        </el-row>
                        <el-row>
                            <button type="button" @click='onAddCard(101)' class="card-button card-101"></button>
                            <button type="button" @click='onAddCard(102)' class="card-button card-102"></button>
                            <button type="button" @click='onAddCard(103)' class="card-button card-103"></button>
                            <button type="button" @click='onAddCard(104)' class="card-button card-104"></button>
                            <button type="button" @click='onAddCard(105)' class="card-button card-105"></button>
                            <button type="button" @click='onAddCard(106)' class="card-button card-106"></button>
                            <button type="button" @click='onAddCard(107)' class="card-button card-107"></button>
                            <button type="button" @click='onAddCard(108)' class="card-button card-108"></button>
                            <button type="button" @click='onAddCard(109)' class="card-button card-109"></button>
                            <button type="button" @click='onAddCard(110)' class="card-button card-110"></button>
                            <button type="button" @click='onAddCard(111)' class="card-button card-111"></button>
                            <button type="button" @click='onAddCard(112)' class="card-button card-112"></button>
                            <button type="button" @click='onAddCard(113)' class="card-button card-113"></button>
                        </el-row>
                        <el-row>
                            <button type="button" @click='onAddCard(201)' class="card-button card-201"></button>
                            <button type="button" @click='onAddCard(202)' class="card-button card-202"></button>
                            <button type="button" @click='onAddCard(203)' class="card-button card-203"></button>
                            <button type="button" @click='onAddCard(204)' class="card-button card-204"></button>
                            <button type="button" @click='onAddCard(205)' class="card-button card-205"></button>
                            <button type="button" @click='onAddCard(206)' class="card-button card-206"></button>
                            <button type="button" @click='onAddCard(207)' class="card-button card-207"></button>
                            <button type="button" @click='onAddCard(208)' class="card-button card-208"></button>
                            <button type="button" @click='onAddCard(209)' class="card-button card-209"></button>
                            <button type="button" @click='onAddCard(210)' class="card-button card-210"></button>
                            <button type="button" @click='onAddCard(211)' class="card-button card-211"></button>
                            <button type="button" @click='onAddCard(212)' class="card-button card-212"></button>
                            <button type="button" @click='onAddCard(213)' class="card-button card-213"></button>
                        </el-row>
                        <el-row>
                            <button type="button" @click='onAddCard(301)' class="card-button card-301"></button>
                            <button type="button" @click='onAddCard(302)' class="card-button card-302"></button>
                            <button type="button" @click='onAddCard(303)' class="card-button card-303"></button>
                            <button type="button" @click='onAddCard(304)' class="card-button card-304"></button>
                            <button type="button" @click='onAddCard(305)' class="card-button card-305"></button>
                            <button type="button" @click='onAddCard(306)' class="card-button card-306"></button>
                            <button type="button" @click='onAddCard(307)' class="card-button card-307"></button>
                            <button type="button" @click='onAddCard(308)' class="card-button card-308"></button>
                            <button type="button" @click='onAddCard(309)' class="card-button card-309"></button>
                            <button type="button" @click='onAddCard(310)' class="card-button card-310"></button>
                            <button type="button" @click='onAddCard(311)' class="card-button card-311"></button>
                            <button type="button" @click='onAddCard(312)' class="card-button card-312"></button>
                            <button type="button" @click='onAddCard(313)' class="card-button card-313"></button>
                        </el-row>
                        <el-row>
                            <button type="button" @click='onAddCard(401)' class="card-button card-401"></button>
                            <button type="button" @click='onAddCard(402)' class="card-button card-402"></button>
                            <button type="button" @click='onAddCard(403)' class="card-button card-403"></button>
                            <button type="button" @click='onAddCard(404)' class="card-button card-404"></button>
                            <button type="button" @click='onAddCard(405)' class="card-button card-405"></button>
                            <button type="button" @click='onAddCard(406)' class="card-button card-406"></button>
                            <button type="button" @click='onAddCard(407)' class="card-button card-407"></button>
                            <button type="button" @click='onAddCard(408)' class="card-button card-408"></button>
                            <button type="button" @click='onAddCard(409)' class="card-button card-409"></button>
                            <button type="button" @click='onAddCard(410)' class="card-button card-410"></button>
                            <button type="button" @click='onAddCard(411)' class="card-button card-411"></button>
                            <button type="button" @click='onAddCard(412)' class="card-button card-412"></button>
                            <button type="button" @click='onAddCard(413)' class="card-button card-413"></button>
                            <button type="button" @click='onAddCard(501)' class="card-button card-51"></button>
                            <button type="button" @click='onAddCard(502)' class="card-button card-52"></button>
                        </el-row>
                        <el-row>
                            <el-button type="primary" icon="el-icon-delete" @click="onDeleteCard()">删除一张</el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="onClearCards()">全部删除</el-button>
                        </el-row>
                        <el-row style="margin-top: 20px">
                            <el-col :span="20">
                                <el-input v-model="cards" placeholder="常规牌"></el-input>
                            </el-col>
                            <el-col :span="2" style="margin-left: 20px">
                                <el-input v-model="ghostCard" placeholder="混子"></el-input>
                            </el-col>
                            <el-col :span="2" style="margin-left: 20px">
                                <el-button type="primary" @click="onSetCards()">确定</el-button>
                            </el-col>
                        </el-row>
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
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        methods: {
            onAddCard(card) {
                console.log('card : ', card);
                let inputCards = card.toString();
                let regex = new RegExp(inputCards, 'g');
                let result = this.cards.match(regex);
                let count = result ? result.length : 0;
                if (count >= 2) {
                    this.$message({ message: '每张牌最多添加两次' });
                    return false;
                }
                if (this.cards.length >= 51) {
                    this.$message({ message: '最多13张牌' });
                    return false;
                }
                if (this.cards === '') {
                    this.cards = inputCards;
                } else {
                    this.cards += `,${inputCards}`;
                }
            },
            onDeleteCard() {
                let cards = this.cards;
                if (cards.length > 3) {
                    this.cards = cards.substring(0, cards.length - 4);
                } else {
                    this.cards = '';
                }
            },
            onClearCards() {
                this.cards = '';
            },
            onSetCards() {
                const data = { user_id: this.queryUserId, cards: this.cards, ghost: this.ghostCard };
                this.gt.httpPost('/gm_change_cards', data).then((response) => {
                        const result = response.data.msg;
                        this.$message({ message: `修改${result}` });
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            onQueryUser() {
                const data = { user_id: this.queryUserId };
                this.gt.httpPost('/gm_query_user', data).then((response) => {
                        const result = response.data.result;
                        console.log('result---', result);
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
            onChangeGears() {
                const data = { user_id: this.queryUserId, change_gears: this.changeGears };
                this.gt.httpPost('/gm_change_gears', data).then((response) => {
                    const result = response.data.msg;
                    this.$message({ message: `修改${result}` });
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>