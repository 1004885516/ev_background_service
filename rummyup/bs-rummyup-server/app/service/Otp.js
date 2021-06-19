'use strict';

const Service = require('egg').Service;

class OTPService extends Service {

    async getConfig() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetOTPConfig);
        this.logger.info(JSON.stringify(result));
        if (result.code === 200) {
            return result.config;
        }
        return false;
    }

    async setConfig() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const channel = Number.parseInt(reqBody.Channel);
        const data = { Channel: channel };
        this.logger.info('data : ', data);
        const result = await ctx.httpPost(app.config.SetOTPConfig, JSON.stringify(data));
        if (result) {
            return true;
        }
        return false;
    }
}

module.exports = OTPService;
