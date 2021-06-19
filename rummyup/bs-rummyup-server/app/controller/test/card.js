'use strict';
const Controller = require('egg').Controller;

const CardType = {
    GaoPai: 0,
    DuiZi: 1,
    TongHua: 2,
    ShunZi: 3,
    TongHuaShun: 4,
    BaoZi: 5,
};

const WinType = {
    Win: 0,
    Lose: 1,
    Draw: 2,
};

class CardController extends Controller {
    async index() {
        const { ctx } = this;
        const cards = ctx.getRandomCard();
        const sortCards = this.sortCard(cards.player);
        const cardType = this.checkCardType(sortCards);
        let rateArr = [ 0, 0, 0, 0, 0, 0 ];
        let winRate = [ 0, 0, 0 ];
        const count = 10000;
        for (let i = 0; i < count; i++) {
            const tc = ctx.getRandomCard();
            const stc = this.sortCard(tc.player);
            const tct = this.checkCardType(stc);
            rateArr[tct] += 1;

            const win = this.compareCard(this.sortCard(tc.player), this.sortCard(tc.robot));
            winRate[win] += 1;
        }
        for (let i = 0; i < rateArr.length; i++) {
            rateArr[i] = (rateArr[i] / count * 100).toFixed(2);
        }
        for (let i = 0; i < winRate.length; i++) {
            winRate[i] = (winRate[i] / count * 100).toFixed(2);
        }

        let newCards = [];
        for (let i = 0; i < 52; i++) {
            newCards.push(i);
        }
        const newArr = this.getGaoPai(newCards);
        this.logger.info('newArr : ', newArr);

        const result = {
            cards: sortCards,
            tCards: newArr.cards,
            cardType,
            rateArr,
            winRate,
        };
        ctx.body = result;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const playerCard = reqBody.playerCard;
        const robotCard = reqBody.robotCard;
        this.logger.info(`playerCard = ${playerCard}`);
        this.logger.info(`robotCard = ${robotCard}`);

        let plast = -1;
        let rlast = -1;
        let winRate = [ 0, 0, 0 ];
        const count = 10000;
        const pCardsArr = await ctx.genRandomArray(playerCard[0], playerCard[1], playerCard[2], playerCard[3], playerCard[4], playerCard[5]);
        const rCardsArr = await ctx.genRandomArray(robotCard[0], robotCard[1], robotCard[2], robotCard[3], robotCard[4], robotCard[5]);
        for (let i = 0; i < count; i++) {

            let newCards = [];
            let newArr;
            for (let i = 0; i < 52; i++) {
                newCards.push(i);
            }

            let pRan = ctx.randomInt(0, 99);
            if (pCardsArr[pRan] === plast && plast > 1) {
                plast = -1;
                pRan = ctx.randomInt(0, 99);
            }
            plast = pCardsArr[pRan];
            if (plast === 0) {
                newArr = this.getGaoPai(newCards);
            } else if (plast === 1) {
                newArr = this.getDuiZi(newCards);
            } else if (plast === 2) {
                newArr = this.getTongHua(newCards);
            } else if (plast === 3) {
                newArr = this.getShunZi(newCards);
            } else if (plast === 4) {
                newArr = this.getTongHuaShun(newCards);
            } else if (plast === 5) {
                newArr = this.getBaoZi(newCards);
            }
            newCards = newArr.tCards;
            const pCards = newArr.cards;

            let rRan = ctx.randomInt(0, 99);
            if (rCardsArr[rRan] === rlast && rlast > 1) {
                rlast = -1;
                rRan = ctx.randomInt(0, 99);
            }
            rlast = rCardsArr[rRan];
            if (rlast === 0) {
                newArr = this.getGaoPai(newCards);
            } else if (rlast === 1) {
                newArr = this.getDuiZi(newCards);
            } else if (rlast === 2) {
                newArr = this.getTongHua(newCards);
            } else if (rlast === 3) {
                newArr = this.getShunZi(newCards);
            } else if (rlast === 4) {
                newArr = this.getTongHuaShun(newCards);
            } else if (rlast === 5) {
                newArr = this.getBaoZi(newCards);
            }
            const rCards = newArr.cards;
            const win = this.compareCard(this.sortCard(pCards), this.sortCard(rCards));
            winRate[win] += 1;
        }
        for (let i = 0; i < winRate.length; i++) {
            winRate[i] = (winRate[i] / count * 100).toFixed(2);
        }
        const result = {
            winRate,
        };
        ctx.body = result;
    }

