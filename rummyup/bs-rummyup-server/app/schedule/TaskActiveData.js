'use strict';


const usertable = 'User';
const Subscription = require('egg').Subscription;

class TaskActiveData extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '5s',
            cron: '0 3 0 * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        this.taskActiveData();
    }
    async taskActiveData() {

        const { ctx } = this;

        const yesterday = ctx.getDateByAdd(-1);
        const startDate = `${yesterday} 00:00:00`;
        const endDate = `${yesterday} 23:59:59`;
        // 获取所有apkId
        const packages = await ctx.service.channelPackage.getApkIds();
        if (packages.length === 0) {
            this.logger.info('task test packages length = 0');
            return;
        }
        this.logger.info('packages: ', JSON.stringify(packages));
        for (let i = 0; i < packages.length; i++) {
            const apkId = packages[i].apk_id;
            // 查询每一个apkId对应的所有 MediaSource
            const mslist = await this.queryChannels(apkId, yesterday);
            for (let j = 0; j < mslist.length; j++) {
                const ms = mslist[j];
                // 查询每一个apkId 和 mediaId 对应的所有 Campaign
                for (let k = 0; k < ms.Campaigns.length; k++) {
                    const Campaign = ms.Campaigns[k];
                    const mediaId = ms.MediaSource;
                    const campaignId = Campaign.Name;
                    const cSql = Campaign.Sql;
                    const cParams = Campaign.Params;
                    await this.insertActiveData(ctx, yesterday, startDate, endDate, apkId, mediaId, campaignId, cSql, cParams);
                }
            }
        }
    }

    async insertActiveData(ctx, yesterday, startDate, endDate, apkId, mediaId, campaignId, cSql, cParams) {
        const onlineSql = 'SELECT onlineMax FROM online_max_day WHERE date = ?';
        const onlineMaxData = await ctx.mysqlQueryByLocal(onlineSql, [ yesterday ]);
        const onlineMax = onlineMaxData[0] && onlineMaxData[0].onlineMax ? onlineMaxData[0].onlineMax : 0;
        const { loginCount, newRegCount, newRegFbCount, newRegPHCount, newTouristCount } = await this.getUserData(ctx, startDate, endDate, apkId, cSql, cParams);
        const { rechargeUserCount, newRechargeUserCount } = await this.getNewRechargeCount(ctx, startDate, endDate, apkId, cSql, cParams);
        const { rummyNumbers, teenpattiNumbers, relationNumbers, speedTPNumbers, rummy2UserNumbers } = await this.getGameTimes(ctx, yesterday, startDate, endDate);
        const { noGame, noGame_fb, noGame_ph, noGame_gt, noSign, noSign_fb, noSign_ph, noSign_gt } = await this.getNewRechargeAndSign(ctx, yesterday, startDate, endDate, apkId, cSql, cParams);
        const { noWheel_total, noWheel_fb, noWheel_ph, noWheel_tourist } = await this.getDataByNoWheel(ctx, yesterday, startDate, endDate, apkId, cSql, cParams);
        const sql = `REPLACE INTO active_data 
            (create_date, online_max, 
            login_users, new_users, new_phone_user, new_fb_user, new_guest, 
            recharge_users, new_recharge_users, 
            rummy_number, teenpatti_number, relation_number, speed_teenpatti_number, user2rummy_number,
            noGame, noGame_fb, noGame_phone, noGame_tourist, noSign, noSign_fb, noSign_phone, noSign_tourist,
            noWheel_total, noWheel_fb, noWheel_ph, noWheel_tourist,
            ApkId, MediaSourceId, CampaignId)
            VALUES (?,?,
                ?,?,?,?,?,
                ?,?,
                ?,?,?,?,?,
                ?,?,?,?,?,?,?,?,
                ?,?,?,?,
                ?,?,?);`;
        const params = [ yesterday, onlineMax,
            loginCount, newRegCount, newRegPHCount, newRegFbCount, newTouristCount,
            rechargeUserCount, newRechargeUserCount,
            rummyNumbers, teenpattiNumbers, relationNumbers, speedTPNumbers, rummy2UserNumbers,
            noGame, noGame_fb, noGame_ph, noGame_gt, noSign, noSign_fb, noSign_ph, noSign_gt,
            noWheel_total, noWheel_fb, noWheel_ph, noWheel_tourist,
            apkId, mediaId, campaignId ];
        await ctx.mysqlQueryByLocal(sql, params);
    }

    // 查询新增用户
    async getUserData(ctx, startDate, endDate, apkId, cSql, cParams) {
        // 活跃用户
        const sql1 = `SELECT COUNT(*) as loginCount FROM User WHERE LoginTime >= ? and LoginTime <= ? and ApkId = ? ${cSql}`;
        const params = [ startDate, endDate, apkId ].concat(cParams);
        const result1 = await ctx.mysqlQueryByGame(sql1, params);
        // 新增用户
        const sql2 = `SELECT COUNT(*) as newRegCount FROM User WHERE RegTime >= ? and RegTime <= ? and ApkId = ? ${cSql}`;
        const result2 = await ctx.mysqlQueryByGame(sql2, params);
        // 新增FB注册
        const sql3 = `SELECT COUNT(*) as newRegFbCount FROM User WHERE RegTime >= ? and RegTime <= ? and FbId <> ? and Phone = ? and ApkId = ? ${cSql}`;
        const fbParams = [ startDate, endDate, '', '', apkId ].concat(cParams);
        const result3 = await ctx.mysqlQueryByGame(sql3, fbParams);
        // 新增手机号注册
        const sql4 = `SELECT COUNT(*) as newRegPHCount FROM User WHERE RegTime >= ? and RegTime <= ? and Phone <> ? and ApkId = ? ${cSql}`;
        const phParams = [ startDate, endDate, '', apkId ].concat(cParams);
        const result4 = await ctx.mysqlQueryByGame(sql4, phParams);
        // 新增游客
        const sql5 = `SELECT COUNT(*) as newTouristCount FROM User WHERE RegTime >= ? and RegTime <= ? and FbId = ? and Phone = ? and ApkId = ? ${cSql}`;
        const touristSql = [ startDate, endDate, '', '', apkId ].concat(cParams);
        const result5 = await ctx.mysqlQueryByGame(sql5, touristSql);
        const userData = Object.assign({}, result1[0], result2[0], result3[0], result4[0], result5[0]);
        return userData;
    }

    // 查询充值用户
    async getNewRechargeCount(ctx, startDate, endDate, apkId, cSql, cParams) {
        // 所有充值人数
        const sql = `SELECT 
            COUNT(distinct(UserId)) as rechargeUserCount \
            FROM 
            (SELECT OrderRecord.*, User.ApkId, User.MediaSource, User.Campaign, User.AfStatus
                FROM OrderRecord LEFT JOIN User ON OrderRecord.UserId = User.UserId 
                WHERE OrderRecord.CreateTime >= ? and OrderRecord.CreateTime <= ? and OrderStatus = ?) t \
            WHERE ApkId = ? ${cSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ startDate, endDate, 1, apkId ].concat(cParams));

        // 昨日新增用户充值人数
        const sql2 = `SELECT 
            COUNT(distinct(UserId)) as newRechargeUserCount \
            FROM 
            (SELECT OrderRecord.*, User.ApkId, User.MediaSource, User.Campaign, User.AfStatus
                FROM OrderRecord LEFT JOIN User ON OrderRecord.UserId = User.UserId 
                WHERE OrderRecord.CreateTime >= ? and OrderRecord.CreateTime <= ? and OrderStatus = ? and User.RegTime >= ? and User.RegTime <= ?) t \
            WHERE ApkId = ? ${cSql}`;
        const result2 = await ctx.mysqlQueryByGame(sql2, [ startDate, endDate, 1, startDate, endDate, apkId ].concat(cParams));
        const data = {
            rechargeUserCount: result[0].rechargeUserCount,
            newRechargeUserCount: result2[0].newRechargeUserCount,
        };
        return data;
    }

    // 查询游戏场次
    async getGameTimes(ctx, yesterday, startDate, endDate) {
        const dbName = 'RoundRecord_' + ctx.transferMonth(yesterday);
        // rummy场次
        const sql = `SELECT COUNT(*) as rummyNumbers FROM ${dbName} WHERE GameName = ? and CreateTime >= ? and CreateTime <= ?`;
        const result = await ctx.mysqlQueryByGame(sql, [ 'Rummy', startDate, endDate ]);
        // teenpatti场次
        const sql2 = `SELECT COUNT(*) as teenpattiNumbers FROM ${dbName} WHERE GameName = ? and CreateTime >= ? and CreateTime <= ? and RoomLevel <> ?`;
        const result2 = await ctx.mysqlQueryByGame(sql2, [ 'Teenpatti', startDate, endDate, 'PracticeArena' ]);
        // 练习场场次
        const sql3 = `SELECT COUNT(*) as relationNumbers FROM ${dbName} WHERE RoomLevel = ? and CreateTime >= ? and CreateTime <= ?`;
        const result3 = await ctx.mysqlQueryByGame(sql3, [ 'PracticeArena', startDate, endDate ]);

        // 快速tp场次
        const sql4 = `SELECT COUNT(*) as speedTPNumbers FROM ${dbName} WHERE GameName = ? and CreateTime >= ? and CreateTime <= ?`;
        const result4 = await ctx.mysqlQueryByGame(sql4, [ 'QuickTP', startDate, endDate ]);

        // 2人rummy场次
        const sql5 = `SELECT COUNT(*) as rummy2UserNumbers FROM ${dbName} WHERE GameName = ? and CreateTime >= ? and CreateTime <= ?`;
        const result5 = await ctx.mysqlQueryByGame(sql5, [ 'Rummy2User', startDate, endDate ]);
        const obj = Object.assign({}, result[0], result2[0], result3[0], result4[0], result5[0]);
        return obj;
    }

    // 查询新增未游戏人数和新增未签到游戏
    async getNewRechargeAndSign(ctx, yesterday, startDate, endDate, apkId, cSql, cParams) {

        const data = { noGame: 0, noGame_fb: 0, noGame_ph: 0, noGame_gt: 0, noSign: 0, noSign_fb: 0, noSign_ph: 0, noSign_gt: 0 };

        const date = ctx.transferMonth(yesterday);
        const dbName = `Charge_${date}`;
        const dbName2 = `PlayerRankRecord_${date}`;

        // 全部用户
        const sql1 = `SELECT UserId FROM User WHERE RegTime >= ? and RegTime <= ? and ApkId = ? ${cSql}`;
        const users = await ctx.mysqlQueryByGame(sql1, [ startDate, endDate, apkId ].concat(cParams));
        const UserIds = users.map(item => {
            return item.UserId;
        });

        // fb用户
        const fbSql = `SELECT UserId FROM User WHERE RegTime >= ? and RegTime <= ? and FbId <> ? and Phone = ? and ApkId = ? ${cSql}`;
        const fbUsers = await ctx.mysqlQueryByGame(fbSql, [ startDate, endDate, '', '', apkId ].concat(cParams));
        const fbUserIds = fbUsers.map(item => {
            return item.UserId;
        });

        // ph用户
        const phSql = `SELECT UserId FROM User WHERE RegTime >= ? and RegTime <= ? and Phone <> ? and ApkId = ? ${cSql}`;
        const phUsers = await ctx.mysqlQueryByGame(phSql, [ startDate, endDate, '', apkId ].concat(cParams));
        const phUserIds = phUsers.map(item => {
            return item.UserId;
        });

        // 查询流水
        if (UserIds.length > 0) {
            const sql2 = `SELECT UserId, ChgType FROM ${dbName} WHERE CreateTime >= ? and CreateTime <= ? and UserId IN (${UserIds})`;
            const charges = await ctx.mysqlQueryByGame(sql2, [ startDate, endDate ]);
            const sql3 = `SELECT UserId FROM ${dbName2} WHERE CreateTime >= ? and CreateTime <= ? and UserId IN (${UserIds}) and RoomLevel != ?`;
            const playerRecord = await ctx.mysqlQueryByGame(sql3, [ startDate, endDate, 'PracticeArena' ]);

            for (let i = 0; i < UserIds.length; i++) {
                const ChgTypes = charges.map(item => {
                    if (UserIds[i] === item.UserId) {
                        return item.ChgType;
                    }
                    return null;
                });

                if (!ChgTypes.includes(113)) {
                    data.noSign += 1;
                }

                const player = playerRecord.map(item => {
                    return item.UserId;
                });

                if (!player.includes(UserIds[i])) {
                    data.noGame += 1;
                }
            }
        }

        if (fbUserIds.length > 0) {
            const fsql = `SELECT UserId, ChgType FROM ${dbName} WHERE CreateTime >= ? and CreateTime <= ? and UserId IN (${fbUserIds})`;
            const fcharges = await ctx.mysqlQueryByGame(fsql, [ startDate, endDate ]);

            const sql3 = `SELECT UserId FROM ${dbName2} WHERE CreateTime >= ? and CreateTime <= ? and UserId IN (${fbUserIds}) and RoomLevel != ?`;
            const playerRecord = await ctx.mysqlQueryByGame(sql3, [ startDate, endDate, 'PracticeArena' ]);

            for (let f = 0; f < fbUserIds.length; f++) {
                const FBChgTypes = fcharges.map(item => {
                    if (fbUserIds[f] === item.UserId) {
                        return item.ChgType;
                    }
                    return null;
                });
                if (!FBChgTypes.includes(113)) {
                    data.noSign_fb += 1;
                }
                const player = playerRecord.map(item => {
                    return item.UserId;
                });

                if (!player.includes(fbUserIds[f])) {
                    data.noGame_fb += 1;
                }
            }
        }

        if (phUserIds.length > 0) {
            const psql = `SELECT UserId, ChgType FROM ${dbName} WHERE CreateTime >= ? and CreateTime <= ? and UserId IN (${phUserIds})`;
            const pcharges = await ctx.mysqlQueryByGame(psql, [ startDate, endDate ]);

            const sql3 = `SELECT UserId FROM ${dbName2} WHERE CreateTime >= ? and CreateTime <= ? and UserId IN (${phUserIds}) and RoomLevel != ?`;
            const playerRecord = await ctx.mysqlQueryByGame(sql3, [ startDate, endDate, 'PracticeArena' ]);

            for (let p = 0; p < phUserIds.length; p++) {
                const PHChgTypes = pcharges.map(item => {
                    if (phUserIds[p] === item.UserId) {
                        return item.ChgType;
                    }
                    return null;
                });
                if (!PHChgTypes.includes(113)) {
                    data.noSign_ph += 1;
                }

                const player = playerRecord.map(item => {
                    return item.UserId;
                });

                if (!player.includes(phUserIds[p])) {
                    data.noGame_ph += 1;
                }
            }
        }
        data.noGame_gt = data.noGame - data.noGame_fb - data.noGame_ph;
        data.noSign_gt = data.noSign - data.noSign_fb - data.noSign_ph;
        return data;
    }
    // 查询一日流失金币
    async getOneDayResidue(ctx, apkId, cSql, cParams) {
        const regStartTime = ctx.getDateByAdd(-2) + ' 00:00:00';
        const regEndtTime = ctx.getDateByAdd(-1);
        const userSql = `SELECT COUNT(distinct(DeviceId)) AS userCount, (IFNULL(SUM(Gold), 0) + IFNULL(SUM(WinGold), 0)) as totalGold 
            FROM User 
            WHERE RegTime >= ? and RegTime <= ? and LoginTime < ? and ApkId = ? ${cSql}`;
        const result = await ctx.mysqlQueryByGame(userSql, [ regStartTime, regEndtTime, regEndtTime, apkId ].concat(cParams));
        const userCount = result[0].userCount;
        const totalGold = ctx.changeClientRatio(result[0].totalGold);
        const residue = (totalGold / userCount).toFixed(2);
        return { one_day_residue: isNaN(residue) ? 0 : residue };
    }

    // 查询新增未转盘数据
    async getDataByNoWheel(ctx, yesterday, startDate, endDate, apkId, cSql, cParams) {

        const data = { noWheel_total: 0, noWheel_fb: 0, noWheel_ph: 0 };
        const date = ctx.transferMonth(yesterday);
        const dbName = `Charge_${date}`;
        // 查询前一日所有新注册用户
        const sql = `SELECT UserId FROM User WHERE RegTime >= ? and RegTime <= ? and ApkId = ? ${cSql}`;
        const totalUser = await ctx.mysqlQueryByGame(sql, [ startDate, endDate, apkId ].concat(cParams));
        // 统计新增未转盘总数
        for (let i = 0; i < totalUser.length; i++) {
            const turntableSql = `SELECT * FROM ${dbName} WHERE CreateTime >= ? and CreateTime <= ? and  UserId = ? and ChgType = ?`;
            const turntableResult = await ctx.mysqlQueryByGame(turntableSql, [ startDate, endDate, totalUser[i].UserId, 115 ]);
            if (!turntableResult[0]) {
                data.noWheel_total += 1;
            }
        }

        // 查询前一日新增FB注册用户
        const fbSql = `SELECT UserId FROM User WHERE RegTime >= ? and RegTime <= ? and FbId <> ? and Phone = ? and ApkId = ? ${cSql}`;
        const fbUsers = await ctx.mysqlQueryByGame(fbSql, [ startDate, endDate, '', '', apkId ].concat(cParams));

        // 统计新增fb未转盘总数
        for (let i = 0; i < fbUsers.length; i++) {
            const turntableSql = `SELECT * FROM ${dbName} WHERE CreateTime >= ? and CreateTime <= ? and  UserId = ? and ChgType = ?`;
            const turntableResult = await ctx.mysqlQueryByGame(turntableSql, [ startDate, endDate, fbUsers[i].UserId, 115 ]);
            if (!turntableResult[0]) {
                data.noWheel_fb += 1;
            }
        }

        // 查询前一日新增ph注册用户
        const phSql = `SELECT UserId FROM User WHERE RegTime >= ? and RegTime <= ? and Phone <> ? and ApkId = ? ${cSql}`;
        const phUsers = await ctx.mysqlQueryByGame(phSql, [ startDate, endDate, '', apkId ].concat(cParams));
        // 统计新增ph未转盘总数
        for (let i = 0; i < phUsers.length; i++) {
            const turntableSql = `SELECT * FROM ${dbName} WHERE CreateTime >= ? and CreateTime <= ? and  UserId = ? and ChgType = ?`;
            const turntableResult = await ctx.mysqlQueryByGame(turntableSql, [ startDate, endDate, phUsers[i].UserId, 115 ]);
            if (!turntableResult[0]) {
                data.noWheel_ph += 1;
            }
        }
        data.noWheel_tourist = data.noWheel_total - data.noWheel_fb - data.noWheel_ph;
        return data;
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
}

module.exports = TaskActiveData;
