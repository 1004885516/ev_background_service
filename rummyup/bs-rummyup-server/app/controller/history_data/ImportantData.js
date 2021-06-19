'use strict';
const Controller = require('egg').Controller;

class ImportantDataController extends Controller {
    async index() {
        const { ctx } = this;
        const result = await ctx.service.history.getImportantData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }
}

module.exports = ImportantDataController;
