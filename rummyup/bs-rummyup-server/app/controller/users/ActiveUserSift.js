
'use strict';
const Controller = require('egg').Controller;

class InviteQueryController extends Controller {

    async form() {
        const { ctx } = this;
        const result = await ctx.service.user.activeUserSift();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }
}

module.exports = InviteQueryController;
