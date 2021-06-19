'use strict';

const Service = require('egg').Service;
const CreateToken = require('../utils/UserToken');

class LoginService extends Service {

    async userLogin(username, pwd) {

        const { ctx, app } = this;

        const user = await ctx.mysqlByLocal(ctx.MysqlType.Select, 'user', { where: { UserName: username } });

        if (!user[0]) {
            ctx.throw('无效用户');
        }

        const data = user[0];
        const password = data.Password;
        const pw = ctx.genMD5(pwd);

        if (!pwd || password !== pw) {
            ctx.throw('密码错误');
        }

        const token = CreateToken.createTokenUser(app, data);
        const result = {
            token,
            user: {
                userName: data.UserName,
                userId: data.UserId,
                level: data.Level,
            },
        };
        return result;
    }
}

module.exports = LoginService;
