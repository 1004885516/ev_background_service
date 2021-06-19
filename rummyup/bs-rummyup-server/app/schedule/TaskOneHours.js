'use strict';
const Subscription = require('egg').Subscription;
const rechargetable = 'OrderRecord';
const testname = 'jiadaye';

class TaskOneHours extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '5s',
            cron: '0 0 */1 * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        this.statisticsOnline();
        this.statisticsRecharge();
    }

    async statisticsOnline() {
        const { ctx, app } = this;
        const datelist = ctx.getLastHoursByInt();
        const hours = datelist.hours;
        const date = datelist.date;
        const sql = `select data from ${app.config.TableName.Online_Recharge_Charts} where createdate = ? and datatype = ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ `${date}`, app.config.ORCJsonType.Online ]);
        let data = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        if (result.length !== 0) {
            data = JSON.parse(result[0].data);
        }
        const online = await this.getOnline();
        data[hours] = online;
        this.logger.info('data : ', data);
        const insertSql = `replace into ${app.config.TableName.Online_Recharge_Charts} (createdate, data, datatype) values (?, ?, ?)`;
        await ctx.mysqlQueryByLocal(insertSql, [ date, JSON.stringify(data), app.config.ORCJsonType.Online ]);
    }

    async statisticsRecharge() {
        const { ctx, app } = this;
        // const testtime = '2021-03-08 01:00:00';
        // const datelist = ctx.getLastHoursByIntTest(testtime);
        const datelist = ctx.getLastHoursByInt();
        const hours = datelist.hours;
        const date = datelist.date;

        // const lasthours = ctx.getLastHoursTest(testtime);
        // const currenthours = ctx.getCurrentHoursTest(testtime);
        const lasthours = ctx.getLastHours();
        const currenthours = ctx.getCurrentHours();

        const sql = `select data from ${app.config.TableName.Online_Recharge_Charts} where createdate = ? and datatype = ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ date, app.config.ORCJsonType.Recharge ]);
        let data = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        ];
        if (result.length !== 0) {
            data = JSON.parse(result[0].data);
        }

        // 充值人数 充值订单数 充值金额
        const selectSql = 'ifnull(count(distinct UserId), 0) as recharge_users, ifnull(count(Txnid), 0) as order_total, ifnull(sum(Amount), 0) as recharge_amount';
        const recharge_sql = `select ${selectSql} from ${rechargetable} where CreateTime >= ? and CreateTime < ? and OrderStatus = 1 and FirstName != ?`;
        const curdata = await ctx.mysqlQueryByGame(recharge_sql, [ lasthours, currenthours, testname ]);
        data[app.config.RechargeDataType.Users][hours] = curdata[0].recharge_users;
        data[app.config.RechargeDataType.Orders][hours] = curdata[0].order_total;
        data[app.config.RechargeDataType.Amount][hours] = curdata[0].recharge_amount;

        const insertSql = `replace into ${app.config.TableName.Online_Recharge_Charts} (createdate, data, datatype) values (?, ?, ?)`;
        await ctx.mysqlQueryByLocal(insertSql, [ date, JSON.stringify(data), app.config.ORCJsonType.Recharge ]);
    }

    async getOnline() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.OnlineUrl);
        return result.Online;
    }
}
module.exports = TaskOneHours;
