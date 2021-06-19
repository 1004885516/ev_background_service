<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>发送系统邮件</strong></h3>
        </el-row>
        <el-card class="box-card" shadow="never">
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">英文标题 : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="tableData.EnMailTitle" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">英文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.EnMailContent"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">印地文标题 : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="tableData.InMailTitle" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">印地文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.InMailContent"></el-input>
                </el-col>
            </el-row>
            <el-row style="display: none">
                <el-col :span="2">
                    <span class="rm-span">Rummy金币 : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="tableData.RummyGold"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">赠送金币 : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="tableData.TeenPattiGold"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">类型 : </span>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="tableData.Continued" placeholder="0注册小于发邮件时间可领,1没删除时,上线可收到"></el-input>
                </el-col>
            </el-row>
        </el-card>
        <el-row style="margin-top: 30px">
            <el-button type="primary" icon="el-icon-message" @click="onSend()">发送邮件</el-button>
        </el-row>
    </el-card>
</template>

<style scoped>
    .el-row {
        margin-top: 20px;
    }
</style>


<script>
import EventBus from '@/utils/EventBus.js'
export default {
    data () {
        return {
            tableData: {
                EnMailTitle: '',
                EnMailContent: '',
                InMailTitle: '',
                InMailContent: '',
                RummyGold: 0,
                TeenPattiGold: 0,
                Continued: '',
            }
        }
    },
    created() {
        EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
    },
    methods: {
        onSend() {
            this.gt.httpPost('/send_system_mail', this.tableData).then((response) => {
                if (response.data.status === 200) {
                    const msg = response.data.msg;
                    this.$message({ message: `发送${msg}` });
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>