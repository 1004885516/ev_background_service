<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>登录活动配置</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <el-button type="primary" icon="el-icon-document-add" @click="onAdd()">添加数据</el-button>
                    <el-button type="primary" icon="el-icon-upload" @click="onSave()">保存数据</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div>
                        <el-table :data="tableData" style="100%" border>
                            <el-table-column align="center" prop="days" label="天数"></el-table-column>
                            <el-table-column align="center" prop="amount" label="奖励数量">
                                <template slot-scope="scope">
                                    <span style="margin-right: 10px">{{ scope.row.amount }}</span>
                                    <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'amount')">
                                        <i class="el-icon-edit" style="font-size: 18px;"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  width="150" fixed="right" label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="onDelete(scope.$index)" type="danger" icon="el-icon-delete" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<style>
    .edit-button {
        padding-top: 6px;
        padding-bottom: 6px;
    }
</style>

<script>
    export default {
        data () {
            return {
                tableData: [],
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onDelete (row) {
                this.tableData.splice(row, 1);
                for (let i = 0; i < this.tableData.length; i++) {
                    const data = this.tableData[i];
                    data.days = i + 1;
                }
            },
            onAdd () {
                let item = { days: 1, amount: 0 };
                if (this.tableData.length > 0) {
                    const data = this.tableData[this.tableData.length - 1];
                    item.days = data.days;
                }
                this.tableData.push(item);
            },
            onSave () {
                const data = { data: this.tableData };
                    this.gt.httpPost('/activity_login', data).then((response) => {
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
            onEdit (row, col) {
                let data = this.tableData[row];
                this.$prompt(`修改序号 ${row} -> ${col} 的值为:`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    data[col] = value;
                    this.$message({ message: '修改成功' });
                }).catch(() => {
                    this.$message({ message: '取消输入' });       
                });
            },
            index () {
                this.gt.httpGet('/activity_login').then((response) => {
                    const result = response.data.result;
                    const data = result.LoginData;
                    this.tableData = [];
                    for (let i = 0; i < data.length; i++) {
                        const ele = data[i];
                        let item = { days: i + 1, amount: ele };
                        this.tableData.push(item);
                    }
                    console.log('this.tableData : ', this.tableData);
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>