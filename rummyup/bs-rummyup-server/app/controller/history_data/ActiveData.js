'use strict';
const Controller = require('egg').Controller;

class ActiveDataController extends Controller {
    async form() {
        const { ctx } = this;
        const result = await ctx.service.history.getActiveData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }

    // 活跃数据选择框数据
    async getOptionMenu() {
        const { ctx } = this;
        const result = await ctx.service.history.getOptionData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            MediaSources: result,
        };
        ctx.body = retBody;
    }
}

module.exports = ActiveDataController;
