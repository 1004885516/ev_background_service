<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>跑马灯设置</strong></h3>
        </el-row>
        
        <el-card class="box-card" shadow="never">
            <el-row>
                <el-button type="primary" @click="setTemplate(0)">模板(欢迎)</el-button>
                <el-button type="primary" @click="setTemplate(1)">模板(更新)</el-button>
            </el-row>
            <el-divider></el-divider>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">播放次数 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.count" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">生存周期 : </span>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="tableData.live_time" placeholder="请输入内容"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">中文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.language_cn"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">英文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.language_en"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    <span class="rm-span">印地文内容 : </span>
                </el-col>
                <el-col :span="12">
                    <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.language_in"></el-input>
                </el-col>
            </el-row>
            
            <el-divider></el-divider>
            <el-row>
                <el-button type="primary" @click="onSet()">确定</el-button>
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
import EventBus from '@/utils/EventBus.js'
export default {
    data () {
        return {
            request_url: '/gm_marquee',
            tableData: {
                count: 0,
                live_time: 0,
                language_cn: '',
                language_en: '',
                language_in: '',
            },
            templateData: [
                {
                    count: 3,
                    live_time: 8640000,
                    language_cn: 'Have fun and enjoy the game！',
                    language_en: 'Have fun and enjoy the game！',
                    language_in: 'मज़े करो और खेल का आनंद लें!',
                },
                {
                    count: 3,
                    live_time: 8640000,
                    language_cn: 'Dear players, Our server will be coming down for maintenance at 15:00, please be ready',
                    language_en: 'Dear players, Our server will be coming down for maintenance at 15:00, please be ready',
                    language_in: 'प्रिय खिलाड़ियों, हमारे सर्वर 15:00 पर रखरखाव के लिए नीचे आ रहा होगा, कृपया तैयार हो',
                }
            ],
        }
    },
    mounted() {
        this.index();
    },
    created() {
        EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
    },
    methods: {
        setTemplate(index) {
            this.$set(this.tableData, 'count', this.templateData[index].count);
            this.$set(this.tableData, 'live_time', this.templateData[index].live_time);
            this.$set(this.tableData, 'language_cn', this.templateData[index].language_cn);
            this.$set(this.tableData, 'language_en', this.templateData[index].language_en);
            this.$set(this.tableData, 'language_in', this.templateData[index].language_in);
        },
        onSet() {
            const data = { data: this.tableData };
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
                const result = response.data;
                console.log('get result: ', result);
                const data = result.data;
                this.$set(this.tableData, 'count', data.count);
                this.$set(this.tableData, 'live_time', data.lifetime);
                this.$set(this.tableData, 'language_cn', data.cnMsg);
                this.$set(this.tableData, 'language_en', data.enMsg);
                this.$set(this.tableData, 'language_in', data.inMsg);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>