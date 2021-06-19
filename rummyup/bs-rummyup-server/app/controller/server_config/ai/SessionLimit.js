'use strict';
const Controller = require('egg').Controller;


class SessionLimitController extends Controller {
    async index() {
        const { ctx } = this;
        let params = ctx.query;
        this.logger.info('params : ', params);
        let retBody = ctx.getSuccessBody();
        retBody.result = await ctx.service.ai.getSessionLimitData();
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const result = await ctx.service.ai.setSessionLimitData(data);
        if (result.msg === 'ok') {
            ctx.body = ctx.getSuccessBody();
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = SessionLimitController;
