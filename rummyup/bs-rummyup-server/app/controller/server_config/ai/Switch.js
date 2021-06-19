'use strict';
const Controller = require('egg').Controller;


class SwitchController extends Controller {
    async index() {
        const { ctx } = this;
        let retBody = ctx.getSuccessBody();
        retBody.result = await ctx.service.ai.getSwitchData();
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const type = reqBody.type;
        const senddata = data[type];
        const result = await ctx.service.ai.notifyGameServerBySwitch(senddata);
        if (result.success) {
            await ctx.service.ai.setSwitchData(data);
            ctx.body = ctx.getSuccessBody();
            return;
        }
        ctx.body = ctx.getFailedBody();
    }

}

module.exports = SwitchController;
