'use strict';
const Controller = require('egg').Controller;

class OperationConfigController extends Controller {
    async index() {
        const { ctx } = this;
        let result = await ctx.service.upload.getTemplates(this.jsonToArray);
        console.log('result', result);
        result.TemplateFiles[0].iswork = 1;
        if (result.TemplateData) {
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async uploadFileOperation() {
        const { ctx } = this;
        ctx.body = await ctx.service.upload.uploadTemplate(this.jsonToArray, 'serverData');
    }

    jsonToArray(fileJson) {
        console.log();
        let list = [];
        if (!fileJson || !fileJson.length === 0) {
            return list;
        }
        for (let i = 0; i < fileJson[0].length; i++) {
            const item = fileJson[0][i];
            let data = {};
            data.id = item.ID;
            data.robot_oper = item.RobotOper;
            data.robot_oper_time = item.RobotOperTime;
            data.reject_compare = item.RejectCompare;
            data.seen_card_type = item.SeenCardType;
            data.seen_card_time = item.SeenCardTime;
            list.push(data);
        }
        return list;
    }
}

module.exports = OperationConfigController;
