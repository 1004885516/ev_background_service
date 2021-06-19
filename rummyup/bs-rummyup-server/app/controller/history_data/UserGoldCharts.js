'use strict';
const Controller = require('egg').Controller;

class UserGoldChartsController extends Controller {
    async form() {
        const { ctx } = this;
        const totalGold = await ctx.service.user.getTotalGoldByCharts();
        const robotGold = await ctx.service.user.getRobotGoldByCharts();
        const totalGoldTable = await ctx.service.user.getTotalGoldTable();
        let retBody = ctx.getSuccessBody();
        retBody.result = { totalGold, robotGold, totalGoldTable };
        ctx.body = retBody;

    }
}

module.exports = UserGoldChartsController;
