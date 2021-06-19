'use strict';
const Subscription = require('egg').Subscription;
const osUtils = require('os-utils');


class TaskPCInfo extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '5s',
            cron: '0 */15 * * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        this.getInfo();
    }

    async getInfo() {
        const { ctx, app } = this;

        const freememPercentage = (1 - osUtils.freememPercentage()) * 100;
        const freemem = osUtils.freemem() / 1024;

        this.logger.info(`内存占用率 : ${freememPercentage.toFixed(2)}%`);
        this.logger.info(`CPU占用率 : ${app.config.CpuUsage}%`);
        this.logger.info(`空闲内存 : ${freemem.toFixed(2)}G`);
        const today = ctx.getTodaySymbol();
        this.logger.info(`today : ${today}`);
        const sql = `select data from ${app.config.TableName.Online_Recharge_Charts} where createdate = ? and datatype = ?`;
        const freeMemResult = await ctx.mysqlQueryByLocal(sql, [ today, app.config.ORCJsonType.FreeMem ]);
        const memUsageResult = await ctx.mysqlQueryByLocal(sql, [ today, app.config.ORCJsonType.MemUsage ]);
        const cpuUsageResult = await ctx.mysqlQueryByLocal(sql, [ today, app.config.ORCJsonType.CpuUsage ]);

        let freeMemData = []; // 空闲内存
        let memUsageData = []; // 内存占用率
        let cpuUsageData = []; // CPU占用率
        if (freeMemResult.length !== 0) {
            freeMemData = JSON.parse(freeMemResult[0].data);
            memUsageData = JSON.parse(memUsageResult[0].data);
            cpuUsageData = JSON.parse(cpuUsageResult[0].data);
        } else {
            for (let j = 0; j < 24 * (60 / app.config.PCInfoInterval); j++) {
                freeMemData.push(0);
                memUsageData.push(0);
                cpuUsageData.push(0);
            }
        }
        const curHoursMin = ctx.getHoursAndMin(app.config.PCInfoInterval);
        this.logger.info(`hours min index : ${curHoursMin}`);
        freeMemData[curHoursMin] = Number.parseFloat(freemem.toFixed(2));
        memUsageData[curHoursMin] = Number.parseFloat(freememPercentage.toFixed(2));
        cpuUsageData[curHoursMin] = Number.parseFloat(app.config.CpuUsage);
        this.logger.info(`data : ${JSON.stringify(cpuUsageData)}`);
        const insertSql = `replace into ${app.config.TableName.Online_Recharge_Charts} (createdate, data, datatype) values (?, ?, ?)`;
        await ctx.mysqlQueryByLocal(insertSql, [ today, JSON.stringify(freeMemData), app.config.ORCJsonType.FreeMem ]);
        await ctx.mysqlQueryByLocal(insertSql, [ today, JSON.stringify(memUsageData), app.config.ORCJsonType.MemUsage ]);
        await ctx.mysqlQueryByLocal(insertSql, [ today, JSON.stringify(cpuUsageData), app.config.ORCJsonType.CpuUsage ]);
        app.config.CpuUsage = 0;
    }
}
module.exports = TaskPCInfo;
