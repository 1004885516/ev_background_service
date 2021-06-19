<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>邀请活动配置</strong></h3>
            </div>
        </div>
        
        <el-card class="box-card">
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">总返利比例(%): </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.total_rebate"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">1级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate1"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">2级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate2"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">3级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate3"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">4级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate4"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">5级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate5"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">6级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate6"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">7级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate7"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">8级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate8"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">9级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate9"></el-input>
                </el-col>
                <el-col :span="2">
                    <span class="rm-span">10级 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.single_rebate10"></el-input>
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
            tableData: { total_rebate: 0,
                single_rebate1: 0,
                single_rebate2: 0,
                single_rebate3: 0,
                single_rebate4: 0,
                single_rebate5: 0,
                single_rebate6: 0,
                single_rebate7: 0,
                single_rebate8: 0,
                single_rebate9: 0,
                single_rebate10: 0,
            }
        }
    },
    methods: {
        onSave() {

        },
        index() {
            
        }
    }
}
</script>