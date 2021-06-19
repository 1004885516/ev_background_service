<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>Robot补位</strong></h3>
        </el-row>
        
        <el-divider></el-divider>
        <el-row>
            <el-col :span="1">
                <span class="rm-span">封闭时间(秒) : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.SealOff"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="1">
                <span class="rm-span">进入1 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[0]"></el-input>
            </el-col>
            <el-col :span="1">
                <span class="rm-span">进入2 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[1]"></el-input>
            </el-col>
            <el-col :span="1">
                <span class="rm-span">进入3 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[2]"></el-input>
            </el-col>
            <el-col :span="1">
                <span class="rm-span">进入4 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.EnterRate[3]"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="1">
                <span class="rm-span">离开1 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[0]"></el-input>
            </el-col>
            <el-col :span="1">
                <span class="rm-span">离开2 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[1]"></el-input>
            </el-col>
            <el-col :span="1">
                <span class="rm-span">离开3 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[2]"></el-input>
            </el-col>
            <el-col :span="1">
                <span class="rm-span">离开4 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.LeaveRate[3]"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>

        <el-row :gutter="20" class="mb-20">
            <h3><strong>二人Rummy补位</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">封闭时间(秒) : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.SealOff2User"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">机器人进入概率 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.BE2User"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">机器人补位时间 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="fillingData.ERWaitTime"></el-input>
            </el-col>
            <el-col :span="2">
                <span class="rm-span">机器人离开概率 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="fillingData.LR2User"></el-input>
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
</style>

<script>
export default {
    data () {
        return {
            fillingData: { SealOff: 0, EnterRate: [ 0, 0, 0, 0 ], LeaveRate: [ 0, 0, 0, 0 ], SealOff2User: 0, BE2User: 0, ERWaitTime: 0, LR2User: 0 },
        }
    },
    mounted() {
        this.index();
    },
    methods: {
        index() {
            this.gt.httpGet('/ai_filling').then((response) => {
                    const result = response.data.result;
                    console.log('httpGet result : ', result);
                    this.$set(this.fillingData, 'SealOff', result.SealOff);
                    this.$set(this.fillingData, 'EnterRate', result.EnterRate);
                    this.$set(this.fillingData, 'LeaveRate', result.LeaveRate);

                    this.$set(this.fillingData, 'SealOff2User', result.SealOff2User);
                    this.$set(this.fillingData, 'BE2User', result.BE2User);
                    this.$set(this.fillingData, 'ERWaitTime', result.ERWaitTime);
                    this.$set(this.fillingData, 'LR2User', result.LR2User);
                }).catch(function (error) {
                    console.log(error);
                });
        },
        onNotify() {
            const data = { data: this.fillingData };
            this.gt.httpPost('/ai_filling', data).then((response) => {
                    const result = response.data.msg;
                    this.$message({ message: `保存${result}` });
                }).catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>