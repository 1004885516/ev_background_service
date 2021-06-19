'use strict';
const Controller = require('egg').Controller;

class LimitActiveController extends Controller {
    async index() {
        const { ctx } = this;
        const limitdata = await ctx.service.activity.getTimeLimitData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            LimitData: limitdata,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;

        const result = await ctx.service.activity.setTimeLimitData(data);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = LimitActiveController;
