'use strict';
const Controller = require('egg').Controller;

class WeeksCardController extends Controller {
    async index() {
        const { ctx } = this;
        const weekData = await ctx.service.activity.getWeekCardData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            WeekData: weekData,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const result = await ctx.service.activity.setWeekCardData(data);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = WeeksCardController;
