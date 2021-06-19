'use strict';
const Controller = require('egg').Controller;

class RummyController extends Controller {
    async index() {
        const { ctx } = this;
        const serverType = ctx.request.body.serverType;
        const serverData = await ctx.service.ai.getPolicyByServerConfig(serverType);
        let result = await ctx.service.upload.getTemplates(this.jsonToArray, serverData);
        if (result.TemplateData) {
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async uploadFileRCC() {
        const { ctx } = this;
        ctx.body = await ctx.service.upload.uploadTemplate(this.jsonToArray, 'serverData');
    }

    async saveByOldLocal(params, createtime, cardtype) {
        const { ctx } = this;
        const db_name = 'control_Card';
        const sql = `INSERT INTO ${db_name} (CreateTime, cardType, ControlCardJson) VALUES (?,?,?);`;
        const sqlParams = JSON.stringify(JSON.stringify(params));
        await ctx.mysqlQueryByOldLocal(sql, [ createtime, cardtype, sqlParams ]);
    }

    async form() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const isAll = reqBody.isAll;
        const page = reqBody.page;
        const filename = reqBody.filename;
        const jsontype = reqBody.jsontype;
        const createtime = reqBody.createtime;
        const index = reqBody.index;
        const uploadData = await ctx.service.upload.getUploadData(createtime, jsontype, filename);
        if (uploadData) {
            let result;
            if (isAll) {
                for (let i = 0; i < uploadData.length; i++) {
                    const data = uploadData[i];
                    data.CardType = this.getCardType(app, jsontype);
                    result = await ctx.service.ai.notifyGameServerByRCC(data);
                }
            } else {
                const data = uploadData.find(item => {
                    return item.Page === page;
                });
                data.CardType = this.getCardType(app, jsontype);
                result = await ctx.service.ai.notifyGameServerByRCC(data);
            }
            if (result.success) {
                await ctx.service.upload.updateUploadDataByWork(jsontype);
                await ctx.service.upload.updateUploadData(createtime, jsontype, filename, 1);

                let templatefiles = await ctx.service.upload.getUploadFileList(jsontype);

                await this.saveByOldLocal(uploadData, ctx.getTimeSymbol(), jsontype === app.config.UploadFileType.AiRummy ? 0 : 1);
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
        let PolicyRankList = [];
        for (let i = 0; i < fileJson.length; i++) {
            const item = fileJson[i];
            let gearItem = {};
            gearItem.Page = i;
            gearItem.PolicyRank = 0;
            gearItem.NearCardPercent = 0;
            gearItem.GhostCardPercent = [];
            gearItem.CardGroupList = [];
            for (let j = 0; j < item.length; j++) {
                const sub = item[j];
                if (sub.GroupType === 'HunZi') {
                    for (let k = 0; k < 12; k++) {
                        const ele = sub[k];
                        gearItem.GhostCardPercent[k] = ele;
                    }
                } else if (sub.GroupType === 'ZhenShunZi' || sub.GroupType === 'JiaShunZi') {
                    let ele = {};
                    ele.GroupType = sub.GroupType === 'ZhenShunZi' ? 1 : 2;
                    ele.Percent = sub.Percent;
                    ele.CardNumPercent = {};
                    for (let k = 3; k < 14; k++) {
                        ele.CardNumPercent[`${k}`] = sub[`${k}`];
                    }
                    gearItem.CardGroupList.push(ele);
                } else if (sub.GroupType === 'ZhaDan') {
                    let ele = {};
                    ele.GroupType = 3;
                    ele.Percent = sub.Percent;
                    ele.CardNumPercent = {};
                    for (let k = 2; k < 5; k++) {
                        ele.CardNumPercent[`${k}`] = sub[`${k}`];
                    }
                    gearItem.CardGroupList.push(ele);
                } else if (sub.GroupType === 'LinJin') {
                    let ele = {};
                    ele.GroupType = 4;
                    ele.Percent = sub.Percent;
                    gearItem.CardGroupList.push(ele);
                } else if (sub.GroupType === 'NearCardPercent') {
                    gearItem.NearCardPercent = sub.Percent;
                } else if (sub.GroupType === 'PolicyRank') {
                    gearItem.PolicyRank = sub.Percent;
                }
            }
            PolicyRankList.push(gearItem);
        }
        return PolicyRankList;
    }

    getCardType(app, jsontype) {
        let cardType = 0;
        switch (jsontype) {
            case app.config.UploadFileType.AiRummy:
                cardType = 0;
               break;
            case app.config.UploadFileType.AiRummyRobot:
                cardType = 1;
               break;
            case app.config.UploadFileType.AIRummy2User:
                cardType = 2;
               break;
            case app.config.UploadFileType.AIRummy2UserRobot:
                cardType = 3;
               break;
            default:
                cardType = 0;
        }
        return cardType;
    }
}

module.exports = RummyController;
