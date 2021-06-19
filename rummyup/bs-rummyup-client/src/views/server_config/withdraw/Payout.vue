<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>游戏提现配置</strong></h3>
            </div>
        </div>
        
        <el-card class="box-card">
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">UserName : </span>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="tableData.username_true"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">Password : </span>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="tableData.password_true"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">PayoutMerchantId : </span>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="tableData.payoutmerchantid_true"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">ClientId : </span>
                </el-col>
                <el-col :span="8">
                    <el-input v-model="tableData.clientid_true"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-button type="primary" icon="el-icon-upload" @click="onSave()">启用测试模式</el-button>
            </el-row>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">UserName : </span>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="tableData.username_false"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">Password : </span>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="tableData.password_false"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">PayoutMerchantId : </span>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="tableData.payoutmerchantid_false"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">ClientId : </span>
                </el-col>
                <el-col :span="8">
                    <el-input v-model="tableData.clientid_false"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-button type="primary" icon="el-icon-upload" @click="onSave()">启用正式模式</el-button>
            </el-row>
        </el-card>
        
    </div>
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
            tableData: {
                username_true: 0,
                password_true: 0,
                clientid_true: 0,
                payoutmerchantid_true: 0,
                username_false: 0,
                password_false: 0,
                clientid_false: 0,
                payoutmerchantid_false: 0,
            }
        }
    },
    methods: {
        onSave() {

        }
    }
}
</script>