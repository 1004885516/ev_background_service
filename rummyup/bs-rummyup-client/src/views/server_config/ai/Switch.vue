<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>控牌开关</strong></h3>
        </el-row>
        <el-row>
            <el-col :span="9" style="margin-right: 50px">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>Rummy(0开,1关)</span>
                    </div>
                    <el-row style="margin: 0px">
                        <el-col :span="12" style="margin-right: 0px">
                            <el-card class="box-card" shadow="never" style="margin-bottom: 20px;">
                                <div slot="header" class="clearfix">
                                    <span>真人</span>
                                </div>
                                <el-row v-for="(value, i) in switchData[0].PlayerOnoff" :key="i" type="flex" justify="center" style="margin-bottom: 10px; margin-top: 10px;">
                                    <el-col :span="6">
                                        <span>{{ i }}档</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-switch v-model="switchData[0].PlayerOnoff[i]" :active-value="0" :inactive-value="1" active-text="开启(0)" inactive-text="关闭(1)"></el-switch>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                        <el-col :span="12" style="margin-right: 0px">
                            <el-card class="box-card" shadow="never" style="margin-right: 0px">
                                <div slot="header" class="clearfix">
                                    <span>机器人</span>
                                </div>
                                <el-row v-for="(value, i) in switchData[0].RobotOnoff" :key="i" type="flex" justify="center" style="margin-bottom: 10px; margin-top: 10px;">
                                    <el-col :span="6">
                                        <span>{{ i }}档</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-switch v-model="switchData[0].RobotOnoff[i]" :active-value="0" :inactive-value="1" active-text="开启(0)" inactive-text="关闭(1)"></el-switch>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" style="margin: 0px">
                        <el-button type="primary" icon="el-icon-upload" @click="onNotify(0)">保存数据</el-button>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="9">
                <el-card class="box-card" shadow="never">
                    <div slot="header" class="clearfix">
                        <span>TeenPatti(0开,1关)</span>
                    </div>
                    <el-row style="margin: 0px">
                        <el-col :span="12" style="margin-right: 0px">
                            <el-card class="box-card" shadow="never" style="margin-bottom: 20px;">
                                <div slot="header" class="clearfix">
                                    <span>真人</span>
                                </div>
                                <el-row v-for="(value, i) in switchData[1].PlayerOnoff" :key="i" type="flex" justify="center" style="margin-bottom: 10px; margin-top: 10px;">
                                    <el-col :span="6">
                                        <span>{{ i }}档</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-switch v-model="switchData[1].PlayerOnoff[i]" :active-value="0" :inactive-value="1" active-text="开启(0)" inactive-text="关闭(1)"></el-switch>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                        <el-col :span="12" style="margin-right: 0px">
                            <el-card class="box-card" shadow="never" style="margin-right: 0px">
                                <div slot="header" class="clearfix">
                                    <span>机器人</span>
                                </div>
                                <el-row v-for="(value, i) in switchData[1].RobotOnoff" :key="i" type="flex" justify="center" style="margin-bottom: 10px; margin-top: 10px;">
                                    <el-col :span="6">
                                        <span>{{ i }}档</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-switch v-model="switchData[1].RobotOnoff[i]" :active-value="0" :inactive-value="1" active-text="开启(0)" inactive-text="关闭(1)"></el-switch>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center" style="margin: 0px">
                        <el-button type="primary" icon="el-icon-upload" @click="onNotify(1)">保存数据</el-button>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        
    </el-card>
</template>

<style>
    .el-col {
        text-align: center;
    }
    .el-switch {
        height: 40px;
    }
</style>

<script>
export default {
    data () {
        return {
            switchData: [
                { PlayerOnoff: [ 1, 1, 1, 1, 1 ], RobotOnoff: [ 1, 1, 1, 1, 1 ], Type: 0 },
                { PlayerOnoff: [ 1, 1, 1, 1, 1 ], RobotOnoff: [ 1, 1, 1, 1, 1 ], Type: 1 }
            ]
        }
    },
    mounted() {
        this.index();
    },
    methods: {
        index() {
            this.gt.httpGet('/ai_switch').then((response) => {
                    const result = response.data.result;
                    console.log('httpGet result : ', result);
                    this.switchData = [];
                    for (let i = 0; i < result.length; i++) {
                        const data = result[i];
                        this.switchData.push(data);
                    }
                }).catch(function (error) {
                    console.log(error);
                });
        },
        onNotify(type) {
            const data = { data: this.switchData, type };
            this.gt.httpPost('/ai_switch', data).then((response) => {
                    const result = response.data.msg;
                    this.$message({ message: `保存${result}` });
                }).catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>