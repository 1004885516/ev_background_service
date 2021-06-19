'use strict';
const Controller = require('egg').Controller;

class ActivityShowController extends Controller {
    async index() {
        const { ctx } = this;
        const activityShowData = await ctx.service.activity.getActivityShowData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            ShowData: activityShowData,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const result = await ctx.service.activity.setActivityShowData(data);
        if (result.message === 'ok') {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }

    async setNoviciate() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const result = await ctx.service.activity.setNoviciateData(data);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = ActivityShowController;
