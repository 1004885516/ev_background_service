'use strict';
const Controller = require('egg').Controller;

class GamePlayerController extends Controller {

    async index() {
        const { ctx } = this;
        const result = await ctx.service.definition.getGamePlayer();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: result,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const result = await ctx.service.definition.setGamePlayer(reqBody);
        if (result === app.config.FAIL) {
            ctx.body = ctx.getFailedBody();
        } else {
            ctx.body = ctx.getSuccessBody();
        }
    }
}

module.exports = GamePlayerController;
