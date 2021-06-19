'use strict';
const Controller = require('egg').Controller;

class OnlineRechargeController extends Controller {
    async form() {
        const { ctx } = this;
        const online = await ctx.service.user.getOnlineByCharts();
        const recharge = await ctx.service.recharge.getRechargeByCharts();
        let retBody = ctx.getSuccessBody();
        retBody.result = { online, recharge };
        ctx.body = retBody;
    }
}

module.exports = OnlineRechargeController;
