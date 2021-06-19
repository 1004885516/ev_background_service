<template>
    <div>
        <div class="row mb-2 mb-xl-3">
            <div class="col-auto d-none d-sm-block">
                <h3><strong>测试牌型</strong></h3>
            </div>
        </div>
        <el-row>
            <el-card class="box-card">
                <button type="button" :class="class1"></button>
                <button type="button" :class="class2"></button>
                <button type="button" :class="class3"></button>
            </el-card>
            <el-card class="box-card">
                <label>{{ cardType }}</label>
            </el-card>
            <el-card class="box-card">
                <button type="button" @click="queryCards()">刷新</button>
            </el-card>
        </el-row>
        <el-row>
            <el-card class="box-card">
                <el-row>
                    <label>随机10000次</label>
                </el-row>
                <el-row>
                    <label>高牌: {{ rateArr[0] }}%</label>
                </el-row>
                <el-row>
                    <label>对子: {{ rateArr[1] }}%</label>
                </el-row>
                <el-row>
                    <label>同花: {{ rateArr[2] }}%</label>
                </el-row>
                <el-row>
                    <label>顺子: {{ rateArr[3] }}%</label>
                </el-row>
                <el-row>
                    <label>同花顺: {{ rateArr[4] }}%</label>
                </el-row>
                <el-row>
                    <label>豹子: {{ rateArr[5] }}%</label>
                </el-row>
            </el-card>
        </el-row>
        <el-row>
            <el-card class="box-card">
                <el-row>
                    <label>高牌</label>
                    <el-input v-model="playerCard[0]" placeholder="高牌概率"></el-input>
                </el-row>
                <el-row>
                    <label>对子</label>
                    <el-input v-model="playerCard[1]" placeholder="对子概率"></el-input>
                </el-row>
                <el-row>
                    <label>同花</label>
                    <el-input v-model="playerCard[2]" placeholder="同花概率"></el-input>
                </el-row>
                <el-row>
                    <label>顺子</label>
                    <el-input v-model="playerCard[3]" placeholder="顺子概率"></el-input>
                </el-row>
                <el-row>
                    <label>同花顺</label>
                    <el-input v-model="playerCard[4]" placeholder="同花顺概率"></el-input>
                </el-row>
                <el-row>
                    <label>豹子</label>
                    <el-input v-model="playerCard[5]" placeholder="豹子概率"></el-input>
                </el-row>
            </el-card>
            <el-card class="box-card">
                <el-row>
                    <label>玩家胜率: {{ winRate }}%</label>
                </el-row>
                <el-row>
                    <label>机器人胜率: {{ loseRate }}%</label>
                </el-row>
                <el-row>
                    <label>平局: {{ drawRate }}%</label>
                </el-row>
                <el-row>
                    <button type="button" @click="queryCardsRate()">确定</button>
                </el-row>
            </el-card>
            <el-card class="box-card">
                <el-row>
                    <label>高牌</label>
                    <el-input v-model="robotCard[0]" placeholder="高牌概率"></el-input>
                </el-row>
                <el-row>
                    <label>对子</label>
                    <el-input v-model="robotCard[1]" placeholder="对子概率"></el-input>
                </el-row>
                <el-row>
                    <label>同花</label>
                    <el-input v-model="robotCard[2]" placeholder="同花概率"></el-input>
                </el-row>
                <el-row>
                    <label>顺子</label>
                    <el-input v-model="robotCard[3]" placeholder="顺子概率"></el-input>
                </el-row>
                <el-row>
                    <label>同花顺</label>
                    <el-input v-model="robotCard[4]" placeholder="同花顺概率"></el-input>
                </el-row>
                <el-row>
                    <label>豹子</label>
                    <el-input v-model="robotCard[5]" placeholder="豹子概率"></el-input>
                </el-row>
            </el-card>
        </el-row>
    </div>
</template>

<style>
    .el-row {
        margin-bottom: 10px;
    }
    .el-card {
        margin-top: 20px;
        margin-right: 20px;
    }
    label {
        width: 120px;
        line-height: 45px;
    }
</style>

<script>
export default {
    data () {
        return {
            cards: [
                { "num": 6, "color": 1 },
                { "num": 10, "color": 0 },
                { "num": 12, "color": 0},
            ],
            cardType: '',
            class1: '',
            class2: '',
            class3: '',
            rateArr: [],
            playerCard: [],
            robotCard: [],
            winRate: 0,
            loseRate: 0,
            drawRate: 0,
            customCardType: ['高牌', '对子', '同花', '顺子', '同花顺', '豹子'],
        }
    },
    mounted() {
        this.queryCards();
    },
    methods: {
        changeClass(index) {
            return `card-button card-${(this.cards[index].color + 1) * 100 + this.cards[index].num + 1}`
        },
        queryCards() {
            this.gt.httpGet('/test_card').then((response) => {
                    console.log('response.data :', response.data);
                    this.cards = response.data.cards;
                    this.cardType = this.customCardType[response.data.cardType];
                    this.rateArr = response.data.rateArr;
                    this.class1 = this.changeClass(0);
                    this.class2 = this.changeClass(1);
                    this.class3 = this.changeClass(2);
                }).catch(function (error) {
                    console.log(error);
                });
        },
        queryCardsRate() {
            let pCount = 0;
            let rCount = 0;
            for (let i = 0; i < this.playerCard.length; i++) {
                pCount += parseInt(this.playerCard[i]);
                rCount += parseInt(this.robotCard[i]);
            }
            if (pCount !== 100) {
                this.$message({ message: `玩家概率和不等于100, ${pCount}` });
            } else if (rCount !== 100) {
                this.$message({ message: `机器人概率和不等于100, ${rCount}` });
            } else {
                this.gt.httpPost('/test_card', { playerCard: this.playerCard, robotCard: this.robotCard }).then((response) => {
                        console.log('response.data :', response.data);
                        this.winRate = response.data.winRate[0];
                        this.loseRate = response.data.winRate[1];
                        this.drawRate = response.data.winRate[2];
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        }
    }
}
</script>