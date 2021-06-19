<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>验证码查询</strong></h3>
            </div>
        </div>
        <el-row>
            <div class="block">
                <el-card class="box-card">
                    <span class="demonstration" style="margin-right: 10px">手机号</span>
                    <el-input placeholder="请输入手机号" v-model="phoneCode" style="width:200px; margin-right: 30px"
                        onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="10">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                </el-card>
            </div>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card class="box-card">
                    <span></span>
                    <template v-if="verify_code"><span style="line-height: 40px;">{{verify_code}}</span></template>
                    <template v-else><span>无验证码</span></template>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data () {
            return {
                request_url: 'otp_query',
                phoneCode: '',
                verify_code: ''
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        methods: {
            search() {
                const phoneCode = this.phoneCode;
                if (!phoneCode) {
                    this.$message({ message: '请输入手机号' });
                    return;
                }   
                const params = { phoneCode: phoneCode };
                this.gt.httpPost(this.request_url, params).then((response) => {
                    console.log('base data response.data :', response.data);
                    const result = response.data.result;
                    this.verify_code = result.verify_code;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>