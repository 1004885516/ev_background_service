<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>充值模板(失败)</strong></h3>
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
        </el-card>
        <el-row style="margin-top: 30px">
            <el-button type="primary" icon="el-icon-message" @click="onSend()">保存数据</el-button>
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
            request_url: 'recharge_mail',
            tableData: {
                EnMailTitle: '',
                EnMailContent: '',
                InMailTitle: '',
                InMailContent: '',
                Type: 1 // 表示充值失败
            }
        }
    },
    created() {
        EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
    },
    mounted() {
        this.index();
    },
    methods: {
        onSend() {
            this.gt.httpPost(this.request_url, this.tableData).then((response) => {
                if (response.data.status === 200) {
                    const msg = response.data.msg;
                    this.$message({ message: `发送${msg}` });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        index() {
            this.gt.httpGet(this.request_url).then((response) => {
                const result = response.data.result;
                console.log('httpGet result.data : ', result.data);
                const data = result.data;
                const tableData = data.find(item => {
                    return item.Type === 1;
                })
                if (tableData){
                    this.tableData = tableData;
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
    }
}
</script>