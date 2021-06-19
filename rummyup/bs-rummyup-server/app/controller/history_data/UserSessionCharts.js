'use strict';
const Controller = require('egg').Controller;

class UserSessionChartsController extends Controller {
    async form() {
        const { ctx } = this;
        const SessionData = await ctx.service.session.getUserSessionChartsData();
        const SessionTable = await ctx.service.session.getSessionTable();
        let retBody = ctx.getSuccessBody();
        retBody.result = { data: SessionData, table: SessionTable };
        ctx.body = retBody;

    }
}

module.exports = UserSessionChartsController;
