'use strict';
const Controller = require('egg').Controller;

class RechargeQueryController extends Controller {

    async form() {
        const { ctx } = this;
        const result = await ctx.service.recharge.getRechargeData();
        let retBody = ctx.getSuccessBody();
        retBody.result = result;
        ctx.body = retBody;
    }
    async getUserData() {
        const { ctx } = this;
        const result = await ctx.service.recharge.getUserDetail();
        let retBody = ctx.getSuccessBody();
        retBody.result = result;
        ctx.body = retBody;
    }
}

module.exports = RechargeQueryController;
