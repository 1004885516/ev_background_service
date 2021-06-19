'use strict';

const Service = require('egg').Service;
const withdrawtable = 'Payout';
const noPayoutInfo = 'nopayoutinfo';

const Agree = 1;
const Reject = 2;

class WithdrawService extends Service {
    async getWithdrawData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const payoutStatus = reqBody.payout_status;
        const userId = reqBody.userId;
        let sql = `select * from ${withdrawtable} where CreateTime >= ? and CreateTime < ?`;
        const params = [ startdate, enddate ];
        if (payoutStatus !== app.config.All) {
            sql = `${sql} and PayoutStatus = ?`;
            params.push(payoutStatus);
        }
        if (userId !== 0 && userId.length === 8) {
            sql = `${sql} and UserId = ?`;
            params.push(userId);
        } else if (userId !== 0 && userId.length > 8) {
            sql = `${sql} and PayoutId = ?`;
            params.push(userId);
        }
        sql = `${sql} order by CreateTime desc limit ?, ?`;
        params.push(startPage);
        params.push(pageSize);

        this.logger.info('sql : ', sql);
        this.logger.info('params : ', params);
        let data = { data: [], total: 1 };
        let result = await ctx.mysqlQueryByGame(sql, params);
        if (result.length === 0) {
            return data;
        }

        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            item.CreateTime = ctx.transferDateTime(item.CreateTime);
            item.VerifyTime = ctx.transferDateTime(item.VerifyTime);
            item.EndTime = ctx.transferDateTime(item.EndTime);
            item.Amount = ctx.changeClientRatio(item.Amount);
            item.RealAmount = ctx.changeClientRatio(item.RealAmount);
            item.Details = JSON.parse(item.Details);
        }

        let countSql = `select ifnull(count(*), 0) as total from ${withdrawtable} where CreateTime >= ? and CreateTime <= ?`;
        let countParams = [ startdate, enddate ];
        if (payoutStatus !== app.config.All) {
            countSql = `${countSql} and PayoutStatus = ?`;
            countParams.push(payoutStatus);
        }

        if (userId.length && userId.length === 8) {
            countSql = `${countSql} and UserId = ?`;
            countParams.push(userId);
        } else if (userId.length && userId.length > 8) {
            countSql = `${countSql} and PayoutId = ?`;
            countParams.push(userId);
        }

        let countResult = await ctx.mysqlQueryByGame(countSql, countParams);
        data = { data: result, total: countResult[0].total };
        return data;
    }

    async notifyWithdrawResult() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const payoutId = reqBody.payout_id;
        const isAgree = reqBody.isAgree;
        let payoutInfo = await this.getPayoutInfo(payoutId);
        if (payoutInfo === noPayoutInfo) {
            return '没有提现订单信息';
        }
        return await this.notifyGameServer(payoutId, isAgree);
    }

    async notifyGameServer(payoutId, isAgree) {
        const { ctx, app } = this;
        // await this.changeWithdrawStatus(isAgree ? Agree : Reject);
        const params = { PayoutId: payoutId, Allow: isAgree ? Agree : Reject };

        const result = await ctx.httpPost(app.config.PayoutRefuse, JSON.stringify(params));
        this.logger.info('result : ', result);
        if (result.message === 'ok') {
            return true;
        }
        return false;
    }

    async changeWithdrawStatus(payoutStatus, payoutId) {
        const { ctx } = this;
        let sql = `update ${withdrawtable} set PayoutStatus = ? where PayoutId = ?`;
        await ctx.mysqlQueryByGame(sql, [ payoutStatus, payoutId ]);
    }

    async getPayoutInfo(payoutId) {
        const { ctx } = this;
        let sql = `select * from ${withdrawtable} where PayoutId = ?`;
        let result = await ctx.mysqlQueryByGame(sql, [ payoutId ]);
        if (result.length === 0) {
            return noPayoutInfo;
        }
        return result[0];
    }
}

module.exports = WithdrawService;
