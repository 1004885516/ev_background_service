'use strict';
const Controller = require('egg').Controller;

class WithdrawManageController extends Controller {

    async form() {
        const { ctx } = this;
        const result = await ctx.service.withdraw.getWithdrawData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }

    async notify() {
        const { ctx } = this;
        const result = await ctx.service.withdraw.notifyWithdrawResult();
        if (result) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }
}

module.exports = WithdrawManageController;
