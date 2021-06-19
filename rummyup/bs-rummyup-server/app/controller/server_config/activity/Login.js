'use strict';
const Controller = require('egg').Controller;

class LoginController extends Controller {
    async index() {
        const { ctx } = this;
        const logindata = await ctx.service.activity.getLoginData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            LoginData: logindata,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;

        const result = await ctx.service.activity.notifyGameServerByLogin(data);
        if (result.message === 'ok') {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = LoginController;
