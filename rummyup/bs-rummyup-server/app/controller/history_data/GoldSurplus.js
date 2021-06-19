'use strict';
const Controller = require('egg').Controller;

class GoldSurplusController extends Controller {
    async form() {
        const { ctx } = this;
        const result = await ctx.service.history.getGoldSurplusData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }
}

module.exports = GoldSurplusController;
