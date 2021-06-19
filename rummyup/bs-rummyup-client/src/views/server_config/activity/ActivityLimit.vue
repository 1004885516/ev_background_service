<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>限时活动配置</strong></h3>
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
                        <el-table-column align="center" prop="ID" label="ID" width="120"></el-table-column>
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
                        <el-table-column align="center" prop="ExpireTime" label="开启时长(分)" width="120">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.ExpireTime }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'ExpireTime')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BuyPrice" label="购买金额" width="120">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BuyPrice }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BuyPrice')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="RewardPercent" label="赠送比例" width="120">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.RewardPercent }}%</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'RewardPercent')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="DayBuyCountLimit" label="个人单日购买上限" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.DayBuyCountLimit }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'DayBuyCountLimit')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="UserType" label="用户类型" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.UserType }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'UserType')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="GoodsType" label="活动类型" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.GoodsType }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'GoodsType')">
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
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                request_url: '/activity_limit',
                tableData: [],
            }
        },
        mounted() {
            this.index();
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        methods: {
            onAdd () {
                let item = { ID: 1, BuyPrice: 0, ExpireTime: 0, DayBuyCountLimit: 0,RewardPercent: 0, UserType: 0, Time: [], GoodsType: 0 };
                if (this.tableData.length > 0) {
                    const data = this.tableData[this.tableData.length - 1];
                    item.ID = data.ID + 1;
                }
                this.tableData.push(item);
            },
            onSave () {
                // 将客户端时间格式化
                for (let i = 0; i < this.tableData.length; i ++) {
                    const item = this.tableData[i];
                    item.Time[0] = this.gt.transferDateTime(item.Time[0]);
                    item.Time[1] = this.gt.transferDateTime(item.Time[1]);
                }
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
                console.log('col', col);
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
                    for (let i = 0; i < data.length; i++) {
                        data[i].ID = i + 1;
                    }
                    this.tableData = [];
                    this.tableData = data;
                }).catch(function (error) {
                    console.log(error);
                });
            },
            onDelete (row) {
                this.tableData.splice(row, 1);
                for (let i = 0; i < this.tableData.length; i++) {
                    const data = this.tableData[i];
                    data.Id = i + 1;
                }
            },
        }
    }
</script>