'use strict';
const Controller = require('egg').Controller;

class UserKeepController extends Controller {
    async form() {
        const { ctx } = this;
        const result = await ctx.service.keep.getUserKeepData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }

    async getMediaSources() {
        const { ctx } = this;
        const result = await ctx.service.keep.getMediaSources();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            MediaSources: result,
        };
        ctx.body = retBody;
    }
}

module.exports = UserKeepController;
