'use strict';
const Controller = require('egg').Controller;

class TeenPattiController extends Controller {
    async index() {
        const { ctx } = this;
        const serverType = ctx.request.body.serverType;
        const serverData = await ctx.service.ai.getSessionByServerConfig(serverType);
        let result = await ctx.service.upload.getTemplates(this.jsonToArray, serverData);
        if (result.TemplateData) {
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async uploadFileSessionTeenPatti() {
        const { ctx } = this;
        ctx.body = await ctx.service.upload.uploadTemplate(this.jsonToArray, 'serverData');
    }

    async saveByOldLocal(saveData) {
        const { ctx } = this;

        let sql = 'DELETE FROM sessions_teenpatti';
        await ctx.mysqlQueryByOldLocal(sql, []);

        let dataParams = '';
        for (let i = 0; i < saveData.length; i++) {
            let data = saveData[i];
            dataParams += `(${data.session_id},${JSON.stringify(data.session_name)},${ctx.changeServerRatio(data.threshold)},
                ${ctx.changeServerRatio(data.base_score)},${ctx.changeServerRatio(data.min_into)},${ctx.changeServerRatio(data.max_into)},
                ${data.service_charge},${data.blinds_rounds},${ctx.changeServerRatio(data.betting_cap)},${ctx.changeServerRatio(data.chip_cap)},${data.robot},`;
            for (let j = 0; j < 12; j++) {
                dataParams += JSON.stringify(data[`online_users${j * 2}_${(j + 1) * 2}`]);
                if (j < 11) {
                    dataParams += ',';
                }
            }
            dataParams += ')';
            if (i < saveData.length - 1) {
                dataParams += ',';
            }
        }
        sql = 'INSERT INTO sessions_teenpatti ' +
                '(session_id, session_name, threshold, base_score, min_into, max_into, service_charge, blinds_rounds, betting_cap, chip_cap, robot,' +
                ' online_users0_2, online_users2_4, online_users4_6, online_users6_8, online_users8_10, online_users10_12,' +
                ' online_users12_14, online_users14_16, online_users16_18, online_users18_20, online_users20_22, online_users22_24) VALUE' + dataParams;
        this.logger.info('saveByOldLocal sql: ', sql);
        await ctx.mysqlQueryByOldLocal(sql, []);
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
            let result = await ctx.service.session.notifyGameServerBySTP(uploadData);
            this.logger.info('result : ', result);
            if (result.session && result.online) {
                await ctx.service.upload.updateUploadDataByWork(jsontype);
                await ctx.service.upload.updateUploadData(createtime, jsontype, filename, 1);

                let templatefiles = await ctx.service.upload.getUploadFileList(jsontype);

                await this.saveByOldLocal(uploadData);
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
        // this.logger.info('fileJson : ', fileJson);
        let SessionList = [];
        if (!fileJson || !fileJson.length === 0) {
            return SessionList;
        }
        for (let i = 0; i < fileJson[0].length; i++) {
            const item = fileJson[0][i];
            let data = {};
            data.session_name = item.SessionName;
            data.session_id = item.SessionId;
            data.base_score = item.BaseScore;
            data.threshold = item.Threshold;
            data.min_into = item.MinInto;
            data.max_into = item.MaxInto;
            data.service_charge = item.ServiceCharge;
            data.blinds_rounds = item.Blind;
            data.betting_cap = item.BetLimit;
            data.chip_cap = item.ChipLimit;
            data.robot = item.Robot;
            data.online_users0_2 = item['0_2'];
            data.online_users2_4 = item['2_4'];
            data.online_users4_6 = item['4_6'];
            data.online_users6_8 = item['6_8'];
            data.online_users8_10 = item['8_10'];
            data.online_users10_12 = item['10_12'];
            data.online_users12_14 = item['12_14'];
            data.online_users14_16 = item['14_16'];
            data.online_users16_18 = item['16_18'];
            data.online_users18_20 = item['18_20'];
            data.online_users20_22 = item['20_22'];
            data.online_users22_24 = item['22_24'];
            SessionList.push(data);
        }
        return SessionList;
    }
}

module.exports = TeenPattiController;
