<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>提充及充值档位定义</strong></h3>
        </el-row>

        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <!-- <el-button type="primary" icon="el-icon-document-add" @click="onAdd()">添加数据</el-button> -->
                    <el-button type="primary" icon="el-icon-upload" @click="onSave()">保存数据</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <h3 style="width: 100px">充提比配置</h3>
                    <div style="width: 100px">
                        <el-button type="primary" icon="el-icon-document-add" @click="onAdd1()">添加数据</el-button>
                    </div>
                    <el-table :data="tableData1" style="100%" border>
                        <el-table-column align="center" prop="ID" label="ID" width="180"></el-table-column>
                        <el-table-column align="center" prop="UpperLimit" label="上限">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.UpperLimit }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit1(scope.$index, 'UpperLimit')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center"  width="150" fixed="right" label="操作">
                            <template slot-scope="scope">
                                <el-button @click="onDelete1(scope.$index)" type="danger" icon="el-icon-delete" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <h3 style="width: 150px">充值额度档位配置</h3>
                    <div style="width: 100px">
                        <el-button type="primary" icon="el-icon-document-add" @click="onAdd2()">添加数据</el-button>
                    </div>
                    <el-table :data="tableData2" style="100%" border>
                        <el-table-column align="center" prop="ID" label="ID" width="180"></el-table-column>
                        <el-table-column align="center" prop="Money" label="额度">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Money }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit2(scope.$index, 'Money')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center"  width="150" fixed="right" label="操作">
                            <template slot-scope="scope">
                                <el-button @click="onDelete2(scope.$index)" type="danger" icon="el-icon-delete" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
    .el-picker-panel__footer .el-button--text.el-picker-panel__link-btn {
        display: none;
    }
</style>

<script>
    export default {
        data () {
            return {
                request_url: '/recharge_and_rank',
                tableData1: [],
                tableData2: [],
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onAdd1 () { 
                let item = { ID: 1, UpperLimit: 0 };
                if (!this.tableData1) {
                    this.tableData1 = [];
                }
                if (this.tableData1 && this.tableData1.length > 0) {
                    const data = this.tableData1[this.tableData1.length - 1];
                    item.ID = data.ID + 1;
                }
                this.tableData1.push(item);
            },
            onAdd2 () { 
                let item = { ID: 1, Money: 0 };
                if (!this.tableData2) {
                    this.tableData2 = [];
                }
                if (this.tableData2 && this.tableData2.length > 0) {
                    const data = this.tableData2[this.tableData2.length - 1];
                    item.ID = data.ID + 1;
                }
                this.tableData2.push(item);
            },
            onSave () {
                const data = { PayinRank: this.tableData1, PayinLevel: this.tableData2 };
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
            onEdit1 (row, col) {
                console.log('col', col);
                let data = this.tableData1[row];
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
            onEdit2 (row, col) {
                console.log('col', col);
                let data = this.tableData2[row];
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
            onDelete1 (row) {
                this.tableData1.splice(row, 1);
                for (let i = 0; i < this.tableData.length; i++) {
                    let data = this.tableData[i];
                    data.id = i;
                }
            },
            onDelete2 (row) {
                this.tableData2.splice(row, 1);
                for (let i = 0; i < this.tableData.length; i++) {
                    let data = this.tableData[i];
                    data.id = i;
                }
            },
            index () {
                this.gt.httpGet(this.request_url).then((response) => {
                    const result = response.data.result;
                    const data = result.data;
                    this.tableData1 = [];
                    this.tableData2 = [];
                    this.tableData1 = data.tableData1;
                    this.tableData2 = data.tableData2;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>