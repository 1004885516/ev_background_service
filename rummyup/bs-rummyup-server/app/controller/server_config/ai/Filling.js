'use strict';
const Controller = require('egg').Controller;


class FillingController extends Controller {
    async index() {
        const { ctx } = this;
        let params = ctx.query;
        this.logger.info('params : ', params);
        let retBody = ctx.getSuccessBody();
        retBody.result = await ctx.service.ai.getFillingData();
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = this.parseInt(reqBody.data);
        const result = await ctx.service.ai.notifyGameServerByFilling(data);
        if (result.msg === 'ok') {
            await ctx.service.ai.setFillingData(data);
            ctx.body = ctx.getSuccessBody();
            return;
        }
        ctx.body = ctx.getFailedBody();
    }

    parseInt(data) {
        let newdata = {};
        newdata.EnterRate = [];
        newdata.LeaveRate = [];
        newdata.SealOff = Number.parseInt(data.SealOff);

        newdata.SealOff2User = Number(data.SealOff2User);
        newdata.BE2User = Number(data.BE2User);
        newdata.ERWaitTime = Number(data.ERWaitTime);
        newdata.LR2User = Number(data.LR2User);

        for (let i = 0; i < data.EnterRate.length; i++) {
            const sub1 = data.EnterRate[i];
            const sub2 = data.LeaveRate[i];
            newdata.EnterRate.push(Number.parseInt(sub1));
            newdata.LeaveRate.push(Number.parseInt(sub2));
        }
        return newdata;
    }

}

module.exports = FillingController;
