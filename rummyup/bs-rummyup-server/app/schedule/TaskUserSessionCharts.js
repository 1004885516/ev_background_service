'use strict';
const Subscription = require('egg').Subscription;

class TaskUserGoldCharts extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '0 35 0 * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        await this.taskSession();
    }

    async taskSession() {
        const { ctx, app } = this;
        const sta_day = ctx.getDateByAdd(-1);
        const usertable = app.config.TableName.User_Game;
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(sta_day)}`;
        const packages = await ctx.service.channelPackage.getApkIds();
        const gameTypes = [ 'TeenPatti', 'QuickTP', 'Ak47', 'Rummy', 'Rummy2User', 'LowJoker', 'HighJoker' ];
        for (let i = 0; i < packages.length; i++) {
            const apkId = packages[i].apk_id;
            for (let k = 0; k < gameTypes.length; k++) {
                const gameType = gameTypes[k];
                const saveType = app.config.ChartsType.TeenPattiSession + k;
                let sql = `(select count(${sessiontable}.UserId) as total
                    from ${sessiontable} join ${usertable} on ${sessiontable}.UserId = ${usertable}.UserId
                    where date(${sessiontable}.CreateTime) = ? and ${usertable}.ApkId = ? and GameName = ? and RoomLevel <> ?
                    group by ${sessiontable}.UserId) as result`;
                let sql1 = `select
                    ifnull(sum(case when total = 0 then 1 else 0 end), 0) as a0,
                    ifnull(sum(case when total >= 1 and total <= 5 then 1 else 0 end), 0) as a1,
                    ifnull(sum(case when total >= 6 and total <= 10 then 1 else 0 end), 0) as a2,
                    ifnull(sum(case when total >= 11 and total <= 20 then 1 else 0 end), 0) as a3,
                    ifnull(sum(case when total >= 21 and total <= 30 then 1 else 0 end), 0) as a4,
                    ifnull(sum(case when total >= 31 and total <= 40 then 1 else 0 end), 0) as a5,
                    ifnull(sum(case when total >= 41 and total <= 50 then 1 else 0 end), 0) as a6,
                    ifnull(sum(case when total >= 51 and total <= 60 then 1 else 0 end), 0) as a7,
                    ifnull(sum(case when total >= 61 and total <= 70 then 1 else 0 end), 0) as a8,
                    ifnull(sum(case when total >= 71 and total <= 80 then 1 else 0 end), 0) as a9,
                    ifnull(sum(case when total >= 81 and total <= 90 then 1 else 0 end), 0) as a10,
                    ifnull(sum(case when total >= 91 and total <= 100 then 1 else 0 end), 0) as a11,
                    ifnull(sum(case when total >= 101 and total <= 120 then 1 else 0 end), 0) as a12,
                    ifnull(sum(case when total >= 121 and total <= 150 then 1 else 0 end), 0) as a13,
                    ifnull(sum(case when total >= 151 and total <= 200 then 1 else 0 end), 0) as a14,
                    ifnull(sum(case when total >= 201 and total <= 300 then 1 else 0 end), 0) as a15,
                    ifnull(sum(case when total >= 301 then 1 else 0 end), 0) as a16
                    from ${sql}`;
                const result = await ctx.mysqlQueryByGame(sql1, [ sta_day, apkId, gameType, 'PracticeArena' ]);
                let isSave = false;
                const data = result[0];
                if (data) {
                    for (const key in data) {
                        if (Object.hasOwnProperty.call(data, key)) {
                            const value = data[key];
                            if (value > 0) {
                                isSave = true;
                                break;
                            }
                        }
                    }
                    if (isSave) {
                        const save_sql = `insert into ${app.config.TableName.User_Gold_Charts} (createdate, data, datatype, apkid) values (?, ?, ?, ?)`;
                        await ctx.mysqlQueryByLocal(save_sql, [ sta_day, JSON.stringify(result[0]), saveType, apkId ]);
                    }
                }
            }
        }
    }
}
module.exports = TaskUserGoldCharts;
