'use strict';
const Controller = require('egg').Controller;

class RechargeController extends Controller {
    async index() {
        const { ctx } = this;
        const result = await ctx.service.mail.getRechargeMail();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: result,
        };
        ctx.body = retBody;
    }
    async form() {
        const { ctx } = this;
        const result = await ctx.service.mail.sendRechargeMail();
        if (result) {
            ctx.body = ctx.getSuccessBody();
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }
}

module.exports = RechargeController;
