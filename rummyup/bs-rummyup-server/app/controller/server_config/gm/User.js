'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {
    async queryUser() {
        const { ctx } = this;
        const result = await ctx.service.user.getUserInfo();
        if (result) {
            result.LoginTime = ctx.transferDateTime(result.LoginTime);
            result.RegTime = ctx.transferDateTime(result.RegTime);
            result.AmountGold = ctx.changeClientRatio(result.Gold + result.WinGold);
            result.Gold = ctx.changeClientRatio(result.Gold);
            result.WinGold = ctx.changeClientRatio(result.WinGold);
            result.TotalPayIn = ctx.changeClientRatio(result.TotalPayIn);
            result.TotalPayOut = ctx.changeClientRatio(result.TotalPayOut);
            result.RobotGold = ctx.changeClientRatio(result.RobotGold);
            result.PayGold = ctx.changeClientRatio(result.PayGold);
            result.PayWinGold = ctx.changeClientRatio(result.PayWinGold);
        }
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            UserInfo: result,
        };
        ctx.body = retBody;
    }

    async changeGold() {
        const { ctx } = this;
        const result = await ctx.service.gm.changeGold();
        this.logger.info('result : ', result);
        if (result.Err === 0) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        let retBody = ctx.getFailedBody();
        ctx.body = retBody;
    }

    async changeGears() {
        const { ctx } = this;
        const result = await ctx.service.gm.changeGears();
        this.logger.info('result : ', result);
        if (result.code === 200) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        let retBody = ctx.getFailedBody();
        ctx.body = retBody;
    }

    async changeCards() {
        const { ctx } = this;
        const result = await ctx.service.gm.changeCards();
        this.logger.info('result : ', result);
        if (result.ok === 0) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        let retBody = ctx.getFailedBody();
        ctx.body = retBody;
    }
}

module.exports = UserController;
