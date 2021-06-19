<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>新用户充值</strong></h3>
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
                        <el-table-column align="center" prop="OpenTime" label="开启时长(分)" width="120">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.OpenTime }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'OpenTime')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BuyPrice1" label="阶段1购买金额" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BuyPrice1 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BuyPrice1')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="RewardPercent1" label="阶段1赠送比例" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.RewardPercent1 }}%</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'RewardPercent1')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BuyGive1" label="阶段1购买即得" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BuyGive1 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BuyGive1')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="NextDayReward1" label="阶段1第二天返还金额" width="170">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.NextDayReward1 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'NextDayReward1')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BuyPrice2" label="阶段2购买金额" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BuyPrice2 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BuyPrice2')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="RewardPercent2" label="阶段2赠送比例" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.RewardPercent2 }}%</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'RewardPercent2')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BuyGive2" label="阶段2购买即得" width="150">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BuyGive2 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BuyGive2')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="NextDayReward2" label="阶段2第二天返还金额" width="170">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.NextDayReward2 }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'NextDayReward2')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="Open" label="活动开关(0关,1开)" width="170">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.Open }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'Open')">
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
                request_url: '/new_user_recharge',
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
                let item = { ID: 1, OpenTime: 0, BuyPrice1: 0, RewardPercent1: 0, NextDayReward1: 0, BuyPrice2: 0, RewardPercent2: 0, NextDayReward2: 0, Open: 0, BuyGive1: 0, BuyGive2: 0 };
                if (this.tableData.length > 0) {
                    const data = this.tableData[this.tableData.length - 1];
                    item.ID = data.ID + 1;
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
                    const data = result.data;
                    data.ID = 1;
                    this.tableData = [];
                    this.tableData.push(data);
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