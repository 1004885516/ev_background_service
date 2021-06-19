<template>
    <el-card class="box-card">
        <el-row :gutter="20">
            <h3><strong>实时数据(今日-房间)</strong></h3>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">Rummy房间数</span>
                    <el-table :data="rummyRoom" style="100%">
                        <el-table-column align="center" prop="name" label="场次"></el-table-column>
                        <el-table-column align="center" prop="data" label="房间数"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">Rummy(2人)房间数</span>
                    <el-table :data="rummyP2Room" style="100%">
                        <el-table-column align="center" prop="name" label="场次"></el-table-column>
                        <el-table-column align="center" prop="data" label="房间数"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">TeenPatti房间数</span>
                    <el-table :data="teenpattiRoom" style="100%">
                        <el-table-column align="center" prop="name" label="场次"></el-table-column>
                        <el-table-column align="center" prop="data" label="房间数"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">TeenPatti(speed)房间数</span>
                    <el-table :data="teenpattiSpeedRoom" style="100%">
                        <el-table-column align="center" prop="name" label="场次"></el-table-column>
                        <el-table-column align="center" prop="data" label="房间数"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">AK47房间数</span>
                    <el-table :data="ak47Room" style="100%">
                        <el-table-column align="center" prop="name" label="场次"></el-table-column>
                        <el-table-column align="center" prop="data" label="房间数"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">LowJoker房间数</span>
                    <el-table :data="lowJokerRoom" style="100%">
                        <el-table-column align="center" prop="name" label="场次"></el-table-column>
                        <el-table-column align="center" prop="data" label="房间数"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <span class="span">HighJoker房间数</span>
                    <el-table :data="highJokerRoom" style="100%">
                        <el-table-column align="center" prop="name" label="场次"></el-table-column>
                        <el-table-column align="center" prop="data" label="房间数"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="6">
                
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
                rummyRoom: [],
                rummyP2Room: [],
                teenpattiRoom: [],
                teenpattiSpeedRoom: [],
                ak47Room: [],
                lowJokerRoom: [],
                highJokerRoom: []
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
                this.gt.httpGet('/realtime_data', { type: 3 }).then((response) => {
                    const result = response.data.result;
                    console.log('result', result);
                    this.rummyRoom = result.rummy;
                    this.rummyP2Room = result.rummyp2;
                    this.teenpattiRoom = result.teenpatti;
                    this.teenpattiSpeedRoom = result.teenpattispeed;
                    this.ak47Room = result.ak47;
                    this.lowJokerRoom = result.lowJoker;
                    this.highJokerRoom = result.highJoker;
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
</script>