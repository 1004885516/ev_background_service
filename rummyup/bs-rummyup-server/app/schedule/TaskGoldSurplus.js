'use strict';
const Subscription = require('egg').Subscription;

class TaskGoldSurplusData extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '1 0 0 * * *',
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
        const sta_day = ctx.getDateByAdd(-1);// 统计的日期
        const end_day = ctx.getDateByCustomAndAdd(sta_day, -1);
        const payIn = await this.getPayType(ctx);
        const query = {
            where: { date: sta_day },
        };
        const result = await ctx.mysqlByLocal(ctx.MysqlType.Select, 'gold_surplus', query);
        if (result.length < 1) {
            for (let i = 0; i < 2; i++) {
                const data = await this.getGoldSurplusData(sta_day, end_day, payIn, i);
                await ctx.mysqlByLocal(ctx.MysqlType.Insert, 'gold_surplus', data);
            }
        }
    }

    async getGoldSurplusData(sta_day, end_day, payIn, type) {
        const { ctx } = this;
        const db_user = 'User';
        let sql = `select 
            sum(PayGold / 10000) as pay_gold,
            sum(Gold / 10000) as gold,
            sum(WinGold / 10000) as win_gold,
            sum(PayWinGold / 10000) as win_pay_gold,
            sum(PayGold / 10000 + Gold / 10000) as total_gold,
            sum(WinGold / 10000 + PayWinGold / 10000) as total_win_gold,
            sum(PayGold / 10000 + Gold / 10000 + WinGold / 10000 + PayWinGold / 10000) as tatal_surplus
            from ${db_user} 
            where date(LoginTime) >= ? and date(LoginTime) <= ?`;
        const params = [ end_day, sta_day, payIn ];
        if (type === 0) {
            sql += ' and TotalPayIn >= ?';
        } else {
            sql += ' and TotalPayIn < ?';
        }
        const result = await ctx.mysqlQueryByGame(sql, params);
        const data = {
            date: sta_day,
            type,
            pay_gold: result[0].pay_gold,
            gold: result[0].gold,
            win_gold: result[0].win_gold,
            win_pay_gold: result[0].win_pay_gold,
            total_gold: result[0].total_gold,
            total_win_gold: result[0].total_win_gold,
            tatal_surplus: result[0].tatal_surplus,
        };
        return data;
    }
    async getPayType(ctx) {
        const gameConfig = await ctx.service.definition.getGamePlayer();
        const payInData = gameConfig.find(item => {
            return item.Name === 'PayIn';
        });
        const payInType = Number(payInData.Value) * 10000;
        return payInType;
    }

}
module.exports = TaskGoldSurplusData;
