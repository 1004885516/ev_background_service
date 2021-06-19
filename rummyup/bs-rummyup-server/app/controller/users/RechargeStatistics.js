'use strict';
const Controller = require('egg').Controller;

class RechargeStatisticsController extends Controller {

    async form() {
        const { ctx } = this;
        const result = await ctx.service.recharge.getRechargeStatisticsData();
        let retBody = ctx.getSuccessBody();
        retBody.result = result;
        ctx.body = retBody;
    }
}

module.exports = RechargeStatisticsController;
