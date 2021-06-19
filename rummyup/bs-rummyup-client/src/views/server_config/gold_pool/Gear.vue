<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>档位值修正</strong></h3>
            </div>
        </div>
        
        <el-card class="box-card">
            <el-divider></el-divider>
            <el-row>
                <el-col :span="1">
                    <span class="rm-span">Rummy : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="rummy_value"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="1">
                    <span class="rm-span">TeenPatti : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="teenpatti_value"></el-input>
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
            rummy_value: 0,
            teenpatti_value: 0,
        }
    },
    methods: {
        onSave() {

        }
    }
}
</script>