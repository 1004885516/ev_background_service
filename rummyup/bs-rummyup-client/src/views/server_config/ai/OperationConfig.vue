<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>操作配置</strong></h3>
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
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-table :data="TemplateData" style="100%" border>
                    <el-table-column align="center" prop="id" label="操作ID"></el-table-column>
                    <el-table-column align="center" prop="robot_oper" label="操作"></el-table-column>
                    <el-table-column align="center" prop="robot_oper_time" label="操作时间"></el-table-column>
                    <el-table-column align="center" prop="reject_compare" label="拒牌概率"></el-table-column>
                    <el-table-column align="center" prop="seen_card_type" label="看牌类型"></el-table-column>
                    <el-table-column align="center" prop="seen_card_time" label="看牌时间"></el-table-column>
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
                uploadURL: '/upload_file_operation',
                getURL: '/ai_operation_config',
                uploadData: { jsontype: 18 },
                isPaging: true,
                TemplateData: [],
            }
        },
        methods: {
            robotHandleClick(tab, event) {
                console.log('robotHandleClick : ', tab.index, event);
            },
        }
    };
</script>