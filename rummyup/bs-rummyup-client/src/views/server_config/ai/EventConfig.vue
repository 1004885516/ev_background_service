<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>事件配置</strong></h3>
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
                    <el-table-column type="expand">
                         <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand" v-if="props.row.office" label-width="auto">
                                <el-divider></el-divider>
                                <el-row>
                                    <el-col :span="4" style="margin-right: 0px">
                                        <el-form-item label="荷官拒牌:" label-width="auto"><span>{{ props.row.office.RejectCompare }}</span></el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="荷官操作:">
                                    <span v-for="(item, index) in props.row.office.RobotOper" :key="index">{{ item }}</span>
                                </el-form-item>
                                <el-divider></el-divider>

                                <el-row>
                                    <el-col :span="4" style="margin-right: 0px">
                                        <el-form-item label="普通1拒牌:" label-width="auto"><span>{{ props.row.other[0].RejectCompare }}</span></el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="普通1操作:">
                                    <span v-for="(item, index) in props.row.other[0].RobotOper" :key="index">{{ item }}</span>
                                </el-form-item>
                                <el-divider></el-divider>
                                 <el-row>
                                    <el-col :span="4" style="margin-right: 0px">
                                        <el-form-item label="普通2拒牌:" label-width="auto"><span>{{ props.row.other[1].RejectCompare }}</span></el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="普通2操作:">
                                    <span v-for="(item, index) in props.row.other[1].RobotOper" :key="index">{{ item }}</span>
                                </el-form-item>
                                <el-divider></el-divider>
                                <el-row>
                                    <el-col :span="4" style="margin-right: 0px">
                                        <el-form-item label="普通3拒牌:" label-width="auto"><span>{{ props.row.other[2].RejectCompare }}</span></el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="普通3操作:">
                                    <span v-for="(item, index) in props.row.other[2].RobotOper" :key="index">{{ item }}</span>
                                </el-form-item>
                                <el-divider></el-divider>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="event_id" label="事件ID"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="ai_num" label="AI数量"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="player_cards" label="玩家牌型"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="player_percent" label="玩家牌型概率"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="office_cards" label="荷官牌型"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="office_percent" label="荷官牌型概率"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_cards" label="普通牌型"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_percent" label="普通牌型概率"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="office_is_big" label="荷官比真人大"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="office_ids" label="荷官操作ID"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="office_after_dul" label="荷官行为概率"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_ids1" label="普通1操作ID"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_after_dul1" label="普通1行为概率"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_ids2" label="普通2操作ID"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_after_dul2" label="普通2行为概率"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_ids3" label="普通3操作ID"></el-table-column>
                    <el-table-column :width="col_width" align="center" prop="other_after_dul3" label="普通3行为概率"></el-table-column>
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
                uploadURL: '/upload_file_event',
                saveURL: '/ai_event_save',
                getURL: '/ai_event',
                uploadData: { jsontype: 17 },
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