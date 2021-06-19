'use strict';
const Controller = require('egg').Controller;

class CardTypeController extends Controller {

    async index() {
        const { ctx } = this;
        const result = await ctx.service.definition.getCardType();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: result,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const result = await ctx.service.definition.setCardType(reqBody);
        if (result.code !== 200) {
            const retBody = ctx.getFailedBody();
            retBody.msg = result.msg;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getSuccessBody();
        }
    }
}

module.exports = CardTypeController;
