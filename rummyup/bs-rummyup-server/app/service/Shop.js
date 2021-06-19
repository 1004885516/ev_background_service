'use strict';
const Service = require('egg').Service;

class ShopService extends Service {
    async NotifyGameServerByBMart(configData) {
        const { ctx, app } = this;
        const sendData = configData[0];
        if (!sendData || !sendData.ItemList || !sendData.ExtraConfig) {
            return false;
        }
        sendData.MinPayout = ctx.changeServerRatio(sendData.MinPayout);
        sendData.MaxPayout = ctx.changeServerRatio(sendData.MaxPayout);
        sendData.PayoutCount = Number.parseInt(sendData.PayoutCount);
        sendData.Retained = ctx.changeServerRatio(sendData.Retained);
        sendData.Tax = Number.parseInt(sendData.Tax);

        for (let i = 0; i < sendData.ExtraConfig.length; i++) {
            const item = sendData.ExtraConfig[i];
            item.Minimum = ctx.changeServerRatio(item.Minimum);
            item.Maximum = ctx.changeServerRatio(item.Maximum) + 9999;
            item.Extra = Number.parseInt(item.Extra);
            item.FirstExtra = Number.parseInt(item.FirstExtra);
        }

        for (let i = 0; i < sendData.ItemList.length; i++) {
            const item = sendData.ItemList[i];
            item.Icon = Number.parseInt(item.Icon);
            item.Count = ctx.changeServerRatio(item.Count);
            item.IsHot = Number.parseInt(item.IsHot);
        }
        this.logger.info('send data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.SetShopBMartConfig, JSON.stringify(sendData));
        this.logger.info(result);
        if (result.code === 200) {
            return true;
        }
        return false;
    }

    async NotifyGameServerByFun(configData) {
        const { ctx, app } = this;
        const sendData = configData[0];
        if (!sendData || !sendData.ItemList || !sendData.ExtraConfig) {
            return false;
        }
        sendData.MinPayout = ctx.changeServerRatio(sendData.MinPayout);
        sendData.MaxPayout = ctx.changeServerRatio(sendData.MaxPayout);
        sendData.PayoutCount = Number.parseInt(sendData.PayoutCount);
        sendData.Retained = ctx.changeServerRatio(sendData.Retained);
        sendData.Tax = Number.parseInt(sendData.Tax);

        for (let i = 0; i < sendData.ExtraConfig.length; i++) {
            const item = sendData.ExtraConfig[i];
            item.Minimum = ctx.changeServerRatio(item.Minimum);
            item.Maximum = ctx.changeServerRatio(item.Maximum) + 9999;
            item.Extra = Number.parseInt(item.Extra);
            item.FirstExtra = Number.parseInt(item.FirstExtra);
        }

        for (let i = 0; i < sendData.ItemList.length; i++) {
            const item = sendData.ItemList[i];
            item.Icon = Number.parseInt(item.Icon);
            item.Count = ctx.changeServerRatio(item.Count);
            item.IsHot = Number.parseInt(item.IsHot);
        }
        this.logger.info('send data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.SetShopFunConfig, JSON.stringify(sendData));
        this.logger.info(result);
        if (result.code === 200) {
            return true;
        }
        return false;
    }

    async NotifyGameServerByGrepay(configData) {
        const { ctx, app } = this;
        const sendData = configData[0];
        if (!sendData || !sendData.ItemList || !sendData.ExtraConfig) {
            return false;
        }
        sendData.MinPayout = ctx.changeServerRatio(sendData.MinPayout);
        sendData.MaxPayout = ctx.changeServerRatio(sendData.MaxPayout);
        sendData.PayoutCount = Number.parseInt(sendData.PayoutCount);
        sendData.Retained = ctx.changeServerRatio(sendData.Retained);
        sendData.Tax = Number.parseInt(sendData.Tax);
        sendData.OrgNo = sendData.OrgNo.toString();
        sendData.CustId = sendData.CustId.toString();
        sendData.SubAccount = sendData.SubAccount.toString();

        for (let i = 0; i < sendData.ExtraConfig.length; i++) {
            const item = sendData.ExtraConfig[i];
            item.Minimum = ctx.changeServerRatio(item.Minimum);
            item.Maximum = ctx.changeServerRatio(item.Maximum) + 9999;
            item.Extra = Number.parseInt(item.Extra);
            item.FirstExtra = Number.parseInt(item.FirstExtra);
        }

        for (let i = 0; i < sendData.ItemList.length; i++) {
            const item = sendData.ItemList[i];
            item.Icon = Number.parseInt(item.Icon);
            item.Count = ctx.changeServerRatio(item.Count);
            item.IsHot = Number.parseInt(item.IsHot);
        }
        this.logger.info('send data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.SetSerpayConfig, JSON.stringify(sendData));
        this.logger.info(result);
        if (result.code === 200) {
            return true;
        }
        return false;
    }

    async getOtherConfig() {
        const { ctx, app } = this;
        const params = { list: [ 'RechargeCustom', 'RechargeRatio', 'RechargeLowest', 'RechargeDefinition' ] };
        const result = await ctx.httpPost(app.config.GetServerParam, JSON.stringify(params));
        if (result.code === 200) {
            this.logger.info('get other config result : ', result);
            const data = result.config.List;
            this.logger.info('get other config data : ', data);
            return data;
        }
        return null;
    }

    async setOtherConfig() {
        const { ctx, app } = this;
        const body = ctx.request.body;
        const sendData = {
            List: [],
        };
        for (let key in body.data) {
            const obj = {};
            obj.Name = key;
            obj.Value = body.data[key];
            sendData.List.push(obj);
        }
        this.logger.info('set other config sendData : ', sendData);
        const result = await ctx.httpPost(app.config.SetServerParam, JSON.stringify(sendData));
        if (result.code === 200) {
            this.logger.info('set other config result : ', result);
            const data = result.config;
            this.logger.info('set other config data : ', data);
            return data;
        }
        return null;
    }

    async getPayWayConfig() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getpayway);
        if (result.code === 200) {
            this.logger.info('get pay way config result : ', result);
            const data = result.config;
            this.logger.info('get pay way config data : ', data);
            return data;
        }
        return null;
    }

    async setPayWayConfig() {
        const { ctx, app } = this;
        const { Payment, Payoutment } = ctx.request.body;
        const sendData = {
            Payment: Number(Payment),
            Payoutment: Number(Payoutment),
        };
        const result = await ctx.httpPost(app.config.Setpayway, JSON.stringify(sendData));
        if (result.code === 200) {
            this.logger.info('set pay way config result : ', result);
            const data = result.config;
            this.logger.info('set pay way config data : ', data);
            return data;
        }
        return null;
    }
}

module.exports = ShopService;
