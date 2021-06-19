<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>KYC管理</strong></h3>
            </div>
        </div>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <span class="demonstration" style="margin-right: 10px">状态选择</span>
                    <el-select v-model="select_status" placeholder="状态选择" style="margin-right: 30px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
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
                    <el-button type="primary" icon="el-icon-search" @click="getData()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="tableData" style="width: 100%" border>
                        <el-table-column align="center" width="200" v-for="(item, i) in titleData" :key="i" :prop="item.prop" :label="item.label">
                            <template slot-scope="scope">
                                <a v-if="checkLink(item.prop)" :href="scope.row[item.prop]" target="_blank" class="buttonText">点击查看</a>
                                <span v-else>{{ scope.row[item.prop] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" fixed="right" label="操作" width="185">
                            <template slot-scope="scope" style="height: 200px">
                                 <el-col v-if="scope.row.status === '未审核'">
                                    <el-button @click="onOperation(scope.row, true)" type="danger" size="mini">同意</el-button>
                                    <el-button @click="onOperation(scope.row, false)" type="primary" size="mini">拒绝</el-button>
                                </el-col>
                                <span v-else>不可操作</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px">
                    <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        layout="sizes, prev, pager, next"
                        :total="page_total"
                        :page-sizes="sizeData"
                        :page-size="pageSize">
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                request_url: 'kyc_manage',
                querydate: [],
                titleData: [
                    {prop: 'datetime',          label: '时间'},
                    {prop: 'user_id',           label: '用户ID'},
                    {prop: 'name',              label: '姓名'},
                    {prop: 'birth',             label: '生日'},
                    {prop: 'city',              label: '城市'},
                    {prop: 'phone',             label: '手机'},
                    {prop: 'mail',              label: '邮箱'},
                    {prop: 'bank',              label: '银行卡号'},
                    {prop: 'input_address',     label: '填写地址'},
                    {prop: 'location_address',  label: '定位地址'},
                    {prop: 'credit_card_f',     label: '信用卡正'},
                    {prop: 'credit_card_b',     label: '信用卡反'},
                    {prop: 'photo_click',       label: '自拍照片'},
                    {prop: 'pan_card',          label: '身份证'},
                    {prop: 'status',            label: '状态'},
                ],
                tableData: [],
                options: [
                    { value: 0, label: '全部' },
                    { value: 1, label: '等待审核' },
                    { value: 2, label: '审核通过' },
                    { value: 3, label: '审核不通过' },
                ],
                select_status: 1,
                page: 1,
                page_total: 1,
                pageSize: 10, // 默认每页展示条数
                sizeData: [10, 20, 50, 100], // 每页展示条数列表
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        mounted () {
            const startdate = this.gt.getMonthBeginByAdd(-1);
            const enddate = this.gt.getDateByAdd(-1);
            this.querydate = [startdate, enddate];
            this.getData();
        },
        methods: {
            onOperation (row, result) {
                console.log('row : %s', JSON.stringify(row));
                console.log('row : ' + row + ', result : ' + result);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getData();
            },
            handleCurrentChange (val) {
                console.log(`当前页: ${val}`);
            },
            checkLink (key) {
                if (key == 'credit_card_f' || key == 'credit_card_b' || key == 'photo_click' || key == 'pan_card') {
                    return true;
                }
                return false;
            },
            getData() {
                const startdate = this.gt.transferDate(this.querydate[0]);
                const enddate = this.gt.transferDate(this.querydate[1]);
                const page = this.page;
                const selectstatus = this.select_status;
                const params = { startdate, enddate, page, selectstatus, pageSize: this.pageSize };
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