<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>场次额度</strong></h3>
        </el-row>
        
        <el-divider></el-divider>
        <el-row>
            <el-col :span="4">
                <span class="rm-span">基础场次次数 : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="LimitData.BaseInning"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="4">
                <span class="rm-span">场次系数(实际值需要除100): </span>
            </el-col>
            <el-col :span="1" v-for="(item, index) in LimitData.CorrectValue" :key="index">
                <el-input v-model="LimitData.CorrectValue[index]"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="4">
                <span class="rm-span">充值与场次比例(实际值需要除100) : </span>
            </el-col>
            <el-col :span="1">
                <el-input v-model="LimitData.PayInConvert"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-button type="primary" icon="el-icon-upload" @click="saveData()">保存数据</el-button>
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
import EventBus from '@/utils/EventBus.js'
export default {
    data () {
        return {
            request_url: 'ai_session_limit',
            LimitData: { BaseInning: 0, CorrectValue: [ 0, 0, 0 ], PayInConvert: 0 },
        }
    },
    created() {
        EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
    },
    mounted() {
        this.index();
    },
    methods: {
        index() {
            this.gt.httpGet(this.request_url).then((response) => {
                    const result = response.data.result;
                    console.log('httpGet result : ', result);
                    this.LimitData.BaseInning = result.BaseInning;
                    if (result.CorrectValue){
                        this.LimitData.CorrectValue = result.CorrectValue;
                    }
                    this.LimitData.PayInConvert = result.PayInConvert;

                }).catch(function (error) {
                    console.log(error);
                });
        },
        saveData() {
            const data = { data: this.LimitData };
            this.gt.httpPost(this.request_url, data).then((response) => {
                    const result = response.data.msg;
                    this.$message({ message: `保存${result}` });
                }).catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>