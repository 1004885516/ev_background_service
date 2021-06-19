<template>
    <el-card class="box-card">
        <el-row>
            <h3><strong>操作记录</strong></h3>
        </el-row>
        <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
                <el-card>
                    <h4>更新 Github 模板</h4>
                    <p>王小虎 提交于 2018/4/12 20:46</p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
                <el-card>
                    <h4>更新 Github 模板</h4>
                    <p>王小虎 提交于 2018/4/3 20:46</p>
                </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
                <el-card>
                    <h4>更新 Github 模板</h4>
                    <p>王小虎 提交于 2018/4/2 20:46</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </el-card>
</template>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        data() {
            return {
            }
        },
        created() {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        beforeDestroy() {
        },
        mounted () {
        },
        methods: {
            
        }
    }
</script>