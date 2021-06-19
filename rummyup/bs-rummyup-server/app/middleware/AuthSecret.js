'use strict';
const basemd5 = '072eaebf67e2866803d83eef06e7c4b4';

async function authsecret(ctx, next) {
    try {
        if (ctx.request.method === 'GET') {
            const params = ctx.query;
            const serverSecret = ctx.genMD5(`${params.sectime}${basemd5}`);
            if (params.secret !== serverSecret) {
                ctx.body = { code: 500, msg: 'error: auth secret fail' };
                return;
            }
        } else if (ctx.request.method === 'POST') {
            // 验证post时, 有数组和字典两种参数, 数组无法传递secret, 所以暂时不验证, 使用token来验证
            const body = ctx.request.body;
            const serverSecret = ctx.genMD5(`${body.sectime}${basemd5}`);
            if (body.secret !== serverSecret) {
                ctx.body = { code: 500, msg: 'error: auth secret fail' };
                return;
            }
        } else {
            ctx.body = { code: 500, msg: "error: don't know request" };
            return;
        }
        await next();
    } catch (err) {
        // 记录处理失败日志
        ctx.logger.error(`request error, err:${err}`);
    }
}
module.exports = () => {
    return authsecret;
};
