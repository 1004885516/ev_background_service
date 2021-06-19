'use strict';
const Controller = require('egg').Controller;

class BulletinBoardController extends Controller {
    async index() {
        const { ctx } = this;
        const boardData = await ctx.service.activity.getBulletinBoardData();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            BoardData: boardData,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data;
        const result = await ctx.service.activity.setBulletinBoardData(data);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }
}

module.exports = BulletinBoardController;
