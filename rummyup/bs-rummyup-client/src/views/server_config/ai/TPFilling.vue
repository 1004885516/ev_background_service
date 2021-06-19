<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>TP机器人补位</strong></h3>
        </el-row>
        <el-tabs type="card"  v-model="activeName" @tab-click="handleClick" style="text-align:center;">
            <el-tab-pane style="padding-right: 500px" v-for="(item, k) in pageData" :key="k" :label="item.Label" :name="item.Name"></el-tab-pane>
        </el-tabs>
        <el-row v-if="curPage == 0">
            <el-col :span="5">
                <span class="rm-span">充值用户进入新房间概率 : </span>
            </el-col>
            <el-col :span="1" >
                <el-input v-model="fillingData.RechargeUserRatio"></el-input>
            </el-col>
        </el-row>
        <el-row v-if="curPage == 0">
            <el-col :span="5">
                <span class="rm-span">充值用户进入预演房间概率 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterConcoct"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="5">
                <span class="rm-span">房间内真人玩家大于等于不匹配机器人 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.MisRobot"></el-input>
            </el-col>
        </el-row>
        <el-row v-if="curPage == 1">
            <el-col :span="5">
                <span class="rm-span">非充值用户进入预演房间概率 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterConcoct"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">封闭时间(秒) : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.SealOff"></el-input>
            </el-col>
            <el-col :span="3">
                <span class="rm-span">开始加入机器人时间 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.JoinRobotTime"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">进入1 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[0]"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">进入2 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[1]"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">进入3 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[2]"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">进入4 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[3]"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">离开1 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[0]"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">离开2 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[1]"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">离开3 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[2]"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">离开4 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[3]"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-button type="primary" icon="el-icon-upload" @click="onNotify()">保存数据</el-button>
        </el-row>
    </el-card>
</template>

<style>
    .el-col {
        text-align: center;
        margin-right: 20px;
    }
    .rm-span {/* 右对齐, 上下居中 */
        float: right;
        line-height: 40px;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__nav {
        margin-left: 550px;
    }
</style>

<script>
export default {
    data () {
        return {
            activeName: 'rechargeRoom',
            curPage: 0,
            pageData: [
                { Label: '充值房间', Name: 'rechargeRoom' },
                { Label: '非充值房间', Name: 'NoRechargeRoom' }
            ],
            fillingData: { Page: 0, SealOff: 0, EnterRate: [ 0, 0, 0, 0 ], LeaveRate: [ 0, 0, 0, 0 ], JoinRobotTime: 0, RechargeUserRatio: 0, MisRobot: 0, EnterConcoct: 0 },
        }
    },
    mounted() {
        this.index();
    },
    methods: {
        index() {
            this.gt.httpGet('/ai_filling_tp').then((response) => {
                const result = response.data.result;
                const pageData = result[this.curPage];
                if (pageData){
                    this.$set(this.fillingData, 'SealOff', pageData.SealOff);
                    this.$set(this.fillingData, 'EnterRate', pageData.EnterRate);
                    this.$set(this.fillingData, 'LeaveRate', pageData.LeaveRate);
                    this.$set(this.fillingData, 'JoinRobotTime', pageData.JoinRobotTime);
                    this.$set(this.fillingData, 'RechargeUserRatio', pageData.RechargeUserRatio);
                    this.$set(this.fillingData, 'MisRobot', pageData.MisRobot);
                    this.$set(this.fillingData, 'EnterConcoct', pageData.EnterConcoct);
                } else {
                    this.fillingData = { Page: 0, SealOff: 0, EnterRate: [ 0, 0, 0, 0 ], LeaveRate: [ 0, 0, 0, 0 ], JoinRobotTime: 0, RechargeUserRatio: 0, MisRobot: 0 }
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        onNotify() {
            const data = { data: this.fillingData };
            data.data.Page = this.curPage;
            this.gt.httpPost('/ai_filling_tp', data).then((response) => {
                const result = response.data.msg;
                this.$message({ message: `保存${result}` });
            }).catch(function (error) {
                console.log(error);
            });
        },
        handleClick(tab, event) {
            console.log('base upload handleClick : ', tab.index, event);
            this.curPage = tab.index;
            this.index();
        },
    }
}
</script>