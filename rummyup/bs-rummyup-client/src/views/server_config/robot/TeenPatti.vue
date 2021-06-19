<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>机器人TeenPatti配置</strong></h3>
            </div>
        </div>
        <el-card class="box-card">
            <el-row>
                <el-button type="primary" icon="el-icon-upload" @click="onSave()">保存数据</el-button>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div>
                        <el-table :data="tableData" style="100%" border>
                            <el-table-column align="center" v-for="(item, i) in titleData" :key="i"  prop="item.prop" :label="item.label">
                                <template slot-scope="scope">
                                    <span style="margin-right: 10px">{{ scope.row[item.prop] }}</span>
                                    <el-button class="edit-button" v-if="item.prop != 'gearID' && item.prop != 'gear'" type="text" @click="onEdit(scope.$index, item.prop)">
                                        <i class="el-icon-edit" style="font-size: 18px;"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
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
            titleData: [
                { prop: 'gearID',     label: '档位ID' },
                { prop: 'gear',       label: '档位' },
                { prop: 'rate1',      label: 'rate1' },
                { prop: 'rate2',      label: 'rate2' },
                { prop: 'rate3',      label: 'rate3' },
                { prop: 'rate4',      label: 'rate4' },
                { prop: 'rate5',      label: 'rate5' },
            ],
            tableData: [
                { gearID: 1000, gear: 5, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1001, gear: 4, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1002, gear: 3, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1003, gear: 2, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1004, gear: 1, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1005, gear: 0, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1006, gear: -1, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1007, gear: -2, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1008, gear: -3, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1009, gear: -4, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
                { gearID: 1010, gear: -5, rate1: 0, rate2: 0, rate3: 0, rate4: 0, rate5: 0 },
            ],
            index: 0,
            gear: 0,
            goldPool: 0,
            gearBase: 0,
        }
    },
    methods: {
        onSave () {

        },
        onEdit (row, col) {
            let data = this.tableData[row];
            this.$prompt(`修改档位ID ${data.gearID} -> ${col} 的值为:`, '提示', {
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