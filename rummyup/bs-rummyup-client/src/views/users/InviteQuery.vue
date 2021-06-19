<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>邀请返利查询</strong></h3>
            </div>
        </div>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <span class="demonstration" style="margin-right: 10px">用户ID</span>
                    <el-input placeholder="请输入用户ID" v-model="queryUserId" style="width:200px; margin-right: 30px"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="8">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <span class="demonstration" style="margin-right: 10px">查询范围</span>
                    <el-date-picker
                        v-model="querydate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        :editable = false
                        :clearable = false
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="width: 100%" border>
                        <el-table-column align="center" type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-row v-for="(item, i) in props.row.rebate" :key="i" class="custom-row">
                                        <el-col :span="8" v-if="i > 2">
                                            <el-form-item>
                                                {{ titleNumber[i] }}级返利ID : 
                                                <span>{{ item.id }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" v-if="i > 2">
                                            <el-form-item>
                                                {{ titleNumber[i] }}级返利金 : 
                                                <span>{{ item.gold }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8" v-if="i > 2">
                                            <el-form-item>
                                                {{ titleNumber[i] }}级返利比例 : 
                                                <span>{{ item.rate }}</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="date" label="日期"></el-table-column>
                        <el-table-column align="center" prop="rebate_count" label="总返利金"></el-table-column>
                        <el-table-column align="center" prop="rebate[0].id" label="一级返利ID"></el-table-column>
                        <el-table-column align="center" prop="rebate[0].gold" label="一级返利金"></el-table-column>
                        <el-table-column align="center" prop="rebate[0].rate" label="一级返利比例"></el-table-column>
                        <el-table-column align="center" prop="rebate[1].id" label="二级返利ID"></el-table-column>
                        <el-table-column align="center" prop="rebate[1].gold" label="二级返利金"></el-table-column>
                        <el-table-column align="center" prop="rebate[1].rate" label="二级返利比例"></el-table-column>
                        <el-table-column align="center" prop="rebate[2].id" label="三级返利ID"></el-table-column>
                        <el-table-column align="center" prop="rebate[2].gold" label="三级返利金"></el-table-column>
                        <el-table-column align="center" prop="rebate[2].rate" label="三级返利比例"></el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px">
                    <el-pagination background 
                        @current-change="onChangePage" 
                        @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next"
                        :total="page_total"
                        :page-sizes="sizeData"
                        :page-size="pageSize"></el-pagination>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .custom-row {
        margin: 0px;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data() {
            return {
                request_url:'invite_query',
                queryUserId: '',
                querydate: [],
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
                titleNumber: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
                tableData: []
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        mounted () {
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
            this.querydate = [startdate, enddate];
        },
        methods: {
            onChangePage(val) {
                this.page = val;
                console.log('base data onChangePage : ', this.page);
                this.search();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.search();
            },
            search() {
                const startdate = this.gt.transferDate(this.querydate[0]);
                const enddate = this.gt.transferDate(this.querydate[1]);
                const page = this.page;
                const userId = this.queryUserId;
                if (!userId) {
                    this.$message({ message: '请输入用户ID' });
                    return;
                }
                const params = { startdate, enddate, page, userId, pageSize: this.pageSize };
                this.gt.httpPost(this.request_url, params).then((response) => {
                    console.log('base data response.data :', response.data);
                    const result = response.data.result;
                    this.tableData = result.tableData;
                    this.page_total = result.page_total;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>