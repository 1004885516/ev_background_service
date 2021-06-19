<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>首充活动配置</strong></h3>
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
                        <el-table-column align="center" prop="ID" label="ID" width="180"></el-table-column>
                        <el-table-column align="center" label="开启时间 - 结束时间">
                            <template slot-scope="scope">
                                <el-date-picker
                                        v-model="scope.row.Time"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :editable = false
                                        :clearable = false>
                                    </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="ActiveName" label="活动名称" width="180">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.ActiveName }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'ActiveName')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="IncGold" label="显示金额" width="180">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.IncGold }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'IncGold')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BuyPrice" label="实际购买金额" width="180">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BuyPrice }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BuyPrice')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="OriginalPrice" label="原始购买金额" width="180">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.OriginalPrice }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'OriginalPrice')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Discount" label="折扣" width="180">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Discount + '%'}}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Discount')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
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
</style>

<script>
    export default {
        data () {
            return {
                request_url: '/activity_first',
                tableData: [],
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            onAdd () {
                let item = { ID: 1, ActiveName: '', IncGold: 0, BuyPrice: 0, OriginalPrice: 0, Discount: '', Time: [] };
                if (this.tableData.length > 0) {
                    const data = this.tableData[this.tableData.length - 1];
                    item.days = data.ID;
                }
                this.tableData.push(item);
            },
            onSave () {
                // 将客户端时间格式化
                this.tableData[0].Time[0] = this.gt.transferDateTime(this.tableData[0].Time[0]);
                this.tableData[0].Time[1] = this.gt.transferDateTime(this.tableData[0].Time[1]);
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
                    const data = result.LimitData;
                    data.ID = 1;
                    this.tableData = [];
                    this.tableData.push(data);
                    console.log('this.tableData-----', this.tableData);
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>