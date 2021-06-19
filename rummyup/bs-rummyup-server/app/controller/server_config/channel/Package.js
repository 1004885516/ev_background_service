'use strict';
const Controller = require('egg').Controller;

class PackageController extends Controller {

    async index() {
        const { ctx, app } = this;
        const result = await ctx.service.channelPackage.getData();
        if (result === app.config.FAIL) {
            ctx.body = ctx.getFailedBody();
        } else {
            const retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        }
    }

    async form() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const result = await ctx.service.channelPackage.setData(reqBody);
        if (result === app.config.FAIL) {
            ctx.body = ctx.getFailedBody();
        } else {
            ctx.body = ctx.getSuccessBody();
        }
    }
}

module.exports = PackageController;
