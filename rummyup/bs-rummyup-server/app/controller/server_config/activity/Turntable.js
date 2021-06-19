'use strict';
const Controller = require('egg').Controller;

class TurntableController extends Controller {
    async index() {
        const { ctx } = this;
        const turntabledata = await this.getTurntableData();
        const templatefiles = await this.getTemplateList();
        this.logger.info('turntabledata : ', JSON.stringify(turntabledata));
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            TurntableData: turntabledata,
            TemplateFiles: templatefiles,
        };
        ctx.body = retBody;
    }

    async uploadFileTurntable() {
        const { ctx, app } = this;
        const upload = await ctx.service.upload.index(app.config.ACFilePath);
        if (!upload.filename) {
            ctx.body = ctx.getFailedBody();
            return;
        }
        const timeSuffix = ctx.getTimeSymbol();
        await ctx.service.activity.insertTurntableFile(upload.filename, timeSuffix, app.config.UploadFileType.Turntable);

        const fileJson = await ctx.service.file.index(app.config.ACFilePath + upload.filename);
        const turntabledata = await this.jsonToArray(fileJson.json);
        const templatefiles = await this.getTemplateList();
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            TurntableData: turntabledata,
            TemplateFiles: templatefiles,
        };
        ctx.body = retBody;
    }

    async form() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const filename = reqBody.filename;
        if (ctx.service.file.isExsit(app.config.ACFilePath + filename)) {
            const fileJson = await ctx.service.file.index(app.config.ACFilePath + filename);
            const turntabledata = await this.jsonToArray(fileJson.json);
            const result = await ctx.service.activity.notifyGameServerByTurntable(turntabledata);
            if (result) {
                let retBody = ctx.getSuccessBody();
                retBody.result = result;
                ctx.body = retBody;
                return;
            }
        }
        ctx.body = ctx.getFailedBody();
    }

    async getTemplateList() {
        const { ctx, app } = this;
        const filelist = await ctx.service.activity.getTurntableFiles(app.config.UploadFileType.Turntable);
        let templatefiles = [];
        if (filelist.length > 0) {
            for (let i = 0; i < filelist.length; i++) {
                const item = filelist[i];
                templatefiles.push({ filename: item.filename, createtime: ctx.transferDateTime(item.createtime), path: app.config.ACFilePath });
            }
        } else {
            templatefiles.push({ filename: app.config.TurntableTemplateName, path: app.config.TemplatePath });
        }
        return templatefiles;
    }

    async getTurntableData() {
        const { ctx } = this;
        const data = await ctx.service.activity.getTurntableData();
        if (data) {
            return await this.dataToArray(data);
        }
        const templatefiles = await this.getTemplateList();
        const lastTemplate = templatefiles[0];
        const fileJson = await ctx.service.file.index(lastTemplate.path + lastTemplate.filename);
        const filedata = await this.jsonToArray(fileJson.json);
        return filedata;
    }

    async dataToArray(data) {
        let TurntableData = { daily_number: 0, prize_list: [] };
        if (!data || !data.length === 0) {
            return TurntableData;
        }
        TurntableData.daily_number = Number.parseInt(data.PlayCount);
        for (let i = 0; i < data.PrizeList.length; i++) {
            const item = data.PrizeList[i];
            let sub = {};
            sub.id = item.ID;
            sub.prize_type = item.PrizeType;
            sub.prize_name = item.PrizeName;
            sub.prize_num = item.PrizeNum;
            sub.prize_icon = item.PrizeIcon;
            sub.chance = item.Chance;
            TurntableData.prize_list.push(sub);
        }
        return TurntableData;
    }

    async jsonToArray(fileJson) {
        const { ctx } = this;
        let TurntableData = { daily_number: 0, prize_list: [] };
        if (!fileJson || !fileJson.length === 0) {
            return TurntableData;
        }
        for (let i = 0; i < fileJson[0].length; i++) {
            const item = fileJson[0][i];
            let data = {};
            data.id = item.ID;
            data.prize_type = item.PrizeType;
            data.prize_name = item.PrizeName;
            data.prize_num = ctx.changeServerRatio(item.PrizeNum);
            data.prize_icon = item.PrizeIcon;
            data.chance = ctx.changeServerRatioBy100(item.Chance);
            TurntableData.prize_list.push(data);
            if (item.PlayCount) {
                TurntableData.daily_number = Number.parseInt(item.PlayCount);
            }
        }
        return TurntableData;
    }
}

module.exports = TurntableController;
