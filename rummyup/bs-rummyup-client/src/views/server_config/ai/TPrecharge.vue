<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>TP充值玩家控牌</strong></h3>
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
                <el-button type="primary" icon="el-icon-upload" @click="onSave()" style="margin-top: 20px">提交到服务器</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-table :data="TemplateData" style="100%" border>
                    <el-table-column :width="col_width" align="center" prop="Level" label="玩家等级"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="Payin" label="等级范围"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="SHighCard" label="小高牌"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="BHighCard" label="大高牌"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="SPair" label="小对子"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="BPair" label="大对子"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="SColor" label="小同花"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="BColor" label="大同花"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="SSequenece" label="小顺子"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="BSequenece" label="大顺子"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="SPureSequence" label="小同花顺"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="BPureSequence" label="大同花顺"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="STrailOrSet" label="小豹子"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="BTrailOrSet" label="大豹子"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-card>
</template>
<style scoped>
    .el-form-item {
        width: 100%;
        text-align: left;
    }
</style>
<script>
    import BaseUpload from '@/views/public/BaseUpload';
    export default {
        extends: BaseUpload,
        data() {
            return {
                col_width: 150,
                uploadURL: '/upload_file_tprecharge',
                saveURL: '/ai_tprecharge_save',
                getURL: '/ai_tprecharge',
                uploadData: { jsontype: 19 },
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