'use strict';
const Subscription = require('egg').Subscription;

const amount = [ 20, 50, 100, 200, 500, 1000, 2000, 5000 ];
const orderDB = 'OrderRecord';
const rechargeStatisticsDB = 'recharge_statistics';
const testname = 'jiadaye';

class TaskRechargeStatisticsData extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '0 45 2 * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        this.taskTest1();
    }

    async taskTest1() {
        const { ctx } = this;
        const sta_day = ctx.getDateByAdd(-1);
        // const values_params = [ sta_day, 0 ];
        const rCount = [ sta_day, 0 ]; // 充值次数
        const uCount = [ sta_day, 1 ]; // 充值人数
        const rTotal = [ sta_day, 2 ]; // 充值总金额
        for (let i = 0; i < amount.length; i++) {
            const item = amount[i];
            const sql = `select 
                count(*) as rCount,
                count(distinct UserId) as uCount,
                IFNULL(SUM(Amount),0) as rTotal
                from ${orderDB} where Date(CreateTime) = ? and Amount = ? and FirstName != ? and OrderStatus = 1`;
            const params = [ sta_day, item, testname ];
            const result = await ctx.mysqlQueryByGame(sql, params);
            rCount.push(result[0].rCount);
            uCount.push(result[0].uCount);
            rTotal.push(result[0].rTotal);
        }
        for (let i = 0; i < 3; i++) {
            const sql = `REPLACE INTO ${rechargeStatisticsDB} (date, type, amount20, amount50, amount100, amount200, amount500, amount1000, amount2000, amount5000) VALUES (?,?,?,?,?,?,?,?,?,?)`;
            let values_params = [];
            if (i === 0) {
                values_params = rCount;
            } else if (i === 1) {
                values_params = uCount;
            } else {
                values_params = rTotal;
            }
            await ctx.mysqlQueryByLocal(sql, values_params);
        }
    }
}
module.exports = TaskRechargeStatisticsData;
