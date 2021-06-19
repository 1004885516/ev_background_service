<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>转盘配置</strong></h3>
        </el-row>
        <el-row class="mb-20">
            <el-col :span="6">
                <el-upload class="upload-demo" :on-success="onUploadSuccess" drag :action="uploadURL" :headers="myHeaders">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-col>
            <el-col :span="6">
                <el-row class="mb-20">
                    <el-select v-model="historyTemplate" placeholder="历史记录" style="width: 400px; margin-right: 50px">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-row>
                <el-row class="mb-20">
                    <el-button type="primary" icon="el-icon-upload" @click="onSave()">提交到服务器</el-button>
                </el-row>
                <el-row class="mb-20">
                    <span>每日转盘次数 : {{ dailyNumber }}</span>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-table :data="prizeList" style="100%" border>
                    <el-table-column align="center" prop="id" label="ID"></el-table-column>
                    <el-table-column align="center" prop="prize_type" label="奖励类型"></el-table-column>
                    <el-table-column align="center" prop="prize_name" label="奖励名称"></el-table-column>
                    <el-table-column align="center" prop="prize_num" label="奖励数量"></el-table-column>
                    <el-table-column align="center" prop="prize_icon" label="奖励图标"></el-table-column>
                    <el-table-column align="center" prop="chance" label="中奖几率"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import { getToken } from '@/utils/Cookies.js'
export default {
    data () {
        return {
            uploadURL: `${process.env.VUE_APP_REQUEST_URL}/upload_file_turntable`,
            prizeList: [],
            dailyNumber: 0,
            historyTemplate: '',
            options: [],
            myHeaders: '',
        }
    },
    mounted() {
        this.index();
    },
    created() {
        this.myHeaders = { Authorization: getToken() };
    },
    methods: {
        onSave() {
            const data = { filename: this.options[this.historyTemplate].filename };
            this.gt.httpPost('/activity_turntable', data).then((response) => {
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
        onUploadSuccess(response) {
            const result = response.result;
            this.updateTurntableData(result);
        },
        index() {
            this.gt.httpGet('/activity_turntable').then((response) => {
                const result = response.data.result;
                console.log('httpGet result.TurntableData : ', result.TurntableData);
                this.updateTurntableData(result);
            }).catch(function (error) {
                console.log(error);
            });
        },
        updateTurntableData(result) {
            this.prizeList = [];
            this.dailyNumber = result.TurntableData.daily_number;
            for (let i = 0; i < result.TurntableData.prize_list.length; i++) {
                this.prizeList.push(result.TurntableData.prize_list[i]);
            }
            this.updateTemplate(result.TemplateFiles);
        },
        updateTemplate(tfs) {
            this.options = [];
            for (let i = 0; i < tfs.length; i++) {
                const data = tfs[i];
                const item = { value: i, label: data.filename, filename: data.filename };
                if (data.createtime) {
                    item.label += `(${data.createtime})`;
                }
                this.options.push(item);
            }
            this.historyTemplate = this.options[0].value;
        },
    }
}
</script>

<style>
    .el-divider--horizontal {
        margin: 15px;
    }
    .el-row {
        margin: 0px;
    }
    .el-input {
        width: 80%;
    }
    .el-col {
        text-align: center;
    }
    .rm-span {/* 右对齐, 上下居中 */
        float: right;
        line-height: 40px;
    }
    .cm-span {
        float: center;
        line-height: 40px;
    }
    .h-40 {
        height: 40px;
    }
</style>
