'use strict';
const Controller = require('egg').Controller;

class BalancePopUpController extends Controller {
    async index() {
        const { ctx } = this;
        const balancePopUpData = await ctx.service.activity.getBalancePopUpData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: balancePopUpData,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const result = await ctx.service.activity.setBalancePopUpData(data);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = BalancePopUpController;
