'use strict';


const Service = require('egg').Service;

class GamePlayerService extends Service {

    async getSystemConfig() {
        const { ctx, app } = this;
        const params = { list: [ 'WhatsApp', 'VipWhatsApp', 'WhatsAppEmail' ] };
        const result = await ctx.httpPost(app.config.GetServerParam, JSON.stringify(params));
        if (result.msg === 'OK') {
            this.logger.info('get system config result : ', result);
            const data = result.config.List;
            this.logger.info('get system config data : ', data);
            return data;
        }
        return null;
    }
    async setSystemConfig() {
        const { ctx, app } = this;
        const body = ctx.request.body;
        const sendData = {
            List: [],
        };
        for (let key in body.data) {
            const obj = {};
            obj.Name = key;
            if (key === 'AutoPayout') {
                body.data[key] = ctx.changeServerRatio(body.data[key]).toString();
            }
            obj.Value = body.data[key];
            sendData.List.push(obj);
        }
        console.log('sendData----------', sendData);
        const result = await ctx.httpPost(app.config.SetServerParam, JSON.stringify(sendData));
        this.logger.info('set system config result : ', result);
        if (result.code === 200) {
            return result;
        }
        return null;
    }
}

module.exports = GamePlayerService;
