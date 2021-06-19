'use strict';

async function log(ctx, next) {
    try {
        if (ctx.request.method === 'GET') {
            ctx.logger.info(`------------> method: ${ctx.request.method}, url: ${ctx.request.url}`);
        } else if (ctx.request.method === 'POST') {
            ctx.logger.info(`------------> method: ${ctx.request.method}, url: ${ctx.request.url}, requestBody: ${JSON.stringify(ctx.request.body)}`);
        } else {
            ctx.logger.info(`************> don't know request, method: ${ctx.request.method}, url: ${ctx.request.url}`);
            ctx.body = { code: 500, msg: 'error' };
            return;
        }
        await next();
        // 记录处理成功日志
        ctx.logger.info(`<============ method: ${ctx.request.method}, url: ${ctx.request.url}, body: ${JSON.stringify(ctx.body)}`);
    } catch (err) {
        // 记录处理失败日志
        ctx.logger.error(`request error, err:${err}`);
    }
}
module.exports = () => {
  return log;
};