    getColorArr() {
        const { ctx } = this;
        let rArr = [];
        for (let i = 0; i < 4; i++) {
            rArr.push(i);
        }
        const len = rArr.length;
        for (let i = len - 1; i > 0; i--) {
            const ran = ctx.randomInt(0, i);
            const temp = rArr[i];
            rArr[i] = rArr[ran];
            rArr[ran] = temp;
        }
        return rArr;
    }

    getNumArr() {
        const { ctx } = this;
        let rArr = [];
        for (let i = 0; i < 13; i++) {
            rArr.push(i);
        }
        const len = rArr.length;
        for (let i = len - 1; i > 0; i--) {
            const ran = ctx.randomInt(0, i);
            const temp = rArr[i];
            rArr[i] = rArr[ran];
            rArr[ran] = temp;
        }
        return rArr;
    }

    getColorByCount() {
        const { ctx } = this;
        const count = ctx.randomInt(1, 100) % 13 === 0 ? 2 : 3;
        const rArr = this.getColorArr();
        return [ rArr[0], rArr[1], count === 2 ? rArr[ctx.randomInt(0, 1)] : rArr[3] ];
    }

    getNumByCount(_count) {
        const { ctx } = this;
        const count = (_count === 2 || _count === 3) ? _count : (ctx.randomInt(1, 100) % 13 === 0 ? 2 : 3);
        const rArr = this.getNumArr();
        return [ rArr[0], rArr[1], count === 2 ? rArr[ctx.randomInt(0, 1)] : rArr[3] ];
    }

    checkCards(cards, card1, card2, card3) {
        let tCards = cards.slice(0);
        if (tCards[card1] === -1) {
            return false;
        }
        tCards[card1] = -1;
        if (tCards[card2] === -1) {
            return false;
        }
        tCards[card2] = -1;
        if (tCards[card3] === -1) {
            return false;
        }
        tCards[card3] = -1;
        return true;
    }

    getBaoZi(cards) {
        const { ctx } = this;
        const rColor = ctx.randomInt(0, 100) % 4;
        const cardNums = ctx.randomInt(0, 100) % 13;
        let bCards = [];
        let tCards = cards.slice(0);
        for (let i = 0; i < 4; i++) {
            if (i !== rColor) {
                let card = tCards[i * 13 + cardNums];
                if (card > -1) {
                    bCards.push(ctx.changeCardNum(card));
                    tCards[i * 13 + cardNums] = -1;
                    if (bCards.length === 3) {
                        return { tCards, cards: bCards };
                    }
                }
            }
        }
        return this.getBaoZi(cards);
    }

    getTongHuaShun(cards) {
        const { ctx } = this;
        const rColor = ctx.randomInt(0, 100) % 4;
        const rCardNum = ctx.randomInt(0, 100) % 12;
        const card1 = rColor * 13 + rCardNum;
        const card2 = rColor * 13 + rCardNum + 1;
        const card3 = rColor * 13 + (rCardNum === 11 ? 0 : rCardNum + 2);
        let tCards = cards.slice(0);
        let thsCards = [];
        if (this.checkCards(cards, card1, card2, card3)) {
            thsCards.push(ctx.changeCardNum(card1));
            thsCards.push(ctx.changeCardNum(card2));
            thsCards.push(ctx.changeCardNum(card3));
            tCards[card1] = -1;
            tCards[card2] = -1;
            tCards[card3] = -1;
            return { tCards, cards: thsCards };
        }
        return this.getTongHuaShun(cards);
    }

