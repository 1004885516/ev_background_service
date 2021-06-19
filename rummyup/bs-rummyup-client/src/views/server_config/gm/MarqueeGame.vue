<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>跑马灯设置(游戏)</strong></h3>
        </el-row>
        
        <el-card class="box-card" shadow="never">
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">播放次数 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.count" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">生存周期 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.live_time" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">中文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.language_cn"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">英文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.language_en"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">印地文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.language_in"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">触发条件 : </span>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card">
                    <div class="block">
                        <el-card class="box-card">
                            <el-button type="primary" icon="el-icon-document-add" @click="onAdd()">添加数据</el-button>
                        </el-card>
                    </div>
                    <el-table :data="listData" style="100%" border>
                        <el-table-column align="center" prop="ID" label="ID" width="80"></el-table-column>
                        <el-table-column align="center" prop="GameType" label="玩法">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.GameType }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'GameType')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="BaseScore" label="场次">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.BaseScore }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'BaseScore')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="WinGold" label="赢取金额(大于等于)">
                            <template slot-scope="scope">
                                <span style="margin-right: 10px">{{ scope.row.WinGold }}</span>
                                <el-button class="edit-button" type="text" @click="onEdit(scope.$index, 'WinGold')">
                                    <i class="el-icon-edit" style="font-size: 18px;"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" fixed="right" label="操作">
                            <template slot-scope="scope">
                                <el-button @click="onDelete(scope.$index)" type="danger" icon="el-icon-delete" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-button type="primary" @click="onSet()">确定</el-button>
            </el-row>
        </el-card>
    </el-card>
</template>

<style scoped>
    .el-col {
        text-align: left;
        margin-right: 20px;
    }
    .rm-span {/* 右对齐, 上下居中 */
        float: right;
        line-height: 40px;
    }
    .h-textarea {
        height: 40px;
        min-height: 40px;
        line-height: 40px;
    }
</style>

<script>
import EventBus from '@/utils/EventBus.js'
export default {
    data () {
        return {
            request_url: '/gm_marquee_game',
            tableData: {
                count: 0,
                live_time: 0,
                language_cn: '',
                language_en: '',
                language_in: '',
            },
            listData: []
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
            let item = { ID: 1, GameType: 0, BaseScore: '', WinGold: '' };
            if (this.listData.length > 0) {
                const data = this.listData[this.listData.length - 1];
                item.ID = data.ID + 1;
            }
            this.listData.push(item);
        },
        onDelete (row) {
            this.listData.splice(row, 1);
            for (let i = 0; i < this.listData.length; i++) {
                const data = this.listData[i];
                data.Id = i + 1;
            }
        },
        onEdit (row, col) {
                let data = this.listData[row];
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
        onSet() {
            const data = { tableData: this.tableData, listData: this.listData };
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
        index() {
            this.gt.httpGet(this.request_url).then((response) => {
                const result = response.data;
                console.log('get result: ', result);
                const data = result.data;
                this.$set(this.tableData, 'count', data.Count);
                this.$set(this.tableData, 'live_time', data.LifeTime);
                this.$set(this.tableData, 'language_cn', data.CnMsg);
                this.$set(this.tableData, 'language_en', data.EnMsg);
                this.$set(this.tableData, 'language_in', data.InMsg);
                this.listData = data.List;
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>