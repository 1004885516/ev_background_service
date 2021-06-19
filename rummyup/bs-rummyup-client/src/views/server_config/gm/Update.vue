<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>更新配置</strong></h3>
        </el-row>
        
        <el-card class="box-card" shadow="never">
            <el-row>
                <el-col :span="4">
                    <el-select style="margin-left: 60px;" v-model="selected1" placeholder="玩法选择">
                        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">白名单(ID)</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="15" style="margin-left: 60px;">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="textarea">
                    </el-input>
                </el-col>
            </el-row>
            <el-row style="margin-left: 60px;">
                <el-button type="primary" @click="search()">设置</el-button>
            </el-row>
        </el-card>
        <el-divider></el-divider>
        <el-row :gutter="20">
            <h3><strong>是否允许相同IP和相同设备ID进入同一房间</strong></h3>
        </el-row>
        <el-card class="box-card" shadow="never">
            <el-row style="margin-left: 60px;">
                <el-col :span="1">
                    <span class="rm-span"> CheckIP: </span>
                </el-col>
                <el-col :span="1">
                    <el-input v-model="CheckIp"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-left: 60px;">
                <el-col :span="1">
                    <span class="rm-span"> CheckDeviceId: </span>
                </el-col>
                <el-col :span="1">
                    <el-input v-model="CheckDeviceId"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-left: 60px;">
                <el-button type="primary" @click="setIpConfig()">设置</el-button>
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
export default {
    data () {
        return {
            request_url: '/server_update',
            set_ip_config_url: '/set_ip_config',
            options1: [
                { value: 0, label: '维护中' },
                { value: 1, label: '开服中' }
            ],
            selected1: 0,
            textarea: '',
            options2: [
                { value: 0, label: '否' },
                { value: 1, label: '是' }
            ],
            selected2: 0,
            CheckIp: 0,
            CheckDeviceId: 0
        }
    },
    mounted() {
        this.index();
    },
    methods: {
        index () {
            this.gt.httpGet(this.request_url).then((response) => {
                const result = response.data.result.data;
                console.log('httpGet result : ', result);
                this.selected1 = result.upDate.Status;
                this.textarea = result.upDate.WhiteList;
                this.CheckIp = result.ipConfig.CheckIp;
                this.CheckDeviceId = result.ipConfig.CheckDeviceId;
            }).catch(function (error) {
                console.log(error);
            });
        },
        search() {
            let params = { Status: this.selected1, WhiteList: this.textarea };
            this.gt.httpPost(this.request_url, params).then((response) => {
                console.log('base data response.data :', response.data);
                const result = response.data;
                if (result.status === 200) {
                    this.$message({ message: '保存成功' });
                } else {
                    this.$message({ message: '保存失败' });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        setIpConfig() {
            let params = { CheckIp: this.CheckIp, CheckDeviceId: this.CheckDeviceId };
            this.gt.httpPost(this.set_ip_config_url, params).then((response) => {
                console.log('base data response.data :', response.data);
                const result = response.data;
                if (result.status === 200) {
                    this.$message({ message: '保存成功' });
                } else {
                    this.$message({ message: '保存失败' });
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>