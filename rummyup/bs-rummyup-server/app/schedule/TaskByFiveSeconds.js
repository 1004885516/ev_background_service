'use strict';
const Subscription = require('egg').Subscription;
const osUtils = require('os-utils');

class Task5s extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '5s', // 5 秒钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        await this.queryOnlineUser();
        this.getCPUInfo();
    }

    getCPUInfo() {
        const { app } = this;
        osUtils.cpuUsage(function(value) {
            const curUsage = (value * 100.0).toFixed(2);
            app.config.CpuUsage = curUsage > app.config.CpuUsage ? curUsage : app.config.CpuUsage;
        });
        console.log('app.config.CpuUsage : ', app.config.CpuUsage);
    }

    async queryOnlineUser() {
        const { ctx, app } = this;
        // 查询当前在线人数
        const result = await ctx.httpGet(app.config.OnlineUrl);
        const Online = result.Online;
        const GameOnline = result.GameUser;
        const sql = 'SELECT amount FROM global_data WHERE data_name = ?';
        const onlineMaxData = await ctx.mysqlQueryByLocal(sql, [ 'online_max' ]);
        const onlineMax = onlineMaxData[0] && onlineMaxData[0].amount ? onlineMaxData[0].amount : 0;
        // 如果当前在线人数大于历史在线人数，更新历史最高在线人数
        if (Online > onlineMax) {
            const sql = 'UPDATE global_data SET amount = ? WHERE data_name = ?';
            await ctx.mysqlQueryByLocal(sql, [ Online, 'online_max' ]);
        }

        // 记录每天最高在线
        const date = ctx.getTodaySymbol();

        const daySql = 'SELECT onlineMax FROM online_max_day WHERE date = ?';

        const dayOnlineMaxData = await ctx.mysqlQueryByLocal(daySql, [ date ]);

        if (dayOnlineMaxData.length < 1) {

            const insertSql = 'INSERT INTO online_max_day (date, onlineMax, onlineGameMax) VALUES (?,?,?)';
            await ctx.mysqlQueryByLocal(insertSql, [ date, Online, GameOnline ]);

        } else {

            const dayOnlineMax = dayOnlineMaxData[0].onlineMax ? dayOnlineMaxData[0].onlineMax : 0;

            if (Online > dayOnlineMax) {

                const insertSql = 'UPDATE online_max_day SET onlineMax = ? WHERE date = ?';
                await ctx.mysqlQueryByLocal(insertSql, [ Online, date ]);

            }

            const onlineGameMax = dayOnlineMaxData[0].onlineGameMax ? dayOnlineMaxData[0].onlineGameMax : 0;
            if (GameOnline > onlineGameMax) {
                const insertSql = 'UPDATE online_max_day SET onlineGameMax = ? WHERE date = ?';
                await ctx.mysqlQueryByLocal(insertSql, [ GameOnline, date ]);
            }
        }
    }
}
module.exports = Task5s;
