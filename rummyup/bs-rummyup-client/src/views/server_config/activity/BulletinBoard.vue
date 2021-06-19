<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>宣传栏配置</strong></h3>
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
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column align="center" prop="Id" label="Id"></el-table-column>
                        <el-table-column align="center" prop="ResName" label="宣传图资源">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.ResName }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'ResName')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="FuncJump" label="功能跳转">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.FuncJump }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'FuncJump')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Active" label="关联活动">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Active }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Active')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Rank" label="显示顺序">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Rank }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Rank')">
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
                request_url: '/bulletin_board',
                tableData: [],
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onAdd () {
                let item = { Id: 1, ResName: '', FuncJump: 0, Active: '', Rank: 0 };
                if (this.tableData.length > 0) {
                    const data = this.tableData[this.tableData.length - 1];
                    item.Id = data.Id + 1;
                }
                this.tableData.push(item);
            },
            onDelete (row) {
                this.tableData.splice(row, 1);
                for (let i = 0; i < this.tableData.length; i++) {
                    const data = this.tableData[i];
                    data.Id = i + 1;
                }
            },
            onSave () {
                const data = { data: this.tableData };
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
                this.gt.httpGet(this.request_url).then((response) => {
                    const result = response.data.result;
                    const data = result.BoardData;
                    this.tableData = [];
                    this.tableData = data;
                    console.log('this.tableData---', this.tableData);
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>