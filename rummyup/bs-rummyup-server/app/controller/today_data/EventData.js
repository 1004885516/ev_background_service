'use strict';
const Controller = require('egg').Controller;

class EventDataController extends Controller {
    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const PackageId = reqBody.package_id;
        const ApkId = reqBody.apk_id;

        // this.logger.info('packageId : ', packageId);
        const baseData = await ctx.service.dotData.getBaseData(PackageId, ApkId);
        // this.logger.info('baseData : ', baseData);
        const clickLogin = await ctx.service.dotData.getClickLogin(PackageId, ApkId);
        // this.logger.info('clickLogin : ', clickLogin);
        const loginSuccess = await ctx.service.dotData.getLoginSuccess(PackageId, ApkId);
        // this.logger.info('loginSuccess : ', loginSuccess);
        const loginFail = await ctx.service.dotData.getLoginFail(PackageId, ApkId);
        // this.logger.info('loginFail : ', loginFail);
        const locationNo = await ctx.service.dotData.getLocationNo(PackageId, ApkId);
        // this.logger.info('locationNo : ', locationNo);
        const TPBaseData = await ctx.service.dotData.getTPBaseData(PackageId, ApkId);
        let retBody = ctx.getSuccessBody();
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

module.exports = EventDataController;
