'use strict';
const Controller = require('egg').Controller;

class NewUserGiveController extends Controller {
    async index() {
        const { ctx } = this;
        const nugdata = await ctx.service.activity.getNewUserGiveData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            NewUserGiveData: nugdata,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        await ctx.service.activity.setNewUserGiveData(data);
        const result = await ctx.service.activity.notifyGameServerByNUG(data);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = NewUserGiveController;
