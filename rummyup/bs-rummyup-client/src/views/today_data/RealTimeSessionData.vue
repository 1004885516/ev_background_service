<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>实时数据(今日-场次)</strong></h3>
        </el-row>
        <el-row>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>Rummy场次</h5>
                    <h1>{{ rummy }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>Rummy 2人场次</h5>
                    <h1>{{ rummy2User }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>TeenPatti场次</h5>
                    <h1>{{ teenpatti }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>TeenPatti Speed场次</h5>
                    <h1>{{ teenpattiSpeed }}</h1>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>AK47场次</h5>
                    <h1>{{ ak47 }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>LowestJoker场次</h5>
                    <h1>{{ lowJoker }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>HighestJoker场次</h5>
                    <h1>{{ highJoker }}</h1>
                </el-card>
            </el-col>
            <el-col :span="4">
                <el-card class="box-card">
                    <h5>DragonVSTiger场次</h5>
                    <h1>{{ dragonVSTiger }}</h1>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
             <el-col :span="4">
                <el-card class="box-card">
                    <h5>总场次</h5>
                    <h1>{{ total }}</h1>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>

<style>
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
    }
    .span {
        text-align: center;
        display:block;
    }
</style>

<script>
    import EventBus from '@/utils/EventBus.js'
    export default {
        name: 'RealTimeData',
        data () {
            return {
                rummy: 0, 
                teenpatti: 0,
                rummy2User: 0,
                teenpattiSpeed: 0,
                ak47: 0,
                lowJoker: 0,
                highJoker: 0,
                dragonVSTiger: 0,
                total: 0
            }
        },
        created () {
            EventBus.$emit(this.gd.EventId.CHANNEL_APK_VISIBLE, false);
        },
        beforeDestroy () {
            EventBus.$off(this.gd.EventId.CHANGE_APK_ID);
        },
        mounted () {
            EventBus.$on(this.gd.EventId.CHANGE_APK_ID, () => {
                console.log('on change package id : ', this.gt.getApkId());
            })
            this.getData();
        },
        methods: {
            getData() {
                this.gt.httpGet('/realtime_data', { type: 2 }).then((response) => {
                    const result = response.data.result;
                    console.log('result', result);
                    this.rummy = result.Rummy;
                    this.teenpatti = result.TeenPatti;
                    this.rummy2User = result.Rummy2User;
                    this.teenpattiSpeed = result.QuickTP;
                    this.ak47 = result.Ak47;
                    this.lowJoker = result.LowJoker;
                    this.highJoker = result.HighJoker;
                    this.dragonVSTiger = result.DragonVSTiger;
                    this.total = result.Total;
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
</script>