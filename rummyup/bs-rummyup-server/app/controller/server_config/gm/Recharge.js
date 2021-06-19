'use strict';
const Controller = require('egg').Controller;
const crypto = require('crypto');

class RechargeController extends Controller {
    async form() {
        const { ctx } = this;
        const result = await ctx.service.recharge.getData();
        this.logger.info('result : ', JSON.stringify(result));
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.onePageData,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }

    async callRecharge() {
        const { ctx } = this;
        const orderInfo = await ctx.service.recharge.getDataByOrderID();
        if (orderInfo.length > 0) {
            if (orderInfo[0].PayWay === 'Fun') {
                await this.callRechargeByFun(orderInfo);
            } else if (orderInfo[0].PayWay === 'BMart') {
                const result = await ctx.service.recharge.sendNotifyToServer(orderInfo[0]);
                let retBody = ctx.getSuccessBody();
                retBody.result = result;
                ctx.body = retBody;
            } else if (orderInfo[0].PayWay === 'SerPay') {
                const result = await ctx.service.recharge.notifyServerBySerPay(orderInfo[0]);
                let retBody = ctx.getSuccessBody();
                retBody.result = result;
                ctx.body = retBody;
            }
        } else {
            let retBody = ctx.getFailedBody();
            ctx.body = retBody;
        }
    }

    async callRechargeByFun(orderInfo) {
        const { ctx, app } = this;
        const secret = '9a8741790fc01369a846bc4ddfc549dabebb4cb2be4957141cc900219299a467';
        const orderMap = {
            app_order_id: orderInfo[0].Txnid,
            order_id: orderInfo[0].Txnid,
            amount: orderInfo[0].Amount,
            status: 1,
        };
        const sha = crypto.createHmac('sha256', secret).update(JSON.stringify(orderMap)).digest('hex');
        const signature = Buffer.from(sha).toString('base64');
        const result = await app.curl(`${app.config.GameURL}/funpay`, {
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
}

module.exports = RechargeController;
