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
                    <span class="rm-span">单次提现上限 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_withdraw_limit"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">每日提现上限 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.everyday_withdraw_limit"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">每日提现次数 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.everyday_withdraw_count"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">提现留存 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.withdraw_keep"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">提现比例 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.withdraw_ratio"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">提现税费 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.withdraw_taxes"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">状态(0关闭,1开启): </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.status"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-button type="primary" icon="el-icon-upload" @click="onSave()">保存数据</el-button>
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
                single_withdraw_limit: 0,
                everyday_withdraw_limit: 0,
                everyday_withdraw_count: 0,
                withdraw_keep: 0,
                withdraw_ratio: 0,
                withdraw_taxes: 0,
                status: 0,
            }
        }
    },
    methods: {
        onSave() {

        }
    }
}
</script>