<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>支付开关</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <h3>充值</h3>
        <el-row>
            <div v-for="(item, index) in tabledata" :key="item">
                <el-button v-if="index === Payment-1" type="success" @click="changePayWayPayment(index)">{{item}}</el-button>
                <el-button v-else @click="changePayWayPayment(index)">{{item}}</el-button>
            </div>
        </el-row>
        <el-divider></el-divider>
        <h3>提现</h3>
        <el-row>
            <div v-for="(item, index) in tabledata" :key="item">
                <el-button v-if="index === Payoutment-1" type="success" @click="changePayWayPayoutment(index)">{{item}}</el-button>
                <el-button v-else @click="changePayWayPayoutment(index)">{{item}}</el-button>
            </div>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-button type="primary" icon="el-icon-upload" @click="onSave()">保存数据</el-button>
        </el-row>
    </el-card>
</template>

<style>
    .el-col {
        text-align: center;
        margin-right: 20px;
    }
    .rm-span {/* 右对齐, 上下居中 */
        float: right;
        line-height: 40px;
    }
</style>

<script>
    export default {
        data () {
            return {
                request_url: '/shop_payway_config',
                tabledata: [ 'Bmart', 'Funzone', 'Grepay' ],
                Payment: 0,
                Payoutment: 0
            }
        },
        mounted() {
            this.index();
        },
        methods: {
            changePayWayPayment(index) {
                this.Payment = index + 1;
            },
            changePayWayPayoutment(index) {
                this.Payoutment = index + 1;
            },
            onSave() {
                const data = { Payment: this.Payment, Payoutment: this.Payoutment };
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
                    const result = response.data.result;
                    console.log('httpGet result.NewUserGiveData : ', result.data);
                    const data = result.data;
                    this.Payment = data.Payment;
                    this.Payoutment = data.Payoutment;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>