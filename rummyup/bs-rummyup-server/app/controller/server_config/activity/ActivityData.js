'use strict';
const Controller = require('egg').Controller;

class ActivityDataController extends Controller {
    // async getActivityLimitData() {
    //     const { ctx } = this;
    //     const result = await ctx.service.activity.getActivityData();
    //     let retBody = ctx.getSuccessBody();
    //     retBody.result = {
    //         tableData: result.data,
    //         page: ctx.request.body.page,
    //         page_total: result.total,
    //     };
    //     ctx.body = retBody;
    // }

    async getActivity() {
        const { ctx } = this;
        const result = await ctx.service.activity.getActivityData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }

    async getNewUserRechargeData() {
        const { ctx } = this;
        const result = await ctx.service.activity.getNewUserRecharge();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: result.data,
            page: ctx.request.body.page,
            page_total: result.total,
        };
        ctx.body = retBody;
    }

}

module.exports = ActivityDataController;
