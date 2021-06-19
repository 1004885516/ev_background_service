'use strict';
const Controller = require('egg').Controller;

class NewUserRechargeController extends Controller {
    async index() {
        const { ctx } = this;
        const balancePopUpData = await ctx.service.activity.getNewUserRechargeData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: balancePopUpData,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const result = await ctx.service.activity.setNewUserRechargeData(data);
        if (result.msg === 'OK') {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = NewUserRechargeController;
