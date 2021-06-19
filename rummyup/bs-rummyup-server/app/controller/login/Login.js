'use strict';
const Controller = require('egg').Controller;

class LoginController extends Controller {

    constructor(ctx) {
        super(ctx);
        this.service = ctx.service;
        this.reqBody = ctx.request.body;
    }

    async index() {

        const { ctx, service, reqBody } = this;
        const { username, password } = reqBody;

        const { token, user } = await service.login.userLogin(username, password);

        const data = { token, user };

        ctx.body = data;
    }
}

module.exports = LoginController;
