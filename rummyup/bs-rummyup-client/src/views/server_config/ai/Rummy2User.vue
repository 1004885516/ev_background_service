<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>Rummy2user控牌配置</strong></h3>
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
                <el-button type="primary" icon="el-icon-upload" @click="onSave()" style="margin-top: 20px">提交本页到服务器</el-button>
                <el-button type="primary" icon="el-icon-upload" @click="onSave(true)" style="margin-top: 20px">提交全部到服务器</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-tabs v-model="gearActiveName" type="card" @tab-click="handleClick">
                    <el-tab-pane disabled label="档位"></el-tab-pane>
                    <el-tab-pane v-for="(item, k) in pageData" :key="k" :label="item.Label" :name="item.Name"></el-tab-pane>
                </el-tabs>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="2"><span class="rm-span">临近抓牌概率(%) :</span></el-col>
                    <el-col :span="1">
                        <span class="cm-span">{{ curTemplateData.NearCardPercent }}</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="2"><span class="rm-span">混子个数 :</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.GhostCardPercent" :key="i">
                        <span class="cm-span">{{ i }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2"><span class="rm-span">混子个数概率(%) :</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.GhostCardPercent" :key="i">
                        <span class="cm-span">{{ value }}</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="2"><span class="rm-span">真顺子概率(%) :</span></el-col>
                    <el-col :span="1">
                        <span class="cm-span">{{ curTemplateData.CardGroupList[0].Percent }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2"><span class="rm-span">真顺子张数 :</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.CardGroupList[0].CardNumPercent" :key="i">
                        <span class="cm-span">{{ i }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2"><span class="rm-span">真顺子张数概率(%):</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.CardGroupList[0].CardNumPercent" :key="i">
                        <span class="cm-span">{{ value }}</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="2"><span class="rm-span">假顺子概率(%) :</span></el-col>
                    <el-col :span="1">
                        <span class="cm-span">{{ curTemplateData.CardGroupList[1].Percent }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2"><span class="rm-span">假顺子张数 :</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.CardGroupList[1].CardNumPercent" :key="i">
                        <span class="cm-span">{{ i }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2"><span class="rm-span">假顺子张数概率(%):</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.CardGroupList[1].CardNumPercent" :key="i">
                        <span class="cm-span">{{ value }}</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="2"><span class="rm-span">炸弹概率(%) :</span></el-col>
                    <el-col :span="1">
                        <span class="cm-span">{{ curTemplateData.CardGroupList[2].Percent }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2"><span class="rm-span">炸弹张数 :</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.CardGroupList[2].CardNumPercent" :key="i">
                        <span class="cm-span">{{ i }}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2"><span class="rm-span">炸弹张数概率(%) :</span></el-col>
                    <el-col :span="1" v-for="(value, i) in curTemplateData.CardGroupList[2].CardNumPercent" :key="i">
                        <span class="cm-span">{{ value }}</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="2"><span class="rm-span">临近两张同花(%) :</span></el-col>
                    <el-col :span="1">
                        <span class="cm-span">{{ curTemplateData.CardGroupList[3].Percent }}</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-row>
                    <el-col :span="2"><span class="rm-span">档位修正值(%) :</span></el-col>
                    <el-col :span="1">
                        <span class="cm-span">{{ curTemplateData.PolicyRank }}</span>
                    </el-col>
                </el-row>
                <el-divider></el-divider>
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
                uploadURL: '/upload_file_rcc',
                saveURL: '/ai_rummy_save',
                getURL: '/ai_rummy',
                uploadData: { jsontype: 23, serverType: 'Rummy2User' },
                isPaging: true,
                curTemplateData: {
                    Page: 0,
                    PolicyRank: 0,
                    GhostCardPercent: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    NearCardPercent: 0,
                    CardGroupList: [
                        { GroupType: 1, Percent: 0, CardNumPercent: { '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0 } },
                        { GroupType: 2, Percent: 0, CardNumPercent: { '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0 } },
                        { GroupType: 3, Percent: 0, CardNumPercent: { '2': 0, '3': 0, '4': 0 } },
                        { GroupType: 4, Percent: 0 }
                    ]
                },
            }
        },
    };
</script>