    getShunZi(cards) {
        const { ctx } = this;
        const rColor = this.getColorByCount();
        const rCardNum = ctx.randomInt(0, 100) % 12;
        const card1 = rColor[0] * 13 + rCardNum;
        const card2 = rColor[1] * 13 + rCardNum + 1;
        const card3 = rColor[2] * 13 + (rCardNum === 11 ? 0 : rCardNum + 2);
        let tCards = cards.slice(0);
        let szCards = [];
        if (this.checkCards(cards, card1, card2, card3)) {
            szCards.push(ctx.changeCardNum(card1));
            szCards.push(ctx.changeCardNum(card2));
            szCards.push(ctx.changeCardNum(card3));
            tCards[card1] = -1;
            tCards[card2] = -1;
            tCards[card3] = -1;
            return { tCards, cards: szCards };
        }
        return this.getShunZi(cards);
    }

    getTongHua(cards) {
        const { ctx } = this;
        const rColor = ctx.randomInt(0, 100) % 4;
        const cardNums = this.getNumByCount();
        const card1 = rColor * 13 + cardNums[0];
        const card2 = rColor * 13 + cardNums[1];
        const card3 = rColor * 13 + cardNums[2];
        let tCards = cards.slice(0);
        let thCards = [];
        if (this.checkCards(cards, card1, card2, card3)) {
            thCards.push(ctx.changeCardNum(card1));
            thCards.push(ctx.changeCardNum(card2));
            thCards.push(ctx.changeCardNum(card3));
            tCards[card1] = -1;
            tCards[card2] = -1;
            tCards[card3] = -1;
            return { tCards, cards: thCards };
        }
        return this.getTongHua(cards);
    }

    getDuiZi(cards) {
        const { ctx } = this;
        const rColor = this.getColorByCount();
        const cardNums = this.getNumByCount(2);
        const card1 = rColor[0] * 13 + cardNums[0];
        const card2 = rColor[1] * 13 + cardNums[1];
        const card3 = rColor[2] * 13 + cardNums[2];
        let tCards = cards.slice(0);
        let dzCards = [];
        if (this.checkCards(cards, card1, card2, card3)) {
            dzCards.push(ctx.changeCardNum(card1));
            dzCards.push(ctx.changeCardNum(card2));
            dzCards.push(ctx.changeCardNum(card3));
            tCards[card1] = -1;
            tCards[card2] = -1;
            tCards[card3] = -1;
            return { tCards, cards: dzCards };
        }
        return this.getDuiZi(cards);
    }

    getGaoPai(cards) {
        const { ctx } = this;
        const rColor = this.getColorByCount();
        const cardNums = this.getNumByCount(3);
        const card1 = rColor[0] * 13 + cardNums[0];
        const card2 = rColor[1] * 13 + cardNums[1];
        const card3 = rColor[2] * 13 + cardNums[2];
        let tCards = cards.slice(0);
        let gpCards = [];
        if (this.checkCards(cards, card1, card2, card3)) {
            gpCards.push(ctx.changeCardNum(card1));
            gpCards.push(ctx.changeCardNum(card2));
            gpCards.push(ctx.changeCardNum(card3));
            tCards[card1] = -1;
            tCards[card2] = -1;
            tCards[card3] = -1;
            return { tCards, cards: gpCards };
        }
        return this.getGaoPai(cards);
    }

    sortCard(cards) {
        return cards.sort((a, b) => {
            return a.num - b.num;
        });
    }

