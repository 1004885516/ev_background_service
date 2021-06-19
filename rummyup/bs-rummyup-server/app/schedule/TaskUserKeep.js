'use strict';
const Subscription = require('egg').Subscription;

const usertable = 'User';
const logintable = 'Login_log';

class TaskUserKeep extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '0 2 0 * * *',
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
                    const sql_new = `select count(distinct(DeviceId)) as count from ${usertable} where ApkId = ? and date(RegTime) = ? ${Campaign.Sql}`;
                    const params = [ apkId, sta_day ].concat(Campaign.Params);
                    const result_new = await ctx.mysqlQueryByGame(sql_new, params);
                    const new_users = result_new[0].count;
                    this.logger.info(`Day = ${sta_day}, MediaSource = ${ms.MediaSource}, Campaign = ${Campaign.Name}, new_users = ${new_users}`);
                    values_params.push([ sta_day, apkId, ms.MediaSource, Campaign.Name, new_users ]);
                }
            }
            if (values_params.length > 0) {
                const params_sql = '(CreateDate, ApkId, MediaSource, Campaign, NewUsers)';
                const sql = `insert into ${app.config.TableName.Keep_Statistics} ${params_sql} values ?`;
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
                        const dateSql = 'date(RegTime) as date';
                        const newSql = `count(distinct ${usertable}.DeviceId) as new_users`;
                        // , ifnull(sum(datediff(Login_day, RegTime) = ${diffday[m]}) / count(distinct ${usertable}.DeviceId), 0) as rr${diffday[m] + 1}
                        let rrSql = `ifnull(sum(datediff(Login_day, RegTime) = ${diffday[m]}), 0) as active_users${diffday[m] + 1}`;
                        const selectSql = `select ${dateSql}, ${newSql}, ${rrSql} from ${usertable}`;
                        const joinSql = `join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
                        const whereSql = `where date(RegTime) = ? and ApkId = ? ${Campaign.Sql}`;
                        const groupSql = 'group by date(RegTime)';
                        const sql = `${selectSql} ${joinSql} ${whereSql} ${groupSql}`;
                        const data = [ day, apkId ].concat(Campaign.Params);
                        const result = await ctx.mysqlQueryByGame(sql, data);
                        const res = result[0];
                        const new_users = res.new_users;
                        const active_users = res[`active_users${diffday[m] + 1}`];
                        // const keep_rate = new_users === 0 ? 0 : ctx.signFigures((active_users / new_users).toFixed(4) * 100);
                        console.log(`Day = ${day}, MediaSource = ${ms.MediaSource}, Campaign = ${Campaign.Name}, new_users: ${new_users}, active_users${diffday[m] + 1}: ${active_users}`);
                        values_params.push([ day, apkId, ms.MediaSource, Campaign.Name, new_users, active_users ]);
                    }
                }
                if (values_params.length === 0) {
                    continue;
                }
                const active_users = `ActiveUsers${diffday[m] + 1}`;
                const params_sql = `(CreateDate, ApkId, MediaSource, Campaign, NewUsers, ${active_users})`;
                const sql = `insert into ${app.config.TableName.Keep_Statistics} ${params_sql} values ? on duplicate key update ${active_users} = values(${active_users})`;
                await ctx.mysqlQueryByLocal(sql, [ values_params ]);
            }
        }
    }

    async queryChannels(apkId, date) {
        const { ctx } = this;
        const sql = `select distinct(MediaSource) as MediaSource, Campaign, AfStatus from ${usertable} where ApkId = ? and date(RegTime) = ?`;
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

    async taskUserKeep() {
        const { ctx, app } = this;
        const packages = await ctx.service.channelPackage.getData();
        if (packages.length === 0) {
            this.logger.info('taskUserKeep packages length 0');
        } else {
            const date = ctx.getDateByAdd(-1);
            for (let i = 0; i < packages.length; i++) {
                const item = packages[i];
                const isExist = await this.selectUserKeepData(date, item.package_id, item.apk_id);
                if (isExist) {
                    this.logger.info(`query date: ${date}, channelId: ${app.config.ChannelId}, packageId: ${item.package_id}, apkId: ${item.apk_id} is exist.`);
                } else {
                    this.logger.info(`query date: ${date}, channelId: ${app.config.ChannelId}, packageId: ${item.package_id}, apkId: ${item.apk_id} is not exist.`);
                    const data = await this.queryUserKeepData(date, item.package_id, item.apk_id);
                    if (data) {
                        data.package_id = item.package_id;
                        data.apk_id = item.apk_id;
                        data.date = ctx.transferDate(data.date);
                        console.log('data : ', data);
                        const insertResult = await this.insertUserKeepData(data);
                        console.log('insertResult : ', insertResult);
                    }
                }
            }
        }
    }

    async selectUserKeepData(date, packageId, apkId) {
        const { ctx } = this;
        const selectSql = 'select * from user_keep_data where package_id = ? and apk_id = ? and date(date) = ?';
        const result = await ctx.mysqlQueryByLocal(selectSql, [ packageId, apkId, date ]);
        if (result.length === 0) {
            return false;
        }
        return true;
    }

    async insertUserKeepData(data) {
        const { ctx } = this;
        return await ctx.mysqlByLocal(ctx.MysqlType.Insert, 'user_keep_data', data);
    }

    async queryUserKeepData(date, packageId, apkId) {
        const { ctx, app } = this;
        const startdate = date + ' 00:00:00';
        const enddate = date + ' 23:59:59';
        const dateSql = 'date(RegTime) as date';
        const newSql = 'count(distinct User.UserId) as new_users';
        const uk1Sql = 'ifnull(sum(datediff(Login_day, RegTime) = 1) / count(distinct User.UserId), 0) as keep_rate_1';
        const uk2Sql = 'ifnull(sum(datediff(Login_day, RegTime) = 2) / count(distinct User.UserId), 0) as keep_rate_2';
        const uk3Sql = 'ifnull(sum(datediff(Login_day, RegTime) = 3) / count(distinct User.UserId), 0) as keep_rate_3';
        const uk7Sql = 'ifnull(sum(datediff(Login_day, RegTime) = 7) / count(distinct User.UserId), 0) as keep_rate_7';
        const uk15Sql = 'ifnull(sum(datediff(Login_day, RegTime) = 15) / count(distinct User.UserId), 0) as keep_rate_15';
        const uk30Sql = 'ifnull(sum(datediff(Login_day, RegTime) = 30) / count(distinct User.UserId), 0) as keep_rate_30';
        const ukSql = `${uk1Sql}, ${uk2Sql}, ${uk3Sql}, ${uk7Sql}, ${uk15Sql}, ${uk30Sql}`;
        const selectSql = `select ${dateSql}, ${newSql}, ${ukSql} from User`;
        const joinSql = 'join Login_log on User.UserId = Login_log.UserId';
        const whereSql = 'where ChannelId = ? and RegTime >= ? and RegTime <= ? and PackageId = ? and ApkId = ?';
        const groupSql = 'group by date(RegTime)';
        const sql = `${selectSql} ${joinSql} ${whereSql} ${groupSql}`;
        const data = [ app.config.ChannelId, startdate, enddate, packageId, apkId ];
        const result = await ctx.mysqlQueryByGame(sql, data);
        if (result.length === 0) {
            console.log(`date: ${date}, packageId: ${packageId}, apkId: ${apkId} no new users`);
            return null;
        }
        return result[0];
    }
}
module.exports = TaskUserKeep;
