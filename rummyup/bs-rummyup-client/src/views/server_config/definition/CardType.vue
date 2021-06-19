<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>牌型定义(小于等于临界值的牌型为小)</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">高牌 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.HighCard"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">对子 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.Pair"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">同花 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.Color"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">顺子 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.Sequenece"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">同花顺 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.PureSequence"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">豹子 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.TrailOrSet"></el-input>
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
                request_url: '/card_type',
                tabledata: { HighCard: '0,0,0', Pair: '0,0,0', Color: '0,0,0', Sequenece: '0,0,0', PureSequence: '0,0,0', TrailOrSet: '0,0,0' },
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
                    this.$set(this.tabledata, 'HighCard', data[0].toString());
                    this.$set(this.tabledata, 'Pair', data[1].toString());
                    this.$set(this.tabledata, 'Color', data[2].toString());
                    this.$set(this.tabledata, 'Sequenece', data[3].toString());
                    this.$set(this.tabledata, 'PureSequence', data[4].toString());
                    this.$set(this.tabledata, 'TrailOrSet', data[5].toString());
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>