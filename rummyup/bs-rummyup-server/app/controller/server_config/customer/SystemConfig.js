'use strict';
const Controller = require('egg').Controller;

class SystemConfigController extends Controller {

    async index() {
        const { ctx } = this;
        const result = await ctx.service.customer.getSystemConfig();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: result,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const result = await ctx.service.customer.setSystemConfig();
        console.log('111111111', result);
        if (result.code !== 200) {
            const retBody = ctx.getFailedBody();
            retBody.msg = result.msg;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getSuccessBody();
        }
    }
}

module.exports = SystemConfigController;
