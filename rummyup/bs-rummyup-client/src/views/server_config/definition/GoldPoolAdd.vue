<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>金币池增加概率</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">金币池正值时增加大赢概率 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="just"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">金币池负值时增加大输概率 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="lose"></el-input>
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
                request_url: '/gold_pool_add',
                just: 0,
                lose: 0
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onSave() {
                const data = { lose: this.lose, just: this.just };
                this.gt.httpPost(this.request_url, data).then((response) => {
                    const result = response.data;
                    console.log('save response: ', JSON.stringify(result));
                    if (result.status === 200) {
                        this.$message({ message: '保存成功' });
                    } else {
                        if (result.msg) {
                            this.$message({ message: result.msg });
                        } else {
                            this.$message({ message: '保存失败' });
                        }
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
                    this.just = data.just;
                    this.lose = data.lose;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>