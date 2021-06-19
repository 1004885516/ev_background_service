<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>创建订单</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">姓名 : </span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="tabledata.FirstName"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">电话 : </span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="tabledata.Phone" maxlength="10"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">邮箱 : </span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="tabledata.Email"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">用户ID : </span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="tabledata.UserId"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="3">
                <span class="rm-span">创建金额 : </span>
            </el-col>
            <el-col :span="4">
                <el-input v-model="tabledata.Amount"></el-input>
            </el-col>
        </el-row>
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
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                request_url: '/create_order',
                tabledata: { FirstName: '', Phone: '', Email: '', UserId: '', Amount: '' }
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        methods: {
            onSave() {
                const data = { data: this.tabledata };
                this.gt.httpPost(this.request_url, data).then((response) => {
                    const result = response.data;
                    console.log('save response: ', JSON.stringify(result));
                    if (result.status === 200) {
                        this.$message({ message: '保存成功' });
                        this.tabledata = { FirstName: '', Phone: '', Email: '', UserId: '', Amount: '' } // 保存完清空当前页面防止同一订单多次提交
                    } else {
                        if (result.msg) {
                            this.$message({ message: result.msg });
                        } else {
                            this.$message({ message: '保存失败' });
                        }
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
</script>