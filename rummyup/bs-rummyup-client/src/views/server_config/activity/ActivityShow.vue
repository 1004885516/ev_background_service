<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>活动显示配置</strong></h3>
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
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column align="center" prop="name" label="名称" width="180">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.name }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'name')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="auto" label="弹窗顺序(0关123...顺序排序)">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.auto }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'auto')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="isOpen" label="开关(0关1开)">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.isOpen }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'isOpen')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column align="center" fixed="right" label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button @click="onDelete(scope.$index)" type="danger" icon="el-icon-delete" size="small">删除</el-button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <!-- <el-button type="primary" icon="el-icon-document-add" @click="onAdd()">添加数据</el-button> -->
                    <el-button type="primary" icon="el-icon-upload" @click="onSave2()">保存数据</el-button>
                </el-card>
            </div>
        </el-row>
        
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData2" style="100%" border>
                        <el-table-column align="center" prop="name" label="名称" width="180">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.name }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit2(scope.$index, 'name')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="value" label="开关(0关1开)">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.value }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit2(scope.$index, 'value')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column align="center" fixed="right" label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button @click="onDelete(scope.$index)" type="danger" icon="el-icon-delete" size="small">删除</el-button>
                            </template>
                        </el-table-column> -->
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
                request_url: '/activity_show',
                request_url2: '/set_noviciate',
                tableData: [],
                tableData2: []
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onAdd () {
                let item = { name: '', auto: 0, isOpen: 0 };
                if (this.tableData.length > 0) {
                    const data = this.tableData[this.tableData.length - 1];
                    item.days = data.ID;
                }
                this.tableData.push(item);
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
            onSave2 () {
                const data = { data: this.tableData2 };
                this.gt.httpPost(this.request_url2, data).then((response) => {
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
            onEdit2 (row, col) {
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
            index () {
                this.gt.httpGet(this.request_url).then((response) => {
                    const result = response.data.result.ShowData;
                    const data1 = result.data1;
                    const data2 = result.data2;
                    data1[0].name = '转盘';
                    data1[1].name = '签到';
                    data1[2].name = '周卡';
                    this.tableData = [];
                    console.log(data1);
                    this.tableData = data1;

                    this.tableData2 = [];
                    for (let item in data2) {
                        const obj = {};
                        obj.value = data2[item];
                        this.tableData2.push(obj);
                    }
                    this.tableData2[0].name = '新手引导';
                    this.tableData2[1].name = '宣传图';
                    console.log('tableData2', this.tableData2);
                }).catch(function (error) {
                    console.log(error);
                });
            },
            onDelete (row) {
                this.tableData.splice(row, 1);
                for (let i = 0; i < this.tableData.length; i++) {
                    const data = this.tableData[i];
                    data.days = i + 1;
                }
            },
        }
    }
</script>