<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>充值回调</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 100%" shadow="never">
                    <span class="demonstration" style="margin-right: 10px">渠道选择</span>
                    <el-select v-model="channelSelect" placeholder="渠道选择" style="margin-right: 30px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="demonstration" style="margin-right: 10px">查询范围</span>
                    <el-date-picker
                        :clearable="false"
                        v-model="querydate"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click.native="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card" shadow="never">
                    <el-table :data="tableData" style="width: 100%" border>
                        <el-table-column align="center" v-for="(item, i) in titleData" :key="i" :prop="item.prop" :label="item.label">
                            <template slot-scope="scope">
                                <span>{{ scope.row[item.prop] }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column v-if="channelSelect == 'SerPay'" align="center" fixed="right" label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button @click="onOperation(scope.row, '01')" type="danger" size="mini">成功</el-button>
                                <el-button @click="onOperation(scope.row, '02')" type="danger" size="mini">失败</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column v-else align="center" fixed="right" label="操作" width="150">
                            <template slot-scope="scope">
                                <el-button @click="onOperation(scope.row)" type="danger" size="mini">成功</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-card>
                <el-card class="box-card" style="margin-top: 20px" shadow="never">
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
    </el-card>
</template>

<script>
import EventBus from '@/utils/EventBus.js'
export default {
    data () {
        return {
            request_url: '/gm_recharge',
            
            page: 1,
            page_total: 1,
            pageSize: 10, // 默认每页展示条数
            sizeData: [10, 20, 50, 100], // 每页展示条数列表
            querydate: '',
            channelSelect: 'BMart',
            titleData: [
                {prop: 'datetime',          label: '创建时间'},
                {prop: 'user_id',           label: '用户ID'},
                {prop: 'name',              label: '姓名'},
                {prop: 'phone',             label: '手机'},
                {prop: 'mail',              label: '邮箱'},
                {prop: 'amount',            label: '金额'},
                {prop: 'order_id',          label: '订单ID'},
            ],
            tableData: [],
            options: [
                { value: 'BMart', label: 'BMart' },
                { value: 'Fun', label: 'Fun' },
                { value: 'SerPay', label: 'SerPay' },
            ],
        }
    },
    created() {
        EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
    },
    mounted() {
        const startdate = this.gt.getTodaySymbol();
        const enddate = this.gt.getDateByAdd(0);
        this.querydate = [startdate, enddate];
        this.resetSearch();
    },
    methods: {
        onOperation(row, ordStatus) {
            console.log('row : %s', JSON.stringify(row));
            let params = { order_id: row.order_id, ordStatus };
            this.gt.httpPost('/gm_recharge_notify', params).then((response) => {
                const result = response.data;
                console.log('result : ', result);
                this.$message({ message: `修改${result.msg}` });
            }).catch(function (error) {
                console.log(error);
            });
        },
        handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.search();
        },
        onChangePage(val) {
            this.page = val;
            this.search();
        },
        resetSearch() {
            this.page = 1;
            this.page_total = 1;
            this.tableData = [];
            this.search();
        },
        search() {
            const startdate = this.gt.transferDate(this.querydate[0]);
            const enddate = this.gt.transferDate(this.querydate[1]);
            let params = { startdate, enddate, page: this.page, payway: this.channelSelect, pageSize: this.pageSize };
            this.gt.httpPost(this.request_url, params).then((response) => {
                if (response.data.status === 200) {
                    const result = response.data.result;
                    this.page = result.page;
                    this.page_total = result.page_total;
                    this.tableData = [];
                    for (let i = 0; i < result.tableData.length; i++) {
                        const item = result.tableData[i];
                        this.tableData.push(item);
                    }
                } else {
                    console.log('response.data : ', response.data);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>