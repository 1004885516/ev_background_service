'use strict';


const Controller = require('egg').Controller;

class OTPController extends Controller {

    async form() {
        const { ctx } = this;
        const code = await ctx.service.user.getVerifyCode();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            verify_code: code,
        };
        ctx.body = retBody;
    }

}

module.exports = OTPController;
