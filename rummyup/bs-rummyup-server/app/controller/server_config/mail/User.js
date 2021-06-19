'use strict';
const Controller = require('egg').Controller;

class SystemController extends Controller {
    async form() {
        const { ctx } = this;
        const result = await ctx.service.mail.sendUserMail();
        if (result) {
            ctx.body = ctx.getSuccessBody();
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }
}

module.exports = SystemController;
