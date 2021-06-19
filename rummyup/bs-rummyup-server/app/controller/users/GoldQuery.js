
'use strict';
const Controller = require('egg').Controller;

class GoldQueryController extends Controller {

    async index() {
        const { ctx } = this;
        const result = await ctx.service.user.getGoldData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }
}

module.exports = GoldQueryController;
