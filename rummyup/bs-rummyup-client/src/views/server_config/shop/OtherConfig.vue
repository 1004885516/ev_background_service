<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>Other配置</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">自定义最低充值(大于等于) : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.RechargeCustom"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">充值计入账户比例 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.RechargeRatio"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">玩家最低充值A才能提现 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.RechargeLowest"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">充值用户定义值(大于等于) : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.RechargeDefinition"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
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
                request_url: '/shop_other_config',
                tabledata: { RechargeCustom: 0, RechargeRatio: 0, RechargeLowest: 0, RechargeDefinition: 0 },
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
                    console.log('this.tabledata----', this.tabledata);
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>