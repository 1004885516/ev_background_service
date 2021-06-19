<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>余额弹窗</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="1">
                <span class="rm-span">低于 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="MinLimit"></el-input>
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
            request_url: 'balance_pop_up',
            MinLimit: 0,
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
                    this.MinLimit = result.data.MinLimit;
                }).catch(function (error) {
                    console.log(error);
                });
        },
        saveData() {
            const data = { MinLimit: this.MinLimit };
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