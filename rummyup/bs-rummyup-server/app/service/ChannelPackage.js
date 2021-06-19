'use strict';

const Service = require('egg').Service;
const tablename = 'channel_package';

class ChannelPackageService extends Service {

    async getData() {
        const { ctx } = this;
        return await ctx.mysqlByLocal(ctx.MysqlType.Select, tablename);
    }

    async getApkIds() {
        const { ctx } = this;
        const sql = `select distinct(apk_id) from ${tablename}`;
        return await ctx.mysqlQueryByLocal(sql);
    }

    async setData(reqBody) {
        const { ctx, app } = this;
        const mysql = ctx.getLocalMysql();
        const result = await mysql.beginTransactionScope(async conn => {
            await conn.delete(tablename);
            await conn.insert(tablename, reqBody);
            return { success: true };
        }, ctx);
        if (result.success) {
            if (app.config.isSyncOld) {
                const oldmysql = ctx.getOldLocalMysql();
                await oldmysql.beginTransactionScope(async conn => {
                    await conn.delete(tablename);
                    await conn.insert(tablename, reqBody);
                    return { success: true };
                }, ctx);
            }
            return app.config.SUCCESS;
        }
        return app.config.FAIL;
    }
}

module.exports = ChannelPackageService;
