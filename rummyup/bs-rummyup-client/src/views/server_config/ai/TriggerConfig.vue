<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>触发配置</strong></h3>
        </el-row>
        <el-row class="mb-20">
            <el-col :span="6">
                <el-upload class="upload-demo" :on-success="onUploadSuccess" drag :data="uploadData" :action="`${baseUploadURL}${uploadURL}`" :headers="myHeaders">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </el-col>
            <el-col :span="6" style="text-align: left">
                <el-select v-model="indexTemplate" placeholder="历史记录" style="width: 500px; margin-right: 50px" @change="onChangeTemplate">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-upload" @click="onSave()" style="margin-top: 20px">提交到服务器</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-table :data="TemplateData" style="100%" border>
                    <el-table-column align="center" prop="ID" label="ID"></el-table-column>
                    <el-table-column align="center" prop="UserType" label="玩家类型"></el-table-column>
                    <el-table-column align="center" prop="Rank" label="档位"></el-table-column>
                    <el-table-column align="center" prop="TheGameTimes" label="游戏次数"></el-table-column>
                    <el-table-column align="center" prop="GameName" label="对应玩法"></el-table-column>
                    <el-table-column align="center" prop="BaseScore" label="倍数场"></el-table-column>
                    <!-- <el-table-column align="center" prop="LoseRoundNum" label="轮数"></el-table-column> -->
                    <!-- <el-table-column align="center" prop="RAPercent" label="未离桌剧情概率"></el-table-column> -->
                    <el-table-column align="center" prop="Percent" label="触发概率"></el-table-column>
                    <el-table-column align="center" prop="EventID" label="事件ID"></el-table-column>
                    <el-table-column align="center" prop="EventPercent" label="事件概率"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import BaseUpload from '@/views/public/BaseUpload';
    export default {
        extends: BaseUpload,
        data() {
            return {
                uploadURL: '/upload_file_trigger',
                saveURL: '/ai_trigger_config_save',
                getURL: '/ai_trigger_config',
                uploadData: { jsontype: 16 },
                isPaging: false,
            }
        },
    };
</script>