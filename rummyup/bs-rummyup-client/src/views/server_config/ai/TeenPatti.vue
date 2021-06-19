<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>TeenPatti控牌配置</strong></h3>
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
                <el-row>
                    <el-col :span="1">
                        <span>真人</span>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="1">
                        <span>牌型</span>
                    </el-col>
                    <el-col :span="1" v-for="(item, l) in cardTypeArr" :key="l">
                        <span>{{ item.Label }}</span>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="1">
                        <template v-if="isCanInput"><span style="line-height: 40px;">概率</span></template>
                        <template v-else><span>概率</span></template>
                    </el-col>
                    <el-col :span="1" v-for="(item, l) in cardTypeArr" :key="l">
                        <template v-if="isCanInput"><el-input v-model="curTemplateData.PlayerPolicy[l]"></el-input></template>
                        <template v-else><span>{{ curTemplateData.PlayerPolicy[l] }}</span></template>
                    </el-col>
                </el-row>
                <!-- 机器人 -->
                <el-row :gutter="20" style="margin-top: 20px;">
                    <el-col :span="2">
                        <template v-if="isCanInput"><span style="line-height: 40px;">荷官牌大于真人</span></template>
                        <template v-else><span>荷官牌大于真人</span></template>
                    </el-col>
                    <el-col :span="1">
                        <template v-if="isCanInput"><el-input v-model="curTemplateData.OfficeIsBig"></el-input></template>
                        <template v-else><span>{{ curTemplateData.OfficeIsBig }}</span></template>
                    </el-col>
                </el-row>
                <el-row :gutter="20" style="margin-top: 20px;">
                    <el-col :span="2">
                        <template v-if="isCanInput"><span style="line-height: 40px;">档位修正值</span></template>
                        <template v-else><span>档位修正值</span></template>
                    </el-col>
                    <el-col :span="1">
                        <template v-if="isCanInput"><el-input v-model="curTemplateData.PolicyRank"></el-input></template>
                        <template v-else><span>{{ curTemplateData.PolicyRank }}</span></template>
                    </el-col>
                </el-row>
                <el-tabs v-model="robotActiveName" type="card" @tab-click="robotHandleClick">
                    <el-tab-pane disabled label="机器人"></el-tab-pane>
                    <el-tab-pane v-for="(robotItem, r) in robotTypeArr" :key="r" :label="robotItem.Label" :name="robotItem.Name">
                        <el-card class="box-card interval-height" shadow="never">
                            <el-row :gutter="20" v-for="i in cardRow" :key="i">
                                <el-col :span="12" v-for="j in cardCol" :key="j" style="margin-right: 0px">
                                    <el-card class="box-card" style="margin-top: 0px; margin-right: 0px" shadow="never">
                                        <el-row>
                                            <el-col :span="2">
                                                <template v-if="isCanInput"><span style="line-height: 40px;">{{ cardTypeArr[(i - 1) * 2 + (j - 1)].Label }}</span></template>
                                                <template v-else><span>{{ cardTypeArr[(i - 1) * 2 + (j - 1)].Label }}</span></template>
                                            </el-col>
                                            <template v-if="r == 0">
                                                <el-col :offset="1" :span="1.5">
                                                    <template v-if="isCanInput"><span style="line-height: 40px;">概率</span></template>
                                                    <template v-else><span>概率</span></template>
                                                </el-col>
                                                <el-col :span="1">
                                                    <template v-if="isCanInput"><el-input v-model="curTemplateData.OfficePolicy[(i - 1) * 2 + (j - 1)]"></el-input></template>
                                                    <template v-else><span>{{ curTemplateData.OfficePolicy[(i - 1) * 2 + (j - 1)] }}</span></template>
                                                </el-col>
                                            </template>
                                            <template v-if="r == 0">
                                                <el-col :offset="1" :span="1.5">
                                                    <template v-if="isCanInput"><span style="line-height: 40px;">拒绝比牌</span></template>
                                                    <template v-else><span>拒绝比牌</span></template>
                                                </el-col>
                                                <el-col :span="1">
                                                    <template v-if="isCanInput"><el-input v-model="curTemplateData.OfficeRejectCompare[(i - 1) * 2 + (j - 1)]"></el-input></template>
                                                    <template v-else><span>{{ curTemplateData.OfficeRejectCompare[(i - 1) * 2 + (j - 1)] }}</span></template>
                                                </el-col>
                                            </template>
                                            <template v-else>
                                                <el-col :offset="1" :span="1.5">
                                                    <template v-if="isCanInput"><span style="line-height: 40px;">拒绝比牌</span></template>
                                                    <template v-else><span>拒绝比牌</span></template>
                                                </el-col>
                                                <el-col :span="1">
                                                    <template v-if="isCanInput"><el-input v-model="curTemplateData.OtherRejectCompare[(i - 1) * 2 + (j - 1)]"></el-input></template>
                                                    <template v-else><span>{{ curTemplateData.OtherRejectCompare[(i - 1) * 2 + (j - 1)] }}</span></template>
                                                </el-col>
                                            </template>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="2"><span style="line-height: 40px;">操作</span></el-col>
                                            <el-col :span="2" v-for="n in roundArr" :key="n"><span style="line-height: 40px;">第{{ n }}轮</span></el-col>
                                        </el-row>
                                        <el-row>
                                            <template v-if="isCanInput"><el-col :span="2"><span style="line-height: 40px;">{{ optArr[0] }}</span></el-col></template>
                                            <template v-else><el-col :span="2"><span>{{ optArr[0] }}</span></el-col></template>
                                            <el-col :span="2" v-for="n in roundArr" :key="n">
                                                <template v-if="r == 0">
                                                    <template v-if="isCanInput"><el-input v-model="curTemplateData.OfficeRobot[(i - 1) * 2 + (j - 1)].SeenCard[n - 1]"></el-input></template>
                                                    <template v-else><span>{{ curTemplateData.OfficeRobot[(i - 1) * 2 + (j - 1)].SeenCard[n - 1] }}</span></template>
                                                </template>
                                                <template v-else>
                                                    <template v-if="isCanInput"><el-input v-model="curTemplateData.OtherRobot[(i - 1) * 2 + (j - 1)].SeenCard[n - 1]"></el-input></template>
                                                    <template v-else><span>{{ curTemplateData.OtherRobot[(i - 1) * 2 + (j - 1)].SeenCard[n - 1] }}</span></template>
                                                </template>
                                            </el-col>
                                        </el-row>
                                        <el-row v-for="x in 4" :key="x">
                                            <template v-if="isCanInput"><el-col :span="2"><span style="line-height: 40px;">{{ optArr[x] }}</span></el-col></template>
                                            <template v-else><el-col :span="2"><span>{{ optArr[x] }}</span></el-col></template>
                                            <el-col :span="2" v-for="n in roundArr" :key="n">
                                                <template v-if="r == 0">
                                                    <template v-if="isCanInput"><el-input v-model="curTemplateData.OfficeRobot[(i - 1) * 2 + (j - 1)].RobotOper[n - 1][x - 1]"></el-input></template>
                                                    <template v-else><span>{{ curTemplateData.OfficeRobot[(i - 1) * 2 + (j - 1)].RobotOper[n - 1][x - 1] }}</span></template>
                                                </template>
                                                <template v-else>
                                                    <template v-if="isCanInput"><el-input v-model="curTemplateData.OtherRobot[(i - 1) * 2 + (j - 1)].RobotOper[n - 1][x - 1]"></el-input></template>
                                                    <template v-else><span>{{ curTemplateData.OtherRobot[(i - 1) * 2 + (j - 1)].RobotOper[n - 1][x - 1] }}</span></template>
                                                </template>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>
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
                uploadURL: '/upload_file_tpcc',
                saveURL: '/ai_teenpatti_save',
                getURL: '/ai_teenpatti',
                uploadData: { jsontype: 1, serverType: 'TeenPatti' },
                isPaging: true,
                curTemplateData: {
                    Page: 0, OfficeIsBig: 0, PolicyRank: 0, PlayerPolicy: [ 1, 0, 0, 0, 0, 0 ], OfficePolicy: [ 1, 0, 0, 0, 0, 0 ], OfficeRejectCompare: [ 1, 0, 0, 0, 0, 0 ], OtherRejectCompare: [ 1, 0, 0, 0, 0, 0 ],
                    OfficeRobot: [
                        { CardType: 0, SeenCard: [ 100, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 1, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 2, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 3, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 4, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 5, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                    ],
                    OtherRobot: [
                        { CardType: 0, SeenCard: [ 200, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 4, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 1, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 2, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 3, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 4, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                        { CardType: 5, SeenCard: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], RobotOper: [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ] },
                    ],
                },
                roundArr: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
                optArr: [ '看牌', '跟注', '加倍', '比牌', '弃牌' ],
                isCanInput: false,
                cardCol: 2,
                cardRow: 3,
                cardTypeArr: [
                    { Label: '高牌', Name: 'gaopai' },
                    { Label: '对子', Name: 'duizi' },
                    { Label: '同花', Name: 'tonghua' },
                    { Label: '顺子', Name: 'shunzi' },
                    { Label: '同花顺', Name: 'tonghuashun' },
                    { Label: '豹子', Name: 'baozi' },
                ],
                robotActiveName: 'hegan',
                robotTypeArr: [
                    { Label: '荷官机器人', Name: 'hegan' },
                    { Label: '普通机器人', Name: 'ordinary' }
                ],
            }
        },
        methods: {
            robotHandleClick(tab, event) {
                console.log('robotHandleClick : ', tab.index, event);
            },
        }
    };
</script>