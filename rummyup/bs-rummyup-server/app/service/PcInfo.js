'use strict';
const Service = require('egg').Service;

class PCInfoService extends Service {
    async getPCInfo() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const date = reqBody.querydate;
        const sql = `select data from ${app.config.TableName.Online_Recharge_Charts} where createdate = ? and datatype = ?`;
        const freeMemResult = await ctx.mysqlQueryByLocal(sql, [ date, app.config.ORCJsonType.FreeMem ]);
        const memUsageResult = await ctx.mysqlQueryByLocal(sql, [ date, app.config.ORCJsonType.MemUsage ]);
        const cpuUsageResult = await ctx.mysqlQueryByLocal(sql, [ date, app.config.ORCJsonType.CpuUsage ]);

        let data = [[], [], []];
        if (freeMemResult.length > 0) {
            data[0] = JSON.parse(freeMemResult[0].data);
        }
        if (memUsageResult.length > 0) {
            data[1] = JSON.parse(memUsageResult[0].data);
        }
        if (cpuUsageResult.length > 0) {
            data[2] = JSON.parse(cpuUsageResult[0].data);
        }
        return data;
    }
}

module.exports = PCInfoService;
