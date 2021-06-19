'use strict';
const Controller = require('egg').Controller;

class TriggerConfigController extends Controller {
    async index() {
        const { ctx } = this;
        const serverData = await ctx.service.ai.getTriggerConfig();
        let result = await ctx.service.upload.getTemplates(this.jsonToArray, serverData);
        if (result.TemplateData) {
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async uploadFileTrigger() {
        const { ctx } = this;
        ctx.body = await ctx.service.upload.uploadTemplate(this.jsonToArray, 'serverData');
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const filename = reqBody.filename;
        const jsontype = reqBody.jsontype;
        const createtime = reqBody.createtime;
        const index = reqBody.index;
        const uploadData = await ctx.service.upload.getUploadData(createtime, jsontype, filename);
        if (uploadData) {
            let result = await ctx.service.ai.setTriggerConfig(uploadData);
            this.logger.info('result : ', result);
            if (result.code === 200) {
                await ctx.service.upload.updateUploadDataByWork(jsontype);
                await ctx.service.upload.updateUploadData(createtime, jsontype, filename, 1);

                let templatefiles = await ctx.service.upload.getUploadFileList(jsontype);

                let retBody = ctx.getSuccessBody();
                retBody.result = {
                    GameSeverResult: result,
                    TemplateFiles: templatefiles,
                    TemplateIndex: index,
                };
                ctx.body = retBody;
                return;
            }
        }
        ctx.body = ctx.getFailedBody();
    }

    jsonToArray(fileJson) {
        let list = [];
        if (!fileJson || !fileJson.length === 0) {
            return list;
        }
        for (let i = 0; i < fileJson[0].length; i++) {
            const item = fileJson[0][i];
            let data = {};
            data.ID = i + 1;
            data.UserType = item.UserType;
            data.Rank = item.Rank;
            data.TheGameTimes = item.TheGameTimes;
            data.GameName = item.GameName;
            data.BaseScore = item.BaseScore;
            data.Percent = item.Percent;
            data.EventID = item.EventID;
            data.EventPercent = item.EventPercent;
            // data.LoseRoundNum = item.LoseRoundNum;
            // data.RAPercent = item.RAPercent;
            list.push(data);
        }
        return list;
    }
}

module.exports = TriggerConfigController;
