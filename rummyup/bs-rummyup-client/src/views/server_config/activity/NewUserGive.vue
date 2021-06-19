<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>新用户赠送配置</strong></h3>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">手机赠送 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.PhoneGive"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">Facebook赠送 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.FBGive"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">游客赠送 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.GuestGive"></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">最大赠送次数 : </span>
            </el-col>
            <el-col :span="2">
                <el-input v-model="tabledata.MaxGive"></el-input>
            </el-col>
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
            tabledata: { PhoneGive: 0, FBGive: 0, GuestGive: 0, MaxGive: 0 },
        }
    },
    mounted() {
        this.index();
    },
    methods: {
        onSave() {
            const data = { data: this.tabledata };
            this.gt.httpPost('/activity_newusergive', data).then((response) => {
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
            this.gt.httpGet('/activity_newusergive').then((response) => {
                const result = response.data.result;
                console.log('httpGet result.NewUserGiveData : ', result.NewUserGiveData);
                const data = result.NewUserGiveData;
                this.$set(this.tabledata, 'PhoneGive', data.PhoneGive);
                this.$set(this.tabledata, 'FBGive', data.FBGive);
                this.$set(this.tabledata, 'GuestGive', data.GuestGive);
                this.$set(this.tabledata, 'MaxGive', data.MaxGive);
            }).catch(function (error) {
                console.log(error);
            });
        },
    }
}
</script>