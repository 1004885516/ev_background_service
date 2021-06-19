'use strict';
const Controller = require('egg').Controller;

class PackageDataController extends Controller {
    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const PackageId = reqBody.package_id;
        const ApkId = reqBody.apk_id;
        const Date = reqBody.date;

        let retBody = ctx.getSuccessBody();
        const baseData = await ctx.service.dotData.getBaseData(PackageId, ApkId, Date);
        const clickLogin = await ctx.service.dotData.getClickLogin(PackageId, ApkId, Date);
        const loginSuccess = await ctx.service.dotData.getLoginSuccess(PackageId, ApkId, Date);
        const loginFail = await ctx.service.dotData.getLoginFail(PackageId, ApkId, Date);
        const locationNo = await ctx.service.dotData.getLocationNo(PackageId, ApkId, Date);
        const TPBaseData = await ctx.service.dotData.getTPBaseData(PackageId, ApkId, Date);
        retBody.result = {
            baseData,
            clickLogin,
            loginSuccess,
            loginFail,
            locationNo,
            TPBaseData,
        };
        ctx.body = retBody;
    }
}

module.exports = PackageDataController;
