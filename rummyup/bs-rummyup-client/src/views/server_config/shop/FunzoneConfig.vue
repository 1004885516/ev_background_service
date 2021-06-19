<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>Funzone配置</strong></h3>
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
        <el-row style="margin-top: 20px">
            <el-card class="box-card" style="width: 100%" shadow="never">
                <el-row>
                    <el-col :span="2" style="text-align: right"><span>单次最小提现金额 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ TemplateData[0].MinPayout }}</span></el-col>
                    <el-col :span="2" style="text-align: right"><span>单次最大提现金额 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ TemplateData[0].MaxPayout }}</span></el-col>
                    <el-col :span="2" style="text-align: right"><span>每日提现次数上限 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ TemplateData[0].PayoutCount }}</span></el-col>
                    <el-col :span="2" style="text-align: right"><span>提现留存 :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ TemplateData[0].Retained }}</span></el-col>
                </el-row>
                <el-row style="margin-top: 30px">
                    <el-col :span="2" style="text-align: right"><span>提现税费(%) :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ TemplateData[0].Tax }}</span></el-col>
                    <el-col :span="2" style="text-align: right"><span>AppId :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ TemplateData[0].AppId }}</span></el-col>
                    <el-col :span="2" style="text-align: right"><span>SerectKey :</span></el-col>
                    <el-col :span="4" style="text-align: left"><span>{{ TemplateData[0].SerectKey }}</span></el-col>
                    <el-col :span="2" style="text-align: right"><span></span></el-col>
                    <el-col :span="4" style="text-align: left"><span></span></el-col>
                </el-row>
            </el-card>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="TemplateData[0].ExtraConfig" style="100%" border>
                    <el-table-column align="center" prop="Minimum" label="最小充值金额"></el-table-column>
                    <el-table-column align="center" prop="Maximum" label="最大充值金额"></el-table-column>
                    <el-table-column align="center" prop="FirstExtra" label="首冲赠送(%)"></el-table-column>
                    <el-table-column align="center" prop="Extra" label="额外赠送(%)"></el-table-column>
                    <el-table-column align="center" prop="BeginTime" label="赠送开始时间"></el-table-column>
                    <el-table-column align="center" prop="EndTime" label="赠送结束时间"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-table :data="TemplateData[0].ItemList" style="100%" border>
                    <el-table-column align="center" prop="SerialNumber" label="序号"></el-table-column>
                    <el-table-column align="center" prop="Count" label="显示金额"></el-table-column>
                    <el-table-column align="center" prop="Icon" label="图标"></el-table-column>
                    <el-table-column align="center" prop="IsHot" label="热卖图标"></el-table-column>
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
                TemplateData: [
                    {
                        MinPayout: 0, MaxPayout: 0, PayoutCount: 0, Retained: 0, Tax: 0, AppId: 0, SerectKey: 0,
                        ExtraConfig: [{ Minimum: 0, Maximum: 0, FirstExtra: 0, Extra: 0, BeginTime: 0, EndTime: 0 }],
                        ItemList: [{ SerialNumber: 0, Count: 0, Icon: 0, IsHot: 0 }],
                    }
                ],
                uploadURL: '/upload_file_scf',
                saveURL: '/shop_config_fun_save',
                getURL: '/shop_config_fun',
                uploadData: { jsontype: 21 },
                isPaging: false,
            }
        },
    };
</script>
