'use strict';
const Subscription = require('egg').Subscription;

class TaskUserLoseGold extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '5s',
            cron: '0 17 0 * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        this.taskTest();
    }

    async taskTest() {
        const { ctx } = this;
        const packages = await ctx.service.channelPackage.getApkIds();
        if (packages.length === 0) {
            this.logger.info('task test packages length = 0');
            return;
        }
        this.logger.info('packages: ', JSON.stringify(packages));

        const sta_day = ctx.getDateByAdd(-1);// 统计的日期
        const ranges = [ -3, -7 ];
        let days = [];
        for (let i = 0; i < ranges.length; i++) {
            days.push(ctx.getDateByCustomAndAdd(sta_day, ranges[i]));
        }
        this.logger.info('days : ', JSON.stringify(days));
        // 查找所有ApkId
        for (let i = 0; i < packages.length; i++) {
            const apkId = packages[i].apk_id;
            for (let j = 0; j < days.length; j++) {
                const loginTime = days[j];
                const data = await this.queryUserLoseGoldData(loginTime, apkId);
                data.date = loginTime;
                data.apk_id = apkId;
                data.lose_type = j;
                const query = {
                    where: { date: loginTime, apk_id: apkId },
                };
                const result = await ctx.mysqlByLocal(ctx.MysqlType.Select, 'user_lose_gold', query);
                if (result.length === 0) {
                    await ctx.mysqlByLocal(ctx.MysqlType.Insert, 'user_lose_gold', data);
                }
            }
        }
    }

    async queryUserLoseGoldData(loginTime, apkId) {
        const { ctx } = this;
        const values = [ 10000, 20000, 30000, 50000, 100000, 200000, 500000, 1000000, 1000000 ];
        const data = {};
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const sonSql = 'SELECT DeviceId, (Gold + WinGold + PayWinGold + PayGold) as Maney from User WHERE date(LoginTime) = ? and ApkId = ?';
            const selectSql = `SELECT count(distinct(DeviceId)) as count from (${sonSql}) T `;
            let whereSql = 'WHERE Maney > ? and Maney <= ?';

            let params = [ loginTime, apkId, values[i - 1], values[i] ];

            if (i === 0) {
                whereSql = 'WHERE Maney <= ?';
                params = [ loginTime, apkId, values[i] ];
            }
            if (i === values.length - 1) {
                whereSql = 'WHERE Maney >= ?';
                params = [ loginTime, apkId, values[i] ];
            }
            const sql = `${selectSql}${whereSql}`;
            const result = await ctx.mysqlQueryByGame(sql, params);
            if (i === values.length - 1) {
                data['gt' + value / 10000] = result[0].count;
            } else {
                data['lt' + value / 10000] = result[0].count;
            }
        }
        return data;
    }

}
module.exports = TaskUserLoseGold;
