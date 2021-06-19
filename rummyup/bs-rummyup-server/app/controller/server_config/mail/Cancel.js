'use strict';
const Controller = require('egg').Controller;

class SystemController extends Controller {
    async search() {
        const { ctx } = this;
        const result = await ctx.service.mail.searchMail();
        if (result) {
            let retBody = ctx.getSuccessBody();
            retBody.result = {};
            retBody.result.data = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async cancel() {
        const { ctx } = this;
        const result = await ctx.service.mail.cancelMail();
        if (result) {
            ctx.body = ctx.getSuccessBody();
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }
}

module.exports = SystemController;
