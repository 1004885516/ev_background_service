'use strict';
const Controller = require('egg').Controller;

class RummyController extends Controller {
    async index() {
        const { ctx } = this;
        const serverData = await this.getServerConfig();
        let result = await ctx.service.upload.getTemplates(this.jsonToArray, serverData);
        if (result.TemplateData) {
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async uploadFileShopConfig() {
        const { ctx } = this;
        const serverData = await this.getServerConfig();
        let retBody = await ctx.service.upload.uploadTemplate(this.jsonToArray, serverData);
        ctx.body = retBody;
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
            let result = await ctx.service.shop.NotifyGameServerByFun(uploadData);
            if (result) {
                await ctx.service.upload.updateUploadDataByWork(jsontype);
                await ctx.service.upload.updateUploadData(createtime, jsontype, filename, 1);

                let templatefiles = await ctx.service.upload.getUploadFileList(jsontype);
                templatefiles.unshift({ filename: '服务器数据', iswork: 1 });
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

    async getServerConfig() {
        const { ctx, app } = this;
        let bmartConfig = {};
        const result = await ctx.httpGet(app.config.GetShopFunConfig);
        if (result) {
            const config = result.config;
            bmartConfig.MinPayout = ctx.changeClientRatio(config.MinPayout);
            bmartConfig.MaxPayout = ctx.changeClientRatio(config.MaxPayout);
            bmartConfig.PayoutCount = config.PayoutCount;
            bmartConfig.Retained = ctx.changeClientRatio(config.Retained);
            bmartConfig.Tax = config.Tax;
            bmartConfig.AppId = config.AppId;
            bmartConfig.SerectKey = config.SerectKey;

            for (let i = 0; i < config.ExtraConfig.length; i++) {
                const element = config.ExtraConfig[i];
                element.Minimum = ctx.changeClientRatio(element.Minimum);
                element.Maximum = ctx.changeClientRatio(element.Maximum - 9999);
            }
            bmartConfig.ExtraConfig = config.ExtraConfig;

            for (let i = 0; i < config.ItemList.length; i++) {
                const element = config.ItemList[i];
                element.Count = ctx.changeClientRatio(element.Count);
                element.SerialNumber = i;
            }
            bmartConfig.ItemList = config.ItemList;
        }
        return [ bmartConfig ];
    }

    jsonToArray(fileJson) {
        let bmartConfig = {};
        if (!fileJson || !fileJson.length === 0) {
            return bmartConfig;
        }
        // 第一页
        // MinPayout MaxPayout PayoutCount Retained Tax AppId SerectKey
        for (let i = 0; i < fileJson[0].length; i++) {
            const item = fileJson[0][i];
            bmartConfig.MinPayout = item.MinPayout;
            bmartConfig.MaxPayout = item.MaxPayout;
            bmartConfig.PayoutCount = item.PayoutCount;
            bmartConfig.Retained = item.Retained;
            bmartConfig.Tax = item.Tax;
            bmartConfig.AppId = item.AppId;
            bmartConfig.SerectKey = item.SerectKey;
        }

        // 第二页
        // Minimum Maximum FirstExtra Extra BeginTime EndTime
        const backgroundConfig = [];
        for (let i = 0; i < fileJson[1].length; i++) {
            const item = fileJson[1][i];
            let data = {};
            data.Minimum = item.Minimum;
            data.Maximum = item.Maximum;
            data.FirstExtra = item.FirstExtra;
            data.Extra = item.Extra;
            data.BeginTime = item.BeginTime;
            data.EndTime = item.EndTime;
            backgroundConfig.push(data);
        }
        bmartConfig.ExtraConfig = backgroundConfig;

        // 第三页
        // SerialNumber Count Icon IsHot
        const showConfig = [];
        for (let i = 0; i < fileJson[2].length; i++) {
            const item = fileJson[2][i];
            let data = {};
            data.SerialNumber = item.SerialNumber;
            data.Count = item.Count;
            data.Icon = item.Icon;
            data.IsHot = item.IsHot;
            showConfig.push(data);
        }
        bmartConfig.ItemList = showConfig;
        return [ bmartConfig ];
    }
}

module.exports = RummyController;
