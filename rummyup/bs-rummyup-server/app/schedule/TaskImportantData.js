'use strict';
const Subscription = require('egg').Subscription;

class TaskImportantData extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '0 30 2 * * *',
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
        const query = {
            where: { date: sta_day },
        };
        const result = await ctx.mysqlByLocal(ctx.MysqlType.Select, 'important_data', query);
        if (result.length < 1) {
            const data = await this.getImportantData(sta_day);
            await ctx.mysqlByLocal(ctx.MysqlType.Insert, 'important_data', data);
        }
    }

    async getImportantData(date) {
        const { ctx } = this;
        const db_user = 'User';
        const data = {};
        data.date = date;
        const gameConfig = await ctx.service.definition.getGamePlayer();
        const payInData = gameConfig.find(item => {
            return item.Name === 'PayIn';
        });
        const payInType = Number(payInData.Value) * 10000;

        // 总活跃 FB活跃 手机活跃 游客活跃 付费用户活跃 活跃用户金币库存 可cashout金币库存
        const activeSql = `select 
            count(*) as total,
            count(if(FbId!='',true,null) and if(Phone='',true,null)) as fb_total,
            count(if(Phone!='',true,null)) as ph_total,
            count(if(FbId='',true,null) and if(Phone='',true,null)) as to_total,
            count(if(TotalPayIn>${payInType},true,null)) as pay_active,
            sum(PayGold / 10000 + Gold / 10000 + WinGold / 10000 + PayWinGold / 10000) as total_gold,
            sum(WinGold / 10000 + PayWinGold / 10000) as cash_out
            from ${db_user} 
            where date(LoginTime) = ?`;
        const activeResult = await ctx.mysqlQueryByGame(activeSql, [ date ]);
        data.total_active = activeResult[0].total;
        data.fb_active = activeResult[0].fb_total;
        data.ph_active = activeResult[0].ph_total;
        data.to_active = activeResult[0].to_total;
        data.pay_active = activeResult[0].pay_active;
        data.gold_active = activeResult[0].total_gold;
        data.gold_cashout = activeResult[0].cash_out;
        const gameOnlineSql = 'select onlineMax, onlineGameMax from online_max_day where date = ?';
        const gameOnlineData = await ctx.mysqlQueryByLocal(gameOnlineSql, [ date ]);

        // 平均游戏人数  最高游戏人数
        data.room_max = gameOnlineData[0].onlineGameMax;
        data.room_average = (data.room_max / 24).toFixed(2);

        // 平均在线人数  最高在线人数
        data.online_max = gameOnlineData[0].onlineMax;
        data.online_average = (data.online_max / 24).toFixed(2);

        // 提现金额  提现人数
        const dbName = 'recharge_data';
        const witddrawSql = `select 
            round(sum(witddraw_count), 2) as witddraw_count,
            sum(withdraw_users) as withdraw_users
            from ${dbName}
            where date(date) = ?`;
        let witddrawData = await ctx.mysqlQueryByLocal(witddrawSql, [ date ]);
        data.witddraw_count = witddrawData[0] ? witddrawData[0].witddraw_count : 0;
        data.withdraw_users = witddrawData[0] ? witddrawData[0].withdraw_users : 0;
        // 每日总免费发放金币 机器人赢取充值金币总额 机器人赢取赠送金币总额 机器人输给玩家总额
        const goldSql = 'select PlayerGive, RbWinGive, RbWinPay, RbLoseGold from GoldStat where date(Date) = ?';
        const goldData = await ctx.mysqlQueryByGame(goldSql, [ date ]);
        data.gold_free = goldData[0] ? goldData[0].PlayerGive : 0;
        data.robot_win_recharge = goldData[0] ? goldData[0].RbWinPay : 0;
        data.robot_win_give = goldData[0] ? goldData[0].RbWinGive : 0;
        data.robot_lose = goldData[0] ? goldData[0].RbLoseGold : 0;
        // 每日总充值
        const amountDB = 'OrderRecord';
        const testname = 'jiadaye';
        const amount_sql = `select ifnull(sum(Amount), 0) as amount from ${amountDB} where date(CreateTime) = ? and OrderStatus = 1 and FirstName != ?`;
        const amount_result = await ctx.mysqlQueryByGame(amount_sql, [ date, testname ]);
        data.recharge_total = amount_result[0].amount;
        return data;
    }

}
module.exports = TaskImportantData;
