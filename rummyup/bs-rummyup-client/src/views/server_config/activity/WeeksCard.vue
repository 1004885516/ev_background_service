<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>周卡配置</strong></h3>
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
                    <el-col :span="2">
                        <span class="rm-span">是否可以购买 : </span>
                    </el-col>
                    <el-col :span="2">
                        <el-input v-model="CanBuy"></el-input>
                    </el-col>
                    <el-table :data="tableData" style="100%" border>
                        <el-table-column align="center" prop="Id" label="Id"></el-table-column>
                        <el-table-column align="center" prop="Type" label="类别">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Type }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Type')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Reward" label="立即获得金币">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Reward0 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Reward0')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Reward" label="第二天奖励">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Reward1 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Reward1')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Reward" label="第三天奖励">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Reward2 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Reward2')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Reward" label="第四天奖励">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Reward3 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Reward3')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Reward4" label="第五天奖励">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Reward4 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Reward4')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Reward5" label="第六天奖励">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Reward5 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Reward5')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Reward6" label="第七天奖励">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Reward6 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Reward6')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BuyPrice" label="购买价格">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BuyPrice }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BuyPrice')">
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
                request_url: '/weeks_card',
                tableData: [],
                CanBuy: ''
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onAdd () {
                let item = { Id: 1, Type: 0, Reward0: 0, Reward1: 0, Reward2: 0, Reward3: 0, Reward4: 0, Reward5: 0, Reward6: 0, BuyPrice: 0 };
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
                const data = { data: this.tableData, CanBuy: this.CanBuy  };
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
                    const data = result.WeekData;
                    this.tableData = [];
                    console.log(data)
                    this.CanBuy = data.CanBuy;
                    for (let i = 0; i < data.Config.length; i++) {
                        const item = data.Config[i];
                        const obj = {};
                        obj.Id = i + 1;
                        obj.Type = item.Type;
                        obj.Reward0 = item.Reward[0];
                        obj.Reward1 = item.Reward[1];
                        obj.Reward2 = item.Reward[2];
                        obj.Reward3 = item.Reward[3];
                        obj.Reward4 = item.Reward[4];
                        obj.Reward5 = item.Reward[5];
                        obj.Reward6 = item.Reward[6];
                        obj.BuyPrice = item.BuyPrice;
                        this.tableData.push(obj);
                    }
                    console.log('this.tableData', this.tableData);
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>