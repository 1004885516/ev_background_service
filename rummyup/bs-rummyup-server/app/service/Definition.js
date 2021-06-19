'use strict';


const Service = require('egg').Service;

class GamePlayerService extends Service {

    async getGamePlayer() {
        const { ctx, app } = this;
        const params = { list: [ 'PayInPercent', 'NewUserGames', 'PayIn', 'ServiceCharge', 'AutoPayout', 'TpHideInning', 'TpHideRegTime' ] };
        const result = await ctx.httpPost(app.config.GetServerParam, JSON.stringify(params));
        if (result.msg === 'OK') {
            this.logger.info('get game player result : ', result);
            const data = result.config.List;
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (item.Name === 'AutoPayout') {
                    item.Value = item.Value ? ctx.changeClientRatio(item.Value) : 0;
                }
            }
            this.logger.info('get game player data : ', data);
            return data;
        }
        return null;
    }

    async setGamePlayer() {
        const { ctx, app } = this;
        const body = ctx.request.body;
        const sendData = {
            List: [],
        };
        for (let key in body.data) {
            const obj = {};
            obj.Name = key;
            if (key === 'AutoPayout') {
                body.data[key] = ctx.changeServerRatio(body.data[key]).toString();
            }
            obj.Value = body.data[key];
            sendData.List.push(obj);
        }
        const result = await ctx.httpPost(app.config.SetServerParam, JSON.stringify(sendData));
        if (result.code === 200) {
            this.logger.info('get game player result : ', result);
            const data = result.config;
            this.logger.info('set game player result : ', data);
            return data;
        }
        return null;
    }

    async getCardType() {
        const { ctx, app } = this;
        const data = 'Type=1';
        const result = await ctx.httpGet(app.config.GetSepline, data);
        if (result.code === 200) {
            this.logger.info('get card type result : ', result);
            const data = result.config.CardList;
            this.logger.info('set card type data : ', data);
            return data;
        }
        return result;
    }

    async setCardType() {
        const { ctx, app } = this;
        const body = ctx.request.body;
        const sendData = {
            Type: 1,
            CardList: [],
        };
        for (let key in body.data) {
            const card = body.data[key].split(',').map(item => {
                return Number(item);
            });
            sendData.CardList.push(card);
        }
        const result = await ctx.httpPost(app.config.SetSepline, JSON.stringify(sendData));
        this.logger.info('set card type result : ', result);
        return result;
    }

    async getRechargeAndRank() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetPayinRank);
        if (result.code === 200) {
            this.logger.info('get card type result : ', result);
            const data = result.config;
            const tableData = {
                tableData1: [],
                tableData2: [],
            };
            for (let i = 0; i < data.PayinRank.length; i++) {
                const item = data.PayinRank[i];
                const obj = {};
                obj.ID = i + 1;
                obj.UpperLimit = item;
                tableData.tableData1.push(obj);
            }
            for (let i = 0; i < data.PayinLevel.length; i++) {
                const item = data.PayinLevel[i];
                const obj = {};
                obj.ID = i + 1;
                obj.Money = ctx.changeClientRatio(item);
                tableData.tableData2.push(obj);
            }
            this.logger.info('set card type data : ', tableData);
            return tableData;
        }
        return false;
    }

    async setRechargeAndRank() {
        const { ctx, app } = this;
        const body = ctx.request.body;
        const sendData = {
            PayinRank: [],
            PayinLevel: [],
        };
        sendData.PayinRank = body.PayinRank.map(item => {
            return Number(item.UpperLimit);
        });
        sendData.PayinLevel = body.PayinLevel.map(item => {
            return ctx.changeServerRatio(item.Money);
        });
        const result = await ctx.httpPost(app.config.SetPayinRank, JSON.stringify(sendData));
        this.logger.info('set card type result : ', result);
        return result;
    }

    async getGoldPoolConfig() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetJackpot);
        if (result.code === 200) {
            const data = { Jackpot: ctx.changeClientRatio(result.config) };
            return data;
        }
        this.logger.info('get gold pool config result : ', result);
        return result;
    }

    async setGoldPoolConfig() {
        const { ctx, app } = this;
        const body = ctx.request.body;
        const sendData = {
            Jackpot: ctx.changeServerRatio(body.Jackpot),
        };
        const result = await ctx.httpPost(app.config.SetJackpot, JSON.stringify(sendData));
        this.logger.info('set gold pool config : ', result);
        return result;
    }

    async getGoldPoolAdd() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetJackpotConvert);
        if (result.code === 200) {
            const data = {
                just: ctx.changeClientRatio(result.config.WinConvert),
                lose: ctx.changeClientRatio(result.config.LoseConvert),
            };
            return data;
        }
        this.logger.info('get gold pool add result : ', result);
        return result;
    }

    async setGoldPoolAdd() {
        const { ctx, app } = this;
        const body = ctx.request.body;
        const sendData = {
            WinConvert: ctx.changeServerRatio(body.just),
            LoseConvert: ctx.changeServerRatio(body.lose),
        };
        const result = await ctx.httpPost(app.config.SetJackpotConvert, JSON.stringify(sendData));
        this.logger.info('set gold pool add : ', result);
        return result;
    }

}

module.exports = GamePlayerService;
