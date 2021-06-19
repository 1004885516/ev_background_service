<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>Practice场次配置</strong></h3>
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
                    <el-table-column align="center" prop="session_id" label="序号"></el-table-column>
                    <el-table-column align="center" prop="session_name" label="场次名称"></el-table-column>
                    <el-table-column align="center" prop="threshold" label="AI起征点"></el-table-column>
                    <el-table-column align="center" prop="base_score" label="底分"></el-table-column>
                    <el-table-column align="center" prop="min_into" label="最小进入"></el-table-column>
                    <el-table-column align="center" prop="max_into" label="最大进入"></el-table-column>
                    <el-table-column align="center" prop="service_charge" label="服务费"></el-table-column>
                    <el-table-column align="center" prop="blinds_rounds" label="盲注轮次"></el-table-column>
                    <el-table-column align="center" prop="betting_cap" label="下注上限"></el-table-column>
                    <el-table-column align="center" prop="chip_cap" label="筹码上限"></el-table-column>
                    <el-table-column align="center" prop="robot" label="机器人"></el-table-column>
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
                uploadURL: '/upload_file_practice',
                saveURL: '/session_practice_save',
                getURL: '/session_practice',
                uploadData: { jsontype: 0, serverType: 'TPPractice' },
                isPaging: false,
            }
        },
    };
</script>