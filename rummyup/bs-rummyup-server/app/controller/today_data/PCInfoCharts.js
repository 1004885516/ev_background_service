'use strict';
const Controller = require('egg').Controller;

class PCInfoController extends Controller {
    async form() {
        const { ctx, app } = this;
        const data = await ctx.service.pcInfo.getPCInfo();
        data[3] = [];
        for (let i = 0; i < 24 * (60 / app.config.PCInfoInterval); i++) {
            const time = ctx.getHoursAndMinByInt(i * app.config.PCInfoInterval);
            data[3].push(time);
        }
        let retBody = ctx.getSuccessBody();
        retBody.result = { data };
        ctx.body = retBody;
    }
}

module.exports = PCInfoController;
