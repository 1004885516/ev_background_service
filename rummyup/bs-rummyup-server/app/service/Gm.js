'use strict';
const Service = require('egg').Service;
const crypto = require('crypto');
const withdrawtable = 'Payout';

class GMService extends Service {

    async changeCards() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const cards = reqBody.cards;
        const ghost = reqBody.ghost;
        const userId = reqBody.user_id;
        const data = `uid=${userId}&cards=${cards}&ghost=${ghost}`;
        this.logger.info('notify game server change cards data : ', data);
        const result = await ctx.httpGet(app.config.ChangeCards, data);
        this.logger.info('notify game server change cards result : ', result);
        return result;
    }

    async changeGold() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const type = reqBody.type;
        const gold = ctx.changeServerRatio(reqBody.change_gold);
        const userId = reqBody.user_id;
        const data = `type=${type}&count=${gold}&uid=${userId}`;
        this.logger.info('notify game server change gold data : ', data);
        const result = await ctx.httpGet(app.config.ChangeGold, data);
        this.logger.info('notify game server change gold result : ', result);
        return result;
    }

    async changeGears() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const type = 'teenpatti';
        const gears = ctx.changeServerRatio2(reqBody.change_gears);
        const userId = reqBody.user_id;
        const data = `type=${type}&robotGold=${gears}&uid=${userId}`;
        this.logger.info('notify game server change gears data : ', data);
        const result = await ctx.httpGet(app.config.ChangeGears, data);
        this.logger.info('notify game server change gears result : ', result);
        return result;
    }

    async updatePayoutStatus(orderInfo) {
        const { ctx } = this;
        const sql = `update ${withdrawtable} set PayoutStatus = ? where PayoutId = ?`;
        this.logger.info('sql : ', sql);
        this.logger.info('orderInfo.PayoutId : ', orderInfo.PayoutId);
        const result = await ctx.mysqlQueryByGame(sql, [ 4, orderInfo.PayoutId ]);
        this.logger.info('result : ', result);
    }

    async notifyPayoutByBMart(orderInfo) {
        const { ctx, app } = this;
        const details = JSON.parse(orderInfo.Details);
        const orderMap = {
            code: '0',
            amount: ctx.changeClientRatio(orderInfo.Amount),
            realAmount: ctx.changeClientRatio(orderInfo.Amount),
            currency: 'inr',
            outUserId: JSON.stringify(orderInfo.UserId),
            payAccount: details.PayAccount,
            outOrderNo: orderInfo.PayoutId,
            orderId: orderInfo.PayoutId,
            merchantId: '100000',
            appId: '100000',
            successTime: ctx.transferDateTime(orderInfo.CreateTime),
        };
        const md5 = ctx.genBMartPayPayoutNotifyMD5(orderMap);
        orderMap.sign = md5;
        this.logger.info('orderMap : ', orderMap);
        const result = await app.curl(`${app.config.GameURL}/bmartpayout`, {
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: orderMap,
        });
        this.logger.info('notifyPayoutByBMart : ', JSON.stringify(result));
        return result.status;
    }

    async notifyPayoutByFun(orderInfo) {
        const { ctx, app } = this;
        const secret = '9a8741790fc01369a846bc4ddfc549dabebb4cb2be4957141cc900219299a467';
        const orderMap = {
            app_order_id: orderInfo.PayoutId,
            order_id: orderInfo.PayoutId,
            amount: orderInfo.Amount,
            status: 1,
        };
        const sha = crypto.createHmac('sha256', secret).update(JSON.stringify(orderMap)).digest('hex');
        const signature = Buffer.from(sha).toString('base64');
        const result = await app.curl(`${app.config.GameURL}/funpayout`, {
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Signature: signature,
            },
            data: JSON.stringify(orderMap),
        });
        if (result.status === 200) {
            ctx.body = ctx.getSuccessBody();
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async notifyPayoutBySerPay(orderInfo) {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const oper = reqBody.oper;
        let ordStatus = '07';
        if (oper === 1) {
            ordStatus = '08';
        } else if (oper === 2) {
            ordStatus = '09';
        }
        const orderMap = {
            orgNo: '8210400669',
            custId: '21040900002233',
            custOrderNo: orderInfo.PayoutId,
            prdOrdNo: '20210412192956269212',
            payAmt: Number.parseInt(orderInfo.Amount),
            ordStatus,
        };
        const md5 = this.genMD5BySerPay(orderMap);
        orderMap.sign = md5;
        const result = await app.curl(`${app.config.GameURL}/serpayout`, {
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: orderMap,
        });
        if (result.status === 200) {
            ctx.body = ctx.getSuccessBody();
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    genMD5BySerPay(dataMap) {
        const { ctx } = this;
        const SerPayKey = '6C15315291AF4820160ECF4C50E196F0';
        const str = 'orgNo custId custOrderNo prdOrdNo payAmt ordStatus';
        const result = ctx.sortByASCII(str);
        let data = '';
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            data += `${item}=${dataMap[item]}`;
            if (i < result.length - 1) {
                data += '&';
            } else {
                data += `&key=${SerPayKey}`;
            }
        }
        return ctx.genMD5(data);
    }

    async getServerUpdateData() {
        const { ctx, app } = this;
        const obj = {};
        const result = await ctx.httpGet(app.config.GetServerStatus);
        obj.upDate = result;
        const result2 = await ctx.httpGet(app.config.GetCheckipDevice);
        if (result2.code === 200) {
            this.logger.info('Get Server Update result : ', result);
            this.logger.info('Get Server Update result2 : ', result2);
            const data = result2.config;
            obj.ipConfig = data;
            this.logger.info('Set Server Update data : ', data);
        }
        return obj;
    }

    async setServerUpdateData(data) {
        const { ctx, app } = this;
        let white_list = [];
        if (data.white_list !== '') {
            white_list = data.WhiteList.split(',');
            for (let i = 0; i < white_list.length; i++) {
                white_list[i] = Number.parseInt(white_list[i]);
            }
        }
        const sendData = {
            WhiteList: white_list,
            Status: Number.parseInt(data.Status),
        };
        this.logger.info('Set Server Update Data : ', sendData);
        const result = await ctx.httpPost(app.config.SetServerStatus, JSON.stringify(sendData));
        this.logger.info('Get Server Update result : ', result);
        return result;
    }

    async setIpConfigData(data) {
        const { ctx, app } = this;
        const sendData = {
            CheckIp: Number.parseInt(data.CheckIp),
            CheckDeviceId: Number.parseInt(data.CheckDeviceId),
        };
        this.logger.info('Set Server Update Data : ', sendData);
        const result = await ctx.httpPost(app.config.SetCheckipDevice, JSON.stringify(sendData));
        this.logger.info('Get Server Update result : ', result);
        return result;
    }

    async setMarquee() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body.data;
        const sendData = {
            count: Number(reqBody.count),
            createtime: Number(Date.parse(new Date()) / 1000),
            lifetime: Number(reqBody.live_time),
            cnMsg: reqBody.language_cn,
            enMsg: reqBody.language_en,
            inMsg: reqBody.language_in,
        };
        this.logger.info('Set Marquee Data : ', sendData);
        const result = await ctx.httpPost(app.config.ConfigMarquee, JSON.stringify(sendData));
        this.logger.info('Set Marquee result : ', result);
        return result;
    }

    async getMarquee() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetLamp);
        this.logger.info('Get Marquee result : ', result);
        if (result.code === 200) {
            const data = result.config;
            this.logger.info('Get Marquee data : ', data);
            return data;
        }
        return result;
    }

    async setMarqueeGame() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const list = [];
        for (let i = 0; i < reqBody.listData.length; i++) {
            const item = reqBody.listData[i];
            const obj = {};
            obj.GameType = Number(item.GameType);
            obj.BaseScore = item.BaseScore.indexOf(',') === -1 ? [ Number(item.BaseScore) ] : item.BaseScore.split(',').map(item => {
                return Number(item);
            });
            obj.WinGold = item.WinGold.indexOf(',') === -1 ? [ ctx.changeServerRatio(item.WinGold) ] : item.WinGold.split(',').map(item => {
                return ctx.changeServerRatio(item);
            });
            list.push(obj);
        }
        const sendData = {
            Count: Number(reqBody.tableData.count),
            LifeTime: Number(reqBody.tableData.live_time),
            CnMsg: reqBody.tableData.language_cn,
            EnMsg: reqBody.tableData.language_en,
            InMsg: reqBody.tableData.language_in,
            List: list,
        };
        this.logger.info('Set Marquee Game Data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.SetGameLamp, JSON.stringify(sendData));
        this.logger.info('Set Marquee Game result : ', result);
        return result;
    }

    async getMarqueeGame() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetGameLamp);
        this.logger.info('Get Marquee Game result : ', JSON.stringify(result));
        if (result.code === 200) {
            const data = result.config;
            for (let i = 0; i < data.List.length; i++) {
                const item = data.List[i];
                item.ID = i + 1;
                item.BaseScore = item.BaseScore.toString();
                const WinGold = item.WinGold.map(item => {
                    return item / 10000;
                });
                item.WinGold = WinGold.toString();
            }
            this.logger.info('Get Marquee Game data : ', data);
            return data;
        }
        return result;
    }

}

module.exports = GMService;
