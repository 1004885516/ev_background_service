<template>
    <el-card class="box-card">
        <el-row :gutter="20" class="mb-20">
            <h3><strong>发送用户邮件</strong></h3>
        </el-row>
        <el-row>
            <el-button type="primary" @click="setTemplate(0)">模板(自拍照片不符)</el-button>
            <el-button type="primary" @click="setTemplate(1)">模板(信用卡照片不符)</el-button>
            <el-button type="primary" @click="setTemplate(2)">模板(信用卡照片不清楚)</el-button>
            <el-button type="primary" @click="setTemplate(3)">模板(城市和地区填写信息不全)</el-button>
            <el-button type="primary" @click="setTemplate(4)">模板(所在被禁止地区)</el-button>
            <el-button type="primary" @click="setTemplate(5)">模板(用户提现手机号审核失败)</el-button>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">英文标题 : </span>
            </el-col>
            <el-col :span="6">
                <el-input v-model="tableData.EnMailTitle" placeholder="请输入内容"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">英文内容 : </span>
            </el-col>
            <el-col :span="12">
                <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.EnMailContent"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">印地文标题 : </span>
            </el-col>
            <el-col :span="6">
                <el-input v-model="tableData.InMailTitle" placeholder="请输入内容"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">印地文内容 : </span>
            </el-col>
            <el-col :span="12">
                <el-input resize="none" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="tableData.InMailContent"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">增减金币 : </span>
            </el-col>
            <el-col :span="6">
                <el-input v-model="tableData.TeenPattiGold"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="2">
                <span class="rm-span">用户ID : </span>
            </el-col>
            <el-col :span="6">
                <el-input v-model="tableData.UserId" placeholder=""></el-input>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-button type="primary" icon="el-icon-message" @click="onSend()">发送邮件</el-button>
        </el-row>
    </el-card>
</template>

<style scoped>
    .el-col {
        text-align: left;
        margin-right: 20px;
    }
    .rm-span {/* 右对齐, 上下居中 */
        float: right;
        line-height: 40px;
    }
    .h-textarea {
        height: 40px;
        min-height: 40px;
        line-height: 40px;
    }
    .el-row {
        margin-top: 20px;
    }
</style>

<script>
import EventBus from '@/utils/EventBus.js'
export default {
    data () {
        return {
            tableData: {
                UserId: 0,
                EnMailTitle: '',
                EnMailContent: '',
                InMailTitle: '',
                InMailContent: '',
                RummyGold: 0,
                TeenPattiGold: 0,
            },
            templateData: [
                {
                    EnMailTitle: 'Dear Users',
                    EnMailContent: `Sorry, The Photo Click in the KYC information you submitted does not match, It's should be a selfie, please fill in again.`,
                    InMailTitle: 'प्रिय उपयोगकर्ता',
                    InMailContent: 'क्षमा करें, आपके द्वारा सबमिट की गई केवाईसी जानकारी में फोटो क्लिक मेल नहीं खाती है, यह एक सेल्फी होनी चाहिए, कृपया फिर से भरें।',
                },
                {
                    EnMailTitle: 'Dear Users',
                    EnMailContent: 'Sorry, the photo you clicked on in the KYC information you submitted does not match. It should be the photo on the front of the credit card. Please fill in again.',
                    InMailTitle: 'प्रिय उपयोगकर्ता',
                    InMailContent: 'क्षमा करें, आपके द्वारा सबमिट की गई केवाईसी जानकारी में आपने जिस फोटो पर क्लिक किया है, वह मेल नहीं खाती है। यह क्रेडिट कार्ड के सामने की तस्वीर होनी चाहिए। कृपया फिर से भरें।',
                },
                {
                    EnMailTitle: 'Dear Users',
                    EnMailContent: 'Sorry, the photo clicked in the KYC information you submitted does not match.The photo of id card is not clear.Please re-upload.',
                    InMailTitle: 'प्रिय उपयोगकर्ता',
                    InMailContent: 'क्षमा करें, आपके द्वारा सबमिट की गई केवाईसी जानकारी में क्लिक की गई फोटो मेल नहीं खाती है। पहचान पत्र की फोटो स्पष्ट नहीं है। कृपया फिर से अपलोड करें।',
                },
                {
                    EnMailTitle: 'Dear Users',
                    EnMailContent: 'Sorry, the city and address information you filled in is not complete, please fill in again.',
                    InMailTitle: 'प्रिय उपयोगकर्ता',
                    InMailContent: 'क्षमा करें, शहर और पता जानकारी आप में भरा पूरा नहीं है, कृपया फिर से भरें',
                },
                {
                    EnMailTitle: 'Dear Users',
                    EnMailContent: 'We are so sorry to inform you that this type of game is not allowed in your area.',
                    InMailTitle: 'प्रिय उपयोगकर्ता',
                    InMailContent: 'हमें आपको सूचित करने के लिए खेद है कि आपके क्षेत्र में इस प्रकार के खेल की अनुमति नहीं है',
                },
                {
                    EnMailTitle: 'Dear Users',
                    EnMailContent: 'There was an error in the telephone number you filled in when you withdrew money. It\'s not valid. Please fill in correctly and resubmit.',
                    InMailTitle: 'प्रिय उपयोगकर्ता',
                    InMailContent: 'पैसे निकालने पर आपके द्वारा भरे गए टेलीफोन नंबर में गड़बड़ी हुई। यह मान्य नहीं है। कृपया सही ढंग से भरें और फिर से सबमिट करें',
                },
            ],
        }
    },
    created() {
        EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
    },
    methods: {
        onSend() {
            this.gt.httpPost('/send_user_mail', this.tableData).then((response) => {
                if (response.data.status === 200) {
                    const msg = response.data.msg;
                    this.$message({ message: `发送${msg}` });
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        setTemplate(index) {
            this.$set(this.tableData, 'EnMailTitle', this.templateData[index].EnMailTitle);
            this.$set(this.tableData, 'EnMailContent', this.templateData[index].EnMailContent);
            this.$set(this.tableData, 'InMailTitle', this.templateData[index].InMailTitle);
            this.$set(this.tableData, 'InMailContent', this.templateData[index].InMailContent);
        },
    }
}
</script>