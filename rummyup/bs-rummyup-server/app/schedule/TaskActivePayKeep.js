'use strict';
const Subscription = require('egg').Subscription;

const usertable = 'User';
const logintable = 'Login_log';

class TaskActivePayKeep extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '0 40 0 * * *',
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
        const { ctx, app } = this;
        const packages = await ctx.service.channelPackage.getApkIds();
        if (packages.length === 0) {
            this.logger.info('task test packages length = 0');
            return;
        }
        this.logger.info('packages: ', JSON.stringify(packages));

        const payInType = await this.getPayType(ctx);

        const sta_day = ctx.getDateByAdd(-1);// 统计的日期
        // const sta_day = '2021-03-23';
        const diffday = [ 1, 2, 6, 14, 29 ];
        const ranges = [ -1, -2, -6, -14, -29 ];
        let days = [];
        for (let i = 0; i < ranges.length; i++) {
            // days.push(ctx.getDateByAdd(ranges[i]));
            days.push(ctx.getDateByCustomAndAdd(sta_day, ranges[i]));
        }
        this.logger.info('days : ', JSON.stringify(days));
        // 查找所有ApkId
        for (let i = 0; i < packages.length; i++) {
            const apkId = packages[i].apk_id;
            // this.logger.info('apkId : ', apkId);
            const mslist = await this.queryChannels(apkId, sta_day);
            // this.logger.info(JSON.stringify(mslist));
            // 每个ApkId下需要统计的新增
            let values_params = [];
            for (let j = 0; j < mslist.length; j++) {
                const ms = mslist[j];
                for (let k = 0; k < ms.Campaigns.length; k++) {
                    const Campaign = ms.Campaigns[k];
                    const sql_new = `select count(distinct(DeviceId)) as count from ${usertable} 
                    join ${logintable} on ${usertable}.UserId = ${logintable}.UserId
                    where TotalPayIn > ? and ApkId = ? and date(LoginTime) = ? ${Campaign.Sql}`;
                    const params = [ payInType, apkId, sta_day ].concat(Campaign.Params);
                    const result_login = await ctx.mysqlQueryByGame(sql_new, params);
                    const login_users = result_login[0].count;
                    this.logger.info(`Day = ${sta_day}, MediaSource = ${ms.MediaSource}, Campaign = ${Campaign.Name}, login_users = ${login_users}`);
                    values_params.push([ sta_day, apkId, ms.MediaSource, Campaign.Name, login_users ]);
                }
            }
            if (values_params.length > 0) {
                const params_sql = '(CreateDate, ApkId, MediaSource, Campaign, NewUsers)';
                const sql = `insert into ${app.config.TableName.Keep_Pay_Statistics} ${params_sql} values ?`;
                await ctx.mysqlQueryByLocal(sql, [ values_params ]);
            }

            // 统计次留(-1天), 3留(-2天), 7留(-6天), 15留(-14天), 30留(-29天)的留存数据
            for (let m = 0; m < days.length; m++) {
                const day = days[m];
                const mslist = await this.queryChannels(apkId, day);

                let values_params = [];
                for (let j = 0; j < mslist.length; j++) {
                    const ms = mslist[j];
                    for (let k = 0; k < ms.Campaigns.length; k++) {
                        const Campaign = ms.Campaigns[k];
                        let rrSql = `COUNT(DISTINCT Login_log.UserId) as active_users${diffday[m] + 1}`;
                        const selectSql = `select ${rrSql} from ${usertable}`;
                        const joinSql = `join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
                        const whereSql = `where date(Login_day) = ? and ApkId = ? ${Campaign.Sql} and ${logintable}.UserId in (SELECT ${logintable}.UserId FROM ${logintable} WHERE DATE(Login_day) = ?) and TotalPayIn > ?`;
                        const sql = `${selectSql} ${joinSql} ${whereSql}`;
                        const data = [ day, apkId ].concat(Campaign.Params);
                        data.push(sta_day);
                        data.push(payInType);
                        const result = await ctx.mysqlQueryByGame(sql, data);
                        if (result.length === 0) {
                            continue;
                        }
                        const res = result[0];
                        // 查询当前留存日期登录总数
                        const active_users = res[`active_users${diffday[m] + 1}`];
                        const dayLoginSelectSql = `select count(DISTINCT ${logintable}.UserId) as new_users from ${usertable}`;
                        const dayLoginWhereSql = `where date(Login_day) = ? and TotalPayIn > ? and ApkId = ? ${Campaign.Sql}`;
                        const dayLoginSql = `${dayLoginSelectSql} ${joinSql} ${dayLoginWhereSql}`;
                        const dayLoginParams = [ day, payInType, apkId ].concat(Campaign.Params);
                        const dayLoginResult = await ctx.mysqlQueryByGame(dayLoginSql, dayLoginParams);
                        const new_users = dayLoginResult[0].new_users;
                        console.log(`Day = ${day}, MediaSource = ${ms.MediaSource}, Campaign = ${Campaign.Name}, active_users${diffday[m] + 1}: ${active_users}`);
                        values_params.push([ day, apkId, ms.MediaSource, Campaign.Name, new_users, active_users ]);
                    }
                }
                if (values_params.length === 0) {
                    continue;
                }
                const active_users = `ActiveUsers${diffday[m] + 1}`;
                const params_sql = `(CreateDate, ApkId, MediaSource, Campaign, NewUsers, ${active_users})`;
                const sql = `insert into ${app.config.TableName.Keep_Pay_Statistics} ${params_sql} values ? on duplicate key update ${active_users} = values(${active_users})`;
                await ctx.mysqlQueryByLocal(sql, [ values_params ]);
            }
        }
    }

    async queryChannels(apkId, date) {
        const { ctx } = this;
        const sql = `select distinct(MediaSource) as MediaSource, Campaign, AfStatus from ${usertable} where ApkId = ? and date(LoginTime) = ?`;
        const result = await ctx.mysqlQueryByGame(sql, [ apkId, date ]);
        let mslist = [];
        if (result.length === 0) {
            return mslist;
        }
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            let data = {};
            if (item.AfStatus === 0 || item.AfStatus === 2) {
                const lastdata = mslist.find(sub => {
                    return sub.MediaSource === 'organic';
                });
                if (!lastdata) {
                    data.MediaSource = 'organic';
                    data.Campaigns = [];
                    data.Campaigns.push({ Name: 'organic', Sql: 'and (AfStatus = ? or AfStatus = ?)', Params: [ 0, 2 ] });
                } else {
                    continue;
                }
            } else if (item.MediaSource === 'restricted') {
                data.MediaSource = item.MediaSource;
                data.Campaigns = [];
                data.Campaigns.push({ Name: item.MediaSource, Sql: 'and MediaSource = ?', Params: [ item.MediaSource ] });
            } else {
                if (item.Campaign === '23020029') {
                    data.MediaSource = 'yeahagency';
                    data.Campaigns = [];
                    data.Campaigns.push({ Name: item.Campaign, Sql: 'and Campaign = ?', Params: [ item.Campaign ] });
                } else {
                    const lastdata = mslist.find(sub => {
                        return sub.MediaSource === item.MediaSource;
                    });
                    if (lastdata) {
                        lastdata.Campaigns.push({ Name: item.Campaign, Sql: 'and MediaSource = ? and Campaign = ?', Params: [ item.MediaSource, item.Campaign ] });
                        continue;
                    } else {
                        if (item.MediaSource !== '') {
                            data.MediaSource = item.MediaSource;
                            data.Campaigns = [];
                            data.Campaigns.push({ Name: item.Campaign, Sql: 'and MediaSource = ? and Campaign = ?', Params: [ item.MediaSource, item.Campaign ] });
                        } else {
                            continue;
                        }
                    }
                }
            }
            mslist.push(data);
        }
        return mslist;
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
module.exports = TaskActivePayKeep;
