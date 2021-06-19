<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>玩家配置</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">新玩家玩的局数 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.NewUserGames"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">充值用户充值数额 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.PayIn"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">充值计入可提现(%) : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.PayInPercent"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">手续费计入档位值(%) : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.ServiceCharge"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">提现自动过审金额(小于) : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.AutoPayout"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">超过局数(大于等于) : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.TpHideInning"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">注册天数(大于等于) : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.TpHideRegTime"></el-input>
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
                request_url: '/game_player',
                tabledata: { NewUserGames: 0, PayIn: 0, PayInPercent: 0, ServiceCharge: 0, AutoPayout: 0, TpHideInning: 0, TpHideRegTime: 0},
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