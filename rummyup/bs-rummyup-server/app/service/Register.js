'use strict';

const Service = require('egg').Service;

const registerPassword1 = '034de8252ffa3a0582f68bdc777892e9';
const registerPassword2 = '687e2ca06b25c597aad0f89dc3814231';
const registerPassword3 = '40fd3ea49b36101189f1503adac0648d';
const registerPassword4 = '9e31d5a596c013cf50d58da7f4b03a69';
const registerPassword5 = 'c6738e922f1c57caa5016a065f90ecec';

class RegisterService extends Service {

    async userRegister(username, password, confirm, register) {
        const { ctx } = this;
        const user = await ctx.mysqlByLocal(ctx.MysqlType.Select, 'user', { where: { UserName: username } });
        const uname = username;
        const pwd = ctx.genMD5(password);
        const cwd = ctx.genMD5(confirm);
        const rpwd = register;
        const registerPWIsReal = await this.checkRegisterPassword(ctx.genMD5(rpwd));
        const userId = ctx.randomInt().toString();
        if (registerPWIsReal > 0) {
            if (pwd === cwd) {
                if (!user[0]) {
                    const query = {
                        UserId: userId,
                        Level: registerPWIsReal,
                        UserName: uname,
                        Password: pwd,
                        LastLoginTime: ctx.getTimeSymbol(),
                    };
                    const result = await ctx.mysqlByLocal(ctx.MysqlType.Insert, 'user', query);
                    if (result.affectedRows === 1) {
                        return 'ok';
                    }
                } else {
                    return '该用户已注册!';
                }
            } else {
                return '两次输入的密码不一致!';
            }
        } else {
            return '注册密码错误!';
        }
    }

    async checkRegisterPassword(registerPassword) {
        if (registerPassword === registerPassword1) {
            return 1;
        } else if (registerPassword === registerPassword2) {
            return 2;
        } else if (registerPassword === registerPassword3) {
            return 3;
        } else if (registerPassword === registerPassword4) {
            return 4;
        } else if (registerPassword === registerPassword5) {
            return 5;
        }
        return 0;
    }
}

module.exports = RegisterService;
