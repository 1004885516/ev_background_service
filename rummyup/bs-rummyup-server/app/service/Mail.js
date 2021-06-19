'use strict';
const Service = require('egg').Service;

class MailService extends Service {
    async sendSystemMail() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const params = {
            EnMailTitle: reqBody.EnMailTitle,
            EnMailContent: reqBody.EnMailContent,
            InMailTitle: reqBody.InMailTitle,
            InMailContent: reqBody.InMailContent,
            RummyGold: 0,
            TeenPattiGold: ctx.changeServerRatio(reqBody.TeenPattiGold),
            Continued: Number.parseInt(reqBody.Continued),
        };
        this.logger.info('params : ', JSON.stringify(params));
        const result = await ctx.httpPost(app.config.SendSystemMail, JSON.stringify(params));
        if (result.msg === 'ok') {
            return true;
        }
        return false;
    }

    async sendUserMail() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const params = {
            EnMailTitle: reqBody.EnMailTitle,
            EnMailContent: reqBody.EnMailContent,
            InMailTitle: reqBody.InMailTitle,
            InMailContent: reqBody.InMailContent,
            RummyGold: 0,
            TeenPattiGold: ctx.changeServerRatio(reqBody.TeenPattiGold),
            UserId: Number.parseInt(reqBody.UserId),
        };
        const result = await ctx.httpPost(app.config.SendUserMail, JSON.stringify(params));
        if (result.msg === 'ok') {
            return true;
        }
        return false;
    }

    async searchMail() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const mailType = Number.parseInt(reqBody.MailType);
        const ID = Number.parseInt(reqBody.ID);
        const UserId = Number.parseInt(reqBody.UserId);
        const EnMailTitle = reqBody.EnMailTitle;
        const EnMailContent = reqBody.EnMailContent;

        let sql = `select * from ${mailType === 0 ? 'UserMail' : 'SysMail'}`;
        let where_sql = '';
        let params = [];
        if (ID !== 0) {
            sql += where_sql === '' ? ' where ID = ?' : ' and ID = ?';
            params.push(ID);
        }
        if (UserId !== 0) {
            sql += where_sql === '' ? ' where UserId = ?' : ' and UserId = ?';
            params.push(UserId);
        }
        if (EnMailTitle) {
            sql += where_sql === '' ? ' where EnMailTitle = ?' : ' and EnMailTitle = ?';
            params.push(EnMailTitle);
        }
        if (EnMailContent) {
            sql += where_sql === '' ? ' where EnMailContent = ?' : ' and EnMailContent = ?';
            params.push(EnMailContent);
        }
        sql += where_sql;
        const result = await ctx.mysqlQueryByGame(sql, params);
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                item.TeenPattiGold = ctx.changeClientRatio(item.TeenPattiGold);
                item.CreateTime = ctx.transferDateTime(item.CreateTime);
            }
        }
        return result;
    }

    async cancelMail() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const mailType = reqBody.MailType;
        if (mailType === 0) { // 用户
            const params = { UserId: reqBody.UserId, MailId: reqBody.MailId };
            const result = await ctx.httpPost(app.config.CancelUserMail, JSON.stringify(params));
            if (result.err === 0) {
                return true;
            }
        } else if (mailType === 1) { // 系统
            const params = { MailId: reqBody.MailId };
            const result = await ctx.httpPost(app.config.CancelSystemMail, JSON.stringify(params));
            if (result.err === 0) {
                return true;
            }
        }
        return false;
    }

    async getRechargeMail() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetMailTemplate);
        if (result.code === 200) {
            return result.config;
        }
        return false;
    }

    async sendRechargeMail() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const params = {
            Type: reqBody.Type,
            EnMailTitle: reqBody.EnMailTitle,
            EnMailContent: reqBody.EnMailContent,
            InMailTitle: reqBody.InMailTitle,
            InMailContent: reqBody.InMailContent,
        };
        const result = await ctx.httpPost(app.config.SetMailTemplate, JSON.stringify(params));
        this.logger.info('sendRechargeMail : result', result);
        if (result.code === 200) {
            return true;
        }
        return false;
    }

}

module.exports = MailService;
