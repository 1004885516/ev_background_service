<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>渠道数据</strong></h3>
        </el-row>
        <el-row>
            <div class="block">
                <el-card class="box-card" style="width: 700px">
                    <span class="demonstration" style="margin-right: 30px">选择查询日期范围</span>
                    <el-date-picker
                        v-model="value1"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" style="width: 380px; margin-right: 30px">
                    </el-date-picker>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="box-card">
                    <el-table :data="tableData" style="100%">
                        <el-table-column prop="name" label="统计"></el-table-column>
                        <el-table-column prop="data" label="数值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <el-table :data="rechargeData" style="100%">
                        <el-table-column prop="name" label="统计"></el-table-column>
                        <el-table-column prop="data" label="数值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <el-table :data="withdrawData" style="100%">
                        <el-table-column prop="name" label="统计"></el-table-column>
                        <el-table-column prop="data" label="数值"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <el-table :data="taxData" style="100%">
                        <el-table-column prop="name" label="统计"></el-table-column>
                        <el-table-column prop="data" label="数值"></el-table-column>
                    </el-table>
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
            value1: '',
            tableData: [
                { name: '注册数', data: 888 },
                { name: '登录数', data: 888 },
                { name: 'ARPU', data: 888 },
                { name: 'ARPPU', data: 888 },
            ],
            rechargeData: [
                { name: '充值金额', data: 888 },
                { name: '充值笔数', data: 888 },
                { name: '充值人数', data: 888 },
                { name: '人均充值', data: 888 },
            ],
            withdrawData: [
                { name: '提现金额', data: 888 },
                { name: '提现笔数', data: 888 },
                { name: '提现人数', data: 888 },
                { name: '人均提现', data: 888 },
            ],
            taxData: [
                { name: '抽水金额', data: 888 },
                { name: '抽水笔数', data: 888 },
                { name: '抽水人数', data: 888 },
                { name: '人均抽水', data: 888 },
            ],
        }
    },
    created() {
        EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, true);
    }
}
</script>