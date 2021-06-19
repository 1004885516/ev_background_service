'use strict';


const Controller = require('egg').Controller;

class RegisterController extends Controller {

    constructor(ctx) {
        super(ctx);
        this.service = ctx.service;
        this.reqBody = ctx.request.body;
    }

    async index() {

        const { ctx, service, reqBody } = this;
        const { username, password, confirm_password, register_password } = reqBody;

        const result = await service.register.userRegister(username, password, confirm_password, register_password);

        const body = {
            status: result,
        };
        ctx.body = body;
    }
}

module.exports = RegisterController;
