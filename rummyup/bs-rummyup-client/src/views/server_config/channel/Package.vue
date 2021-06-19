<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>渠道包配置</strong></h3>
            </div>
        </div>
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
                    <div>
                        <el-table :data="tableData" style="100%" border>
                            <el-table-column align="center" width="100" prop="id" label="序号"></el-table-column>
                            <el-table-column align="center" width="200" prop="channel_id" label="渠道"></el-table-column>
                            <el-table-column align="center" v-for="(item, i) in titleData" :key="i" prop="item.prop" :label="item.label">
                                <template slot-scope="scope">
                                    <span style="margin-right: 10px">{{ scope.row[item.prop] }}</span>
                                    <el-button type="text" @click="onEdit(scope.$index, item.prop)">
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
    </div>
</template>

<style>
    .edit-button {
        padding-top: 6px;
        padding-bottom: 6px;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                titleData: [
                    {prop: 'package_id',    label: 'Package_id'},
                    {prop: 'apk_id',        label: 'Apk_id'},
                ],
                tableData: [],
                index: 0,
                token: '',
            }
        },
        created () {
        },
        mounted () {
            this.getData();
        },
        methods: {
            getData () {
                this.gt.httpGet('/channel_package')
                    .then((response) => {
                        console.log('response.data :', response.data);
                        this.tableData = [];
                        for (let i = 0; i < response.data.result.length; i++) {
                            const data = response.data.result[i];
                            let newData = {};
                            newData.id = data.id;
                            newData.channel_id = data.channel_id;
                            newData.package_id = data.package_id;
                            newData.apk_id = data.apk_id;
                            this.tableData.push(newData);
                        }
                        console.log('tableData : ', this.tableData);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            onDelete (row) {
                this.tableData.splice(row, 1);
                for (let i = 0; i < this.tableData.length; i++) {
                    let data = this.tableData[i];
                    data.id = i;
                }
            },
            onAdd () {
                let newData = { id: this.tableData.length, channel_id: this.gd.ChannelId };
                for (let i = 0; i < this.titleData.length; i++) {
                    let data = this.titleData[i];
                    newData[data.prop] = 0;
                }
                this.tableData.push(newData);
                this.index += 1;
            },
            onSave () {
                this.gt.httpPost('/channel_package', this.tableData)
                    .then((response) => {
                        console.log(response.data);
                        this.$message({ message: '保存' + response.data.msg });
                        EventBus.$emit(this.gd.EventId.UPDATE_APK_ID);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
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
            }
        }
    }
</script>