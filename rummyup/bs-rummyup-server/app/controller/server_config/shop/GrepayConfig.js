'use strict';


const Controller = require('egg').Controller;

class GrepayController extends Controller {
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
            let result = await ctx.service.shop.NotifyGameServerByGrepay(uploadData);
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
        let grepayConfig = {};
        const result = await ctx.httpGet(app.config.GetSerpayConfig);
        if (result) {
            const config = result.config;
            grepayConfig.MinPayout = ctx.changeClientRatio(config.MinPayout);
            grepayConfig.MaxPayout = ctx.changeClientRatio(config.MaxPayout);
            grepayConfig.PayoutCount = config.PayoutCount;
            grepayConfig.Retained = ctx.changeClientRatio(config.Retained);
            grepayConfig.Tax = config.Tax;
            grepayConfig.OrgNo = config.OrgNo;
            grepayConfig.CustId = config.CustId;
            grepayConfig.Key = config.Key;
            grepayConfig.SubAccount = config.SubAccount;

            if (config.ExtraConfig) {
                for (let i = 0; i < config.ExtraConfig.length; i++) {
                    const element = config.ExtraConfig[i];
                    element.Minimum = ctx.changeClientRatio(element.Minimum);
                    element.Maximum = ctx.changeClientRatio(element.Maximum - 9999);
                }
                grepayConfig.ExtraConfig = config.ExtraConfig;
            }
            if (config.ItemList) {
                for (let i = 0; i < config.ItemList.length; i++) {
                    const element = config.ItemList[i];
                    element.Count = ctx.changeClientRatio(element.Count);
                    element.SerialNumber = i;
                }
                grepayConfig.ItemList = config.ItemList;
            }

        }
        return [ grepayConfig ];
    }

    jsonToArray(fileJson) {
        let grepayConfig = {};
        if (!fileJson || !fileJson.length === 0) {
            return grepayConfig;
        }
        // 第一页
        // MinPayout MaxPayout PayoutCount Retained Tax AppId SerectKey
        for (let i = 0; i < fileJson[0].length; i++) {
            const item = fileJson[0][i];
            grepayConfig.MinPayout = item.MinPayout;
            grepayConfig.MaxPayout = item.MaxPayout;
            grepayConfig.PayoutCount = item.PayoutCount;
            grepayConfig.Retained = item.Retained;
            grepayConfig.Tax = item.Tax;
            grepayConfig.OrgNo = item.OrgNo;
            grepayConfig.CustId = item.CustId;
            grepayConfig.Key = item.Key;
            grepayConfig.SubAccount = item.SubAccount;
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
        grepayConfig.ExtraConfig = backgroundConfig;

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
        grepayConfig.ItemList = showConfig;
        return [ grepayConfig ];
    }
}

module.exports = GrepayController;
