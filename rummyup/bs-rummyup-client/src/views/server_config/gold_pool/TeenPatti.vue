<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>TeenPatti场次配置</strong></h3>
            </div>
        </div>
        <el-card class="box-card" style="margin-bottom: 20px; height: 60px">
            <el-row :gutter="20">
                <el-col :span="8">
                    <span>当前档位: {{ gear }}</span>
                </el-col>
                <el-col :span="8">
                    <span>金币池总量: {{ goldPool }}</span>
                </el-col>
                <el-col :span="8">
                    <span>档位基础值: {{ gearBase }}</span>
                </el-col>
            </el-row>
        </el-card>
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
                                    <el-button class="edit-button" v-if="item.prop == 'min' || item.prop == 'max'" type="text" @click="onEdit(scope.$index, item.prop)">
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
                { prop: 'gearID',        label: '档位ID' },
                { prop: 'gear',          label: '档位' },
                { prop: 'min',           label: '最小比例' },
                { prop: 'max',           label: '最大比例' },
                { prop: 'min_gold',      label: '最小比例金币' },
                { prop: 'max_gold',      label: '最大比例金币' },
            ],
            tableData: [
                { gearID: 2000, gear: 5, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2001, gear: 4, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2002, gear: 3, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2003, gear: 2, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2004, gear: 1, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2005, gear: 0, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2006, gear: -1, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2007, gear: -2, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2008, gear: -3, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2009, gear: -4, min: 0, max: 0, min_gold: 0, max_gold: 0 },
                { gearID: 2010, gear: -5, min: 0, max: 0, min_gold: 0, max_gold: 0 },
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