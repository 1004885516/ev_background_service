<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>AK47场次配置</strong></h3>
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
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="00:00-02:00"><span>{{ props.row.online_users0_2 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="02:00-04:00"><span>{{ props.row.online_users2_4 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="04:00-06:00"><span>{{ props.row.online_users4_6 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="06:00-08:00"><span>{{ props.row.online_users6_8 }}</span></el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="08:00-10:00"><span>{{ props.row.online_users8_10 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="10:00-12:00"><span>{{ props.row.online_users10_12 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="12:00-14:00"><span>{{ props.row.online_users12_14 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="14:00-16:00"><span>{{ props.row.online_users14_16 }}</span></el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="16:00-18:00"><span>{{ props.row.online_users16_18 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="18:00-20:00"><span>{{ props.row.online_users18_20 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="20:00-22:00"><span>{{ props.row.online_users20_22 }}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item style="text-align: left" label="22:00-24:00"><span>{{ props.row.online_users22_24 }}</span></el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </template>
                    </el-table-column>
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
                uploadURL: '/upload_file_ak47',
                saveURL: '/session_ak47_save',
                getURL: '/session_ak47',
                uploadData: { jsontype: 9, serverType: 'Ak47' },
                isPaging: false,
            }
        },
    };
</script>