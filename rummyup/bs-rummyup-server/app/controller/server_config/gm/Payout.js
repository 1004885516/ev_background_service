'use strict';
const Controller = require('egg').Controller;


class PayoutController extends Controller {

    async notify() {
        const { ctx } = this;
        // const orderInfo = await ctx.service.recharge.getDataByOrderID();
        const reqBody = ctx.request.body;
        const payoutId = reqBody.payout_id;
        const orderInfo = await ctx.service.withdraw.getPayoutInfo(payoutId);
        this.logger.info('orderInfo : ', orderInfo);
        if (orderInfo !== 'nopayoutinfo') {
            let result = '';
            if (orderInfo.PayWay === 'Fun') {
                await ctx.service.gm.updatePayoutStatus(orderInfo);
                result = await ctx.service.gm.notifyPayoutByFun(orderInfo);
            } else if (orderInfo.PayWay === 'BMart') {
                await ctx.service.gm.updatePayoutStatus(orderInfo);
                result = await ctx.service.gm.notifyPayoutByBMart(orderInfo);
            } else if (orderInfo.PayWay === 'SerPay') {
                await ctx.service.gm.updatePayoutStatus(orderInfo);
                result = await ctx.service.gm.notifyPayoutBySerPay(orderInfo);
            }
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            let retBody = ctx.getFailedBody();
            ctx.body = retBody;
        }
    }
}

module.exports = PayoutController;
