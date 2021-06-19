<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>更新配置</strong></h3>
        </el-row>
        
        <el-card class="box-card" shadow="never">
            <el-row>
                <el-col :span="3">
                    <el-select style="margin-left: 60px;" v-model="otpSelect" placeholder="渠道选择">
                        <el-option v-for="item in otpOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="1" style="margin-left: 10px;">
                    <el-button type="primary" @click="setConfig()">设置</el-button>
                </el-col>
            </el-row>
        </el-card>
    </el-card>
</template>

<style scoped>
    .el-col {
        text-align: left;
        margin-right: 20px;
    }
    .rm-span {/* 右对齐, 上下居中 */
        float: right;
        line-height: 40px;
    }
    .h-textarea {
        height: 40px;
        min-height: 40px;
        line-height: 40px;
    }
</style>

<script>
export default {
    data () {
        return {
            otpOptions: [
                { value: 0, label: 'Kaleyra' },
                { value: 1, label: 'Antgst' },
            ],
            otpSelect: 0,
        }
    },
    mounted() {
        this.index();
    },
    methods: {
        index () {
            this.gt.httpGet('/get_otp_config').then((response) => {
                this.otpSelect = response.data.result.otpSelect;
            }).catch(function (error) {
                console.log(error);
            });
        },
        setConfig() {
            let params = { Channel: this.otpSelect };
            this.gt.httpPost('/set_otp_config', params).then((response) => {
                const result = response.data;
                if (result.status === 200) {
                    this.$message({ message: '保存成功' });
                } else {
                    this.$message({ message: '保存失败' });
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>