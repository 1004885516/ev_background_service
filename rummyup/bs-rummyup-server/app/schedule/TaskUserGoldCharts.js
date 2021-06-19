'use strict';
const Subscription = require('egg').Subscription;

class TaskUserGoldCharts extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '0 10 0 * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        this.taskTotalGoldCharts();
        this.taskRobotGoldCharts();
    }

    async taskTotalGoldCharts() {
        const { ctx, app } = this;
        const usertable = app.config.TableName.User_Game;
        const loginlog = app.config.TableName.Login_log;
        const usergold = '(WinGold + Gold) / 10000)';
        const packages = await ctx.service.channelPackage.getApkIds();
        const sta_day = ctx.getDateByAdd(-1);// 统计的日期
        for (let i = 0; i < packages.length; i++) {
            const apkId = packages[i].apk_id;
            //  count(${usertable}.UserId) as t,
            const sql = `select
                            ifnull(sum(case when (${usergold} <= 1 then 1 else 0 end), 0) as t1,
                            ifnull(sum(case when (${usergold} > 1 and (${usergold} <= 2 then 1 else 0 end), 0) as t2,
                            ifnull(sum(case when (${usergold} > 2 and (${usergold} <= 4 then 1 else 0 end), 0) as t4,
                            ifnull(sum(case when (${usergold} > 4 and (${usergold} <= 5 then 1 else 0 end), 0) as t5,
                            ifnull(sum(case when (${usergold} > 5 and (${usergold} <= 8 then 1 else 0 end), 0) as t8,
                            ifnull(sum(case when (${usergold} > 8 and (${usergold} <= 10 then 1 else 0 end), 0) as t10,
                            ifnull(sum(case when (${usergold} > 10 and (${usergold} <= 40 then 1 else 0 end), 0) as t40,
                            ifnull(sum(case when (${usergold} > 40 and (${usergold} <= 50 then 1 else 0 end), 0) as t50,
                            ifnull(sum(case when (${usergold} > 50 and (${usergold} <= 80 then 1 else 0 end), 0) as t80,
                            ifnull(sum(case when (${usergold} > 80 and (${usergold} <= 100 then 1 else 0 end), 0) as t100,
                            ifnull(sum(case when (${usergold} > 100 and (${usergold} <= 200 then 1 else 0 end), 0) as t200,
                            ifnull(sum(case when (${usergold} > 200 and (${usergold} <= 400 then 1 else 0 end), 0) as t400,
                            ifnull(sum(case when (${usergold} > 400 and (${usergold} <= 500 then 1 else 0 end), 0) as t500,
                            ifnull(sum(case when (${usergold} > 500 and (${usergold} <= 800 then 1 else 0 end), 0) as t800,
                            ifnull(sum(case when (${usergold} > 1000 then 1 else 0 end), 0) as t1000
            from ${usertable} join ${loginlog} on ${loginlog}.UserId = ${usertable}.UserId where DATE(${loginlog}.Login_day) = ? and ApkId = ?`;
            const result = await ctx.mysqlQueryByGame(sql, [ sta_day, apkId ]);
            this.logger.info(`date: ${sta_day}, apkId: ${apkId}, data: ${JSON.stringify(result)}`);

            const save_sql = `insert into ${app.config.TableName.User_Gold_Charts} (createdate, data, datatype, apkid) values (?, ?, ?, ?)`;
            await ctx.mysqlQueryByLocal(save_sql, [ sta_day, JSON.stringify(result[0]), app.config.ChartsType.TotalGold, apkId ]);
        }
    }

    async taskRobotGoldCharts() {
        const { ctx, app } = this;
        const usertable = app.config.TableName.User_Game;
        const loginlog = app.config.TableName.Login_log;
        const usergold = '(RobotGold / 10000)';
        const packages = await ctx.service.channelPackage.getApkIds();
        const sta_day = ctx.getDateByAdd(-1);
        for (let i = 0; i < packages.length; i++) {
            const apkId = packages[i].apk_id;
            //  count(${usertable}.UserId) as t,
            const sql = `select
                            ifnull(sum(case when ${usergold} <= -1000 then 1 else 0 end), 0) as t1,
                            ifnull(sum(case when ${usergold} > -1000 and ${usergold} <= -500 then 1 else 0 end), 0) as t2,
                            ifnull(sum(case when ${usergold} > -500 and ${usergold} <= -300 then 1 else 0 end), 0) as t3,
                            ifnull(sum(case when ${usergold} > -300 and ${usergold} <= -150 then 1 else 0 end), 0) as t4,
                            ifnull(sum(case when ${usergold} > -150 and ${usergold} <= -100 then 1 else 0 end), 0) as t5,
                            ifnull(sum(case when ${usergold} > -100 and ${usergold} <= -80 then 1 else 0 end), 0) as t6,
                            ifnull(sum(case when ${usergold} > -80 and ${usergold} <= -60 then 1 else 0 end), 0) as t7,
                            ifnull(sum(case when ${usergold} > -60 and ${usergold} <= -50 then 1 else 0 end), 0) as t8,
                            ifnull(sum(case when ${usergold} > -50 and ${usergold} <= -40 then 1 else 0 end), 0) as t9,
                            ifnull(sum(case when ${usergold} > -40 and ${usergold} <= -30 then 1 else 0 end), 0) as t10,
                            ifnull(sum(case when ${usergold} > -30 and ${usergold} <= -20 then 1 else 0 end), 0) as t11,
                            ifnull(sum(case when ${usergold} > -20 and ${usergold} <= -10 then 1 else 0 end), 0) as t12,
                            ifnull(sum(case when ${usergold} > -10 and ${usergold} <= 0 then 1 else 0 end), 0) as t13,
                            ifnull(sum(case when ${usergold} > 0 and ${usergold} <= 10 then 1 else 0 end), 0) as t14,
                            ifnull(sum(case when ${usergold} > 10 and ${usergold} <= 20 then 1 else 0 end), 0) as t15,
                            ifnull(sum(case when ${usergold} > 20 and ${usergold} <= 30 then 1 else 0 end), 0) as t16,
                            ifnull(sum(case when ${usergold} > 30 and ${usergold} <= 40 then 1 else 0 end), 0) as t17,
                            ifnull(sum(case when ${usergold} > 40 and ${usergold} <= 50 then 1 else 0 end), 0) as t18,
                            ifnull(sum(case when ${usergold} > 50 and ${usergold} <= 60 then 1 else 0 end), 0) as t19,
                            ifnull(sum(case when ${usergold} > 60 and ${usergold} <= 80 then 1 else 0 end), 0) as t20,
                            ifnull(sum(case when ${usergold} > 80 and ${usergold} <= 10 then 1 else 0 end), 0) as t21,
                            ifnull(sum(case when ${usergold} > 100 and ${usergold} <= 200 then 1 else 0 end), 0) as t22,
                            ifnull(sum(case when ${usergold} > 200 then 1 else 0 end), 0) as t23
            from ${usertable} join ${loginlog} on ${loginlog}.UserId = ${usertable}.UserId where DATE(${loginlog}.Login_day) = ? and ApkId = ?`;
            const result = await ctx.mysqlQueryByGame(sql, [ sta_day, apkId ]);
            this.logger.info(`date: ${sta_day}, apkId: ${apkId}, data: ${JSON.stringify(result)}`);

            const save_sql = `insert into ${app.config.TableName.User_Gold_Charts} (createdate, data, datatype, apkid) values (?, ?, ?, ?)`;
            await ctx.mysqlQueryByLocal(save_sql, [ sta_day, JSON.stringify(result[0]), app.config.ChartsType.RobotGold, apkId ]);
        }
    }
}
module.exports = TaskUserGoldCharts;