    compareCard(pCards, rCards) {
        const pCT = this.checkCardType(pCards);
        const rCT = this.checkCardType(rCards);
        if (pCT > rCT) {
            // 玩家赢
            return WinType.Win;
        } else if (pCT < rCT) {
            // 机器人赢
            return WinType.Lose;
        }
        const pCard1 = pCards[0];
        const pCard2 = pCards[1];
        const pCard3 = pCards[2];

        const rCard1 = rCards[0];
        const rCard2 = rCards[1];
        const rCard3 = rCards[2];
        if (pCT === CardType.BaoZi) {
            if (pCard1.num > rCard1.num) {
                return WinType.Win;
            } else if (pCard1.num < rCard1.num) {
                return WinType.Lose;
            }
            return WinType.Draw;
        }
        if (pCT === CardType.TongHuaShun || pCT === CardType.ShunZi) {
            let pAW = 0;
            let rAW = 0;
            if (pCard1.num === 0) {
                pAW = 13 * 100 + pCard2.num * 10 + pCard3.num;
            } else {
                pAW = pCard1.num * 100 + pCard2.num * 10 + pCard3.num;
            }
            if (rCard1.num === 0) {
                rAW = 13 * 100 + rCard2.num * 10 + rCard3.num;
            } else {
                rAW = rCard1.num * 100 + rCard2.num * 10 + rCard3.num;
            }
            if (pAW > rAW) {
                return WinType.Win;
            } else if (pAW < rAW) {
                return WinType.Lose;
            }
            return WinType.Draw;
        }
        if (pCT === CardType.TongHua || pCT === CardType.GaoPai) {
            let pAW = pCard3.num;
            let rAW = rCard3.num;
            if (pCard1.num === 0) {
                pAW = 13;
            }
            if (rCard1.num === 0) {
                rAW = 13;
            }
            if (pAW > rAW) {
                return WinType.Win;
            } else if (pAW < rAW) {
                return WinType.Lose;
            }
            return WinType.Draw;
        }
        if (pCT === CardType.DuiZi) {
            let dpAW = 0;// 玩家对子的权值
            let drAW = 0;// 机器人对子的权值
            let pAW = 0;// 玩家单牌的权值
            let rAW = 0;// 机器人单牌的权值
            if (pCard1.num === pCard2.num) {
                if (pCard1.num === 0) {
                    dpAW = 13;
                } else {
                    dpAW = pCard1.num;
                }
                pAW = pCard3.num;
            } else if (pCard2.num === pCard3.num) {
                if (pCard2.num === 0) {
                    dpAW = 13;
                } else {
                    dpAW = pCard2.num;
                }
                pAW = pCard1.num;
            } else if (pCard3.num === pCard1.num) {
                if (pCard3.num === 0) {
                    dpAW = 13;
                } else {
                    dpAW = pCard3.num;
                }
                pAW = pCard2.num;
            }
            if (rCard1.num === rCard2.num) {
                if (rCard1.num === 0) {
                    drAW = 13;
                } else {
                    drAW = rCard1.num;
                }
                rAW = rCard3.num;
            } else if (rCard2.num === rCard3.num) {
                if (rCard2.num === 0) {
                    drAW = 13;
                } else {
                    drAW = rCard2.num;
                }
                rAW = rCard1.num;
            } else if (rCard3.num === rCard1.num) {
                if (rCard3.num === 0) {
                    drAW = 13;
                } else {
                    drAW = rCard3.num;
                }
                rAW = rCard2.num;
            }
            if (dpAW > drAW) {
                return WinType.Win;
            } else if (dpAW < drAW) {
                return WinType.Lose;
            }
            if (pAW > rAW) {
                return WinType.Win;
            } else if (pAW < rAW) {
                return WinType.Lose;
            }
            return WinType.Draw;
        }
    }

    checkCardType(cards) {
        const card1 = cards[0];
        const card2 = cards[1];
        const card3 = cards[2];
        if (card1.num === card2.num && card2.num === card3.num) {
            // 豹子
            return CardType.BaoZi;
        }
        if (card1.num === 0 && card2.num === 11 && card3.num === 12) {
            if (card1.color === card2.color && card2.color === card3.color) {
                // AQK同花顺
                return CardType.TongHuaShun;
            }
            // AQK顺子
            return CardType.ShunZi;
        }
        if (card3.num - card2.num === 1 && card2.num - card1.num === 1) {
            if (card1.color === card2.color && card2.color === card3.color) {
                // 同花顺
                return CardType.TongHuaShun;
            }
            // 顺子
            return CardType.ShunZi;
        }
        if (card1.color === card2.color && card2.color === card3.color) {
            // 同花
            return CardType.TongHua;
        }
        if (card1.num === card2.num || card2.num === card3.num || card3.num === card1.num) {
            // 对子
            return CardType.DuiZi;
        }
        return CardType.GaoPai;
    }
}

module.exports = CardController;
