'use strict';
const Controller = require('egg').Controller;

class GoldPoolAddController extends Controller {

    async index() {
        const { ctx } = this;
        const result = await ctx.service.definition.getGoldPoolAdd();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: result,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx, app } = this;
        const result = await ctx.service.definition.setGoldPoolAdd();
        if (result === app.config.FAIL) {
            ctx.body = ctx.getFailedBody();
        } else {
            ctx.body = ctx.getSuccessBody();
        }
    }
}

module.exports = GoldPoolAddController;
