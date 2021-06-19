<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>系统配置</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">普通WhatsApp : </span>
            </el-col>
            <el-col :span="5">
                <el-input v-model="tabledata.WhatsApp" :maxlength='13'></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">VIPWhatsApp : </span>
            </el-col>
            <el-col :span="5">
                <el-input v-model="tabledata.VipWhatsApp" :maxlength='13'></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">邮箱 : </span>
            </el-col>
            <el-col :span="5">
                <el-input v-model="tabledata.WhatsAppEmail" :maxlength='35'></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-button type="primary" icon="el-icon-upload" @click="onSave()">保存数据</el-button>
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
                request_url: '/system_config',
                tabledata: { WhatsApp: '', VipWhatsApp: '', WhatsAppEmail: '' },
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onSave() {
                const data = { data: this.tabledata };
                this.gt.httpPost(this.request_url, data).then((response) => {
                    const result = response.data;
                    console.log('save response: ', JSON.stringify(result));
                    if (result.status === 200) {
                        this.$message({ message: '保存成功' });
                    } else {
                        this.$message({ message: '保存失败' });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            index() {
                this.gt.httpGet(this.request_url).then((response) => {
                    const result = response.data.result;
                    console.log('httpGet result.NewUserGiveData : ', result.data);
                    const data = result.data;
                    for (let i = 0; i < data.length; i++){
                        this.$set(this.tabledata, data[i].Name, data[i].Value);
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>