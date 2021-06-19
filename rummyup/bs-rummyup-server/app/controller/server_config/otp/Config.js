'use strict';
const Controller = require('egg').Controller;

class OTPConfigController extends Controller {
    async get() {
        const { ctx } = this;
        const result = await ctx.service.otp.getConfig();
        if (result) {
            const retBody = ctx.getSuccessBody();
            retBody.result = { otpSelect: result.Channel };
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async form() {
        const { ctx } = this;
        const result = await ctx.service.otp.setConfig();
        if (result) {
            ctx.body = ctx.getSuccessBody();
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }
}

module.exports = OTPConfigController;
