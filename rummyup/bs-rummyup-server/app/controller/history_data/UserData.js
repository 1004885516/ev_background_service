'use strict';
const Controller = require('egg').Controller;

class UserKeepController extends Controller {
    async form() {
        const { ctx } = this;
        const result = await ctx.service.history.getUserData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            numbers: result.numbers,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }
}

module.exports = UserKeepController;
