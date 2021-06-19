'use strict';
const Controller = require('egg').Controller;


class MarqueeController extends Controller {

    async index() {
        const { ctx } = this;
        const result = await ctx.service.gm.getMarquee();
        if (result) {
            let retBody = ctx.getSuccessBody();
            retBody.data = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async form() {
        const { ctx } = this;
        const result = await ctx.service.gm.setMarquee();
        if (!result) {
            ctx.body = ctx.getFailedBody();
        } else {
            ctx.body = ctx.getSuccessBody();
        }
    }

    async getMarqueeGame() {
        const { ctx } = this;
        const result = await ctx.service.gm.getMarqueeGame();
        if (result) {
            let retBody = ctx.getSuccessBody();
            retBody.data = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async setMarqueeGame() {
        const { ctx } = this;
        const result = await ctx.service.gm.setMarqueeGame();
        if (!result) {
            ctx.body = ctx.getFailedBody();
        } else {
            ctx.body = ctx.getSuccessBody();
        }
    }
}

module.exports = MarqueeController;
