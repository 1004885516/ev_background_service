'use strict';
const Controller = require('egg').Controller;

class ServerUpdateController extends Controller {
    async index() {
        const { ctx } = this;
        const serverUpdateData = await ctx.service.gm.getServerUpdateData();
        serverUpdateData.upDate.WhiteList = await this.wihtelistToString(serverUpdateData.upDate.WhiteList);
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            data: serverUpdateData,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const result = await ctx.service.gm.setServerUpdateData(reqBody);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }

    async setIpConfig() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const result = await ctx.service.gm.setIpConfigData(reqBody);
        if (result.success) {
            let retBody = ctx.getSuccessBody();
            ctx.body = retBody;
            return;
        }
        ctx.body = ctx.getFailedBody();
    }

    async wihtelistToString(whiteList) {
        let result = '';
        for (let i = 0; i < whiteList.length; i++) {
            result += whiteList[i];
            if (i < whiteList.length - 1) {
                result += ',';
            }
        }
        return result;
    }

}

module.exports = ServerUpdateController;
