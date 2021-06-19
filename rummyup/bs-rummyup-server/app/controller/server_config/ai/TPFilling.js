'use strict';
const Controller = require('egg').Controller;


class TPFillingController extends Controller {
    async index() {
        const { ctx } = this;
        let params = ctx.query;
        this.logger.info('params : ', params);
        let retBody = ctx.getSuccessBody();
        retBody.result = await ctx.service.ai.getTPFillingData();
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = this.parseInt(reqBody.data);
        const result = await ctx.service.ai.setTPFillingData(data);
        if (result.msg === 'OK') {
            ctx.body = ctx.getSuccessBody();
            return;
        }
        ctx.body = ctx.getFailedBody();
    }

    parseInt(data) {
        let newdata = {};
        newdata.Page = Number(data.Page);
        newdata.EnterRate = [];
        newdata.LeaveRate = [];
        newdata.SealOff = Number.parseInt(data.SealOff);

        newdata.JoinRobotTime = Number(data.JoinRobotTime);
        newdata.RechargeUserRatio = Number(data.RechargeUserRatio);
        newdata.MisRobot = Number(data.MisRobot);
        newdata.EnterConcoct = Number(data.EnterConcoct);

        for (let i = 0; i < data.EnterRate.length; i++) {
            const sub1 = data.EnterRate[i];
            const sub2 = data.LeaveRate[i];
            newdata.EnterRate.push(Number.parseInt(sub1));
            newdata.LeaveRate.push(Number.parseInt(sub2));
        }
        return newdata;
    }

}

module.exports = TPFillingController;
