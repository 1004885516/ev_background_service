'use strict';
const Controller = require('egg').Controller;

class CreateOrderController extends Controller {

    async form() {
        const { ctx } = this;
        const result = await ctx.service.recharge.createOrder();
        let retBody = ctx.getSuccessBody();
        retBody.result = result;
        ctx.body = retBody;
    }

    async operation() {
        const { ctx } = this;
        const result = await ctx.service.recharge.operation();
        let retBody = ctx.getSuccessBody();
        retBody.result = result;
        ctx.body = retBody;
    }

}

module.exports = CreateOrderController;
