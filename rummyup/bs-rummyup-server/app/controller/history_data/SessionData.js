'use strict';
const Controller = require('egg').Controller;

class SessionDataController extends Controller {
    async form() {
        const { ctx } = this;
        const result = await ctx.service.history.getSessionData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            titleData: result.title,
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }
}

module.exports = SessionDataController;
