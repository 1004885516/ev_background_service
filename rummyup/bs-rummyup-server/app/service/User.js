'use strict';
const Service = require('egg').Service;
const tabel_name = 'User';

const masktable = 'MarkLog';
const usertable = 'User';
const logintable = 'Login_log';
const ordertable = 'OrderRecord';
const payouttable = 'Payout';

const testname = 'jiadaye';
const pageDevice = require('../utils/DevicePage');

class UserService extends Service {
    // 查询用户信息
    async getUserInfo() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const userId = reqBody.user_id;
        const sql = `select * from ${tabel_name} where UserId = ?`;
        const result = await ctx.mysqlQueryByGame(sql, [ userId ]);
        const params = `userid=${userId}`;
        const serverUser = await ctx.httpGet(app.config.GetUserType, params);
        if (result[0]) {
            result[0].userType = serverUser && serverUser.msg ? serverUser.msg : '';
        }
        const withdrawSql = `select count(*) as count from ${payouttable} where UserId = ? and PayoutStatus = ?`;
        const withdrawParams = [ userId, 5 ];
        const withdrawResult = await ctx.mysqlQueryByGame(withdrawSql, withdrawParams);
        result[0].withdrawCount = withdrawResult[0].count;
        return result[0];
    }

    // 获取当天登陆的玩家
    async getTodayActivePlayers() {
        const { ctx } = this;
        let today = ctx.getTodaySymbol();
        let startDate = today + ' 00:00:00';
        let endDate = today + ' 23:59:59';
        const sql = 'select count(distinct(DeviceId)) as total from ' + tabel_name + ' where LoginTime >= ? and LoginTime <= ?';
        const result = await ctx.mysqlQueryByGame(sql, [ startDate, endDate ]);
        return result[0].total;
    }

    // 根据渠道id获取总的注册用户数
    async getTotalUsers() {
        const { ctx, app } = this;
        const sql = 'select count(distinct(DeviceId)) as total from ' + tabel_name + ' where ChannelId = ?';
        const result = await ctx.mysqlQueryByGame(sql, [ app.config.ChannelId ]);
        return result[0].total;
    }

    // 查询累计总用户数
    async getGrandTotalUsers() {
        const { ctx } = this;
        const sql = `SELECT Count(distinct(DeviceId)) AS Total FROM ${tabel_name}`;
        const result = await ctx.mysqlQueryByGame(sql, []);
        return result[0].Total;
    }

    // 查询当天最高在线人数
    async getOnlineMax() {
        const { ctx } = this;
        const day = ctx.getTodaySymbol();
        const sql = 'SELECT onlineMax FROM online_max_day WHERE date = ?';
        const result = await ctx.mysqlQueryByLocal(sql, [ day ]);
        return result[0].onlineMax;
    }
    // 查询今日总注册用户数
    async newRegister() {
        const { ctx } = this;
        const day = ctx.getTodaySymbol();
        const startDate = day + ' 00:00:00';
        const endDate = day + ' 23:59:59';
        const sql = 'SELECT COUNT(distinct(DeviceId)) as newRegCount FROM User WHERE RegTime >= ? and RegTime <= ?';
        const result = await ctx.mysqlQueryByGame(sql, [ startDate, endDate ]);
        return result[0].newRegCount;
    }
    // 查询设备启动数，更新版本数，FB登录数，手机登录数，游客登录数
    async getMarkData() {
        const { ctx, app } = this;
        const data = {
            deviceNumbers: 0,
            versionNumbers: 0,
            FBLogins: 0,
            phoneLogins: 0,
            touristLogins: 0,
        };
        const gameUrl = app.config.MarkLogUrl;
        const result = await ctx.httpGet(gameUrl);
        const MarkData = result.MarkData;
        MarkData.forEach(item => {
            if (item.MardData['1']) {
                data.deviceNumbers += item.MardData['1'];
            }
            if (item.MardData['2']) {
                data.versionNumbers += item.MardData['2'];
            }
            if (item.MardData['10_2']) {
                data.FBLogins += item.MardData['10_2'];
            }
            if (item.MardData['10_3']) {
                data.phoneLogins += item.MardData['10_3'];
            }
            if (item.MardData['10_1']) {
                data.touristLogins += item.MardData['10_1'];
            }
        });
        return data;
    }
    // 根据渠道id获取当天的注册用户数
    async getRegisterUsers(date, packageId, apkId) {
        const { ctx, app } = this;
        let startDate = date + ' 00:00:00';
        let endDate = date + ' 23:59:59';
        let data = [ app.config.ChannelId, startDate, endDate, packageId, apkId ];
        const whereSql = 'where ChannelId = ? and RegTime >= ? and RegTime <= ? and PackageId = ? and ApkId = ?';
        const sql = `select ifnull(count(distinct(DeviceId)), 0) as total from ${tabel_name} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, data);
        return result[0].total;
    }

    // 查询总用户数据
    async getUserDataByPackageAndDate(PackageId, ApkId, startDate, endDate) {

        this.logger.info('package id : ', PackageId, ApkId, startDate, endDate);

        const { app, ctx } = this;

        // 总注册用户
        const whereSql = 'where ChannelId = ? and RegTime >= ? and RegTime <= ? and PackageId = ? and ApkId = ?';
        const sql = `select ifnull(count(distinct(DeviceId)), 0) as userCount from ${tabel_name} ${whereSql}`;
        const params = [ app.config.ChannelId, startDate, endDate, PackageId, ApkId ];
        const userCount = await ctx.mysqlQueryByGame(sql, params);

        // 总充值数据
        const selectSql2 = `SELECT \
            IFNULL(COUNT(distinct(UserId)), 0) as regUserCount, \
            IFNULL(COUNT(*),0) as rechargeNumbers, \
            IFNULL(SUM(Amount), 0) as totalRegMoney
            FROM (SELECT OrderRecord.*, User.PackageId, User.ApkId FROM OrderRecord LEFT JOIN User ON OrderRecord.UserId = User.UserId) T `;
        const whereSql2 = 'WHERE CreateTime >= ? and CreateTime <= ? and OrderStatus = ? and PackageId = ? and ApkId = ?';
        const sql2 = selectSql2 + whereSql2;
        const params2 = [ startDate, endDate, 1, PackageId, ApkId ];
        const recharge = await ctx.mysqlQueryByGame(sql2, params2);

        // 总提现数据
        const selectSql3 = `SELECT \
                IFNULL(COUNT(distinct(UserId)), 0) as payoutUserCount, \
                IFNULL(COUNT(*),0) as payoutNumbers, \
                IFNULL(SUM(Amount), 0) as totalPayoutMoney
                FROM (SELECT Payout.*, User.PackageId, User.ApkId FROM Payout LEFT JOIN User ON Payout.UserId = User.UserId) T `;
        const whereSql3 = 'WHERE CreateTime >= ? and CreateTime <= ? and PayoutStatus = ? and PackageId = ? and ApkId = ?';
        const params3 = [ startDate, endDate, 5, PackageId, ApkId ];
        const sql3 = selectSql3 + whereSql3;
        const payout = await ctx.mysqlQueryByGame(sql3, params3);

        // 总抽水数据
        const dbName = 'Revenue_' + ctx.transferMonth(startDate);
        const selectSql4 = `SELECT \
                IFNULL(COUNT(distinct(WinUserId)), 0) as revenueUserCount, \
                IFNULL(COUNT(*),0) as revenueNumbers, \
                IFNULL(SUM(Gold), 0) as totalRevenueMoney
                FROM (SELECT ${dbName}.*, User.PackageId, User.ApkId FROM ${dbName} LEFT JOIN User ON ${dbName}.WinUserId = User.UserId) T `;
        const whereSql4 = 'WHERE CreateTime >= ? and CreateTime <= ? and WinUserId <> ? and PackageId = ? and ApkId = ?';
        const params4 = [ startDate, endDate, 0, PackageId, ApkId ];
        const sql4 = selectSql4 + whereSql4;
        const revenue = await ctx.mysqlQueryByGame(sql4, params4);

        const result = [
            { name: '总注册用户', data: userCount[0].userCount },
            { name: '总充值人数', data: recharge[0].regUserCount },
            { name: '总充值笔数', data: recharge[0].rechargeNumbers },
            { name: '总充值金额', data: recharge[0].totalRegMoney },
            { name: '总提现人数', data: payout[0].payoutUserCount },
            { name: '总提现笔数', data: payout[0].payoutNumbers },
            { name: '总提现金额', data: payout[0].totalPayoutMoney },
            { name: '总抽水人数', data: revenue[0].revenueUserCount },
            { name: '总抽水笔数', data: revenue[0].revenueNumbers },
            { name: '总抽水金额', data: revenue[0].totalRevenueMoney },
        ];
        return result;
    }

    // 发送金币给玩家
    async sendGold(userId, gold) {
        this.logger.info('send gold userId : ', userId);
        this.logger.info('send gold gold : ', gold);
    }

    // 查询启动app数据
    async queryActivateByPackage(packageId, apkId, date) {
        const { ctx, app } = this;
        const result = await ctx.mysqlByGame(ctx.MysqlType.Select, masktable, { where: { MarkDay: date, PackageId: packageId, ApkId: apkId, ChannelId: app.config.ChannelId } });
        // this.logger.info('queryActivateByPackage result : ', result);
        if (result.length === 0 || !result[0] || !result[0].MarkContent) {
            return 0;
        }
        const mc = JSON.parse(result[0].MarkContent);
        if (mc['1']) {
            return mc['1'];
        }
        return 0;
    }
    // 查询注册数据
    async queryRegisterByPackage(packageId, apkId, date) {
        const { ctx, app } = this;
        const sql = `select count(distinct(DeviceId)) as total from ${usertable} where ChannelId = ? and date(RegTime) = ? and PackageId = ? and ApkId = ?`;
        const result = await ctx.mysqlQueryByGame(sql, [ app.config.ChannelId, date, packageId, apkId ]);
        if (result.length === 0) {
            return 0;
        }
        return result[0].total;
    }
    // 查询dau
    async queryDauByPackage(packageId, apkId, date) {
        const { ctx, app } = this;
        const selectSql = `select count(distinct(a.DeviceId)) as total from ${usertable} as a, ${logintable} as b`;
        const whereSql = 'where a.UserId = b.UserId and a.ChannelId = ? and date(b.Login_day) = ? and a.PackageId = ? and a.ApkId = ?';
        const sql = `${selectSql} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ app.config.ChannelId, date, packageId, apkId ]);
        if (result.length === 0) {
            return 0;
        }
        return result[0].total;
    }
    // 老玩家dau
    async queryDauOldByPackage(packageId, apkId, date) {
        const { ctx, app } = this;
        const selectSql = `select count(distinct(a.DeviceId)) as total from ${usertable} as a, ${logintable} as b`;
        const whereSql = 'where a.UserId = b.UserId and a.ChannelId = ? and date(b.Login_day) = ? and a.PackageId = ? and a.ApkId = ? and date(a.RegTime) != ?';
        const sql = `${selectSql} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ app.config.ChannelId, date, packageId, apkId, date ]);
        if (result.length === 0) {
            return 0;
        }
        return result[0].total;
    }
    // 充值金额
    // 充值人数(总)
    async queryRechargeCount(packageId, apkId, date) {
        const { ctx } = this;
        const countSql = 'ifnull(sum(b.Amount), 0) as count';
        const usersSql = 'ifnull(count(distinct a.UserId), 0) as users';
        const selectSql = `select ${countSql}, ${usersSql} from ${usertable} as a, ${ordertable} as b`;
        const whereSql = 'where a.UserId = b.UserId and a.PackageId = ? and a.ApkId = ? and date(b.CreateTime) = ? and b.OrderStatus = 1 and b.FirstName != ?';
        const sql = `${selectSql} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ packageId, apkId, date, testname ]);
        if (result.length === 0) {
            return 0;
        }
        return result[0];
    }
    // 充值金额(新玩家)
    // 充值人数(新玩家)
    async queryRechargeCountByNewUser(packageId, apkId, date) {
        const { ctx } = this;
        const countSql = 'ifnull(sum(b.Amount), 0) as count';
        const usersSql = 'ifnull(count(distinct a.UserId), 0) as users';
        const selectSql = `select ${countSql}, ${usersSql} from ${usertable} as a, ${ordertable} as b`;
        const whereSql = 'where a.UserId = b.UserId and a.PackageId = ? and a.ApkId = ? and date(b.CreateTime) = ? and date(a.RegTime) = ? and b.OrderStatus = 1 and b.FirstName != ?';
        const sql = `${selectSql} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ packageId, apkId, date, date, testname ]);
        if (result.length === 0) {
            return 0;
        }
        return result[0];
    }
    // 充值金额(老)  充值人数(老)   充值金额(老,复)   充值人数(老,复)
    async queryRechargeCountByOldUser(packageId, apkId, date) {
        const { ctx } = this;
        const obj = {
            recharge_users_old: 0, // 充值人数(老,首)
            recharge_count_old: 0, // 充值金额(老,首)
            recharge_users_rep: 0, // 充值人数(老,复)
            recharge_count_rep: 0, // 充值金额(老,复)
        };
        // 非当天注册，且在当日充值用户
        const selectSql = `select  b.UserId, b.Amount from ${usertable} as a, ${ordertable} as b`;
        const whereSql = 'where a.UserId = b.UserId and a.PackageId = ? and a.ApkId = ? and date(b.CreateTime) = ? and date(a.RegTime) <> ? and b.OrderStatus = 1 and b.FirstName != ?';
        const sql = `${selectSql} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ packageId, apkId, date, date, testname ]);
        // 过滤重复UserId
        const userIds = [];
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            if (!userIds.includes(item.UserId)) {
                userIds.push(item.UserId);
            }
        }
        for (let i = 0; i < userIds.length; i++) {
            const UserId = userIds[i];
            // 查询老用户在当前时间范围之前是否有充值记录
            const sql = `select * from ${ordertable} where UserId = ? and date(CreateTime) < ? and FirstName != ? and OrderStatus = 1`;
            const orderData = await ctx.mysqlQueryByGame(sql, [ UserId, date, testname ]);
            // 如果 orderData 不为空，说明之前有充值，并将此用户定义为老用户复充
            if (orderData.length > 0) {
                obj.recharge_users_rep += 1;
                for (let i = 0; i < result.length; i++) {
                    const itemData = result[i];
                    if (itemData.UserId === UserId) {
                        obj.recharge_count_rep += itemData.Amount;
                    }
                }
            } else {
                // 如果该用户在当前时间范围之前没有充值，但在当前时间范围内有多次充值，也将该用户定义为老用户复充
                const firstOrders = result.filter(item => {
                    return item.UserId === UserId;
                });
                obj.recharge_users_old += 1;
                if (firstOrders.length > 0) {
                    firstOrders.sort((a, b) => {
                        return a.CreateTime > b.CreateTime ? 1 : -1;
                    });
                    obj.recharge_count_old += firstOrders[0].Amount;
                }
                if (firstOrders.length > 1) {
                    let num = 0;
                    for (let i = 1; i < firstOrders.length; i++) {
                        num += firstOrders[i].Amount;
                    }
                    obj.recharge_count_rep += num;
                    obj.recharge_users_rep += 1;
                }
            }
        }
        return obj;
    }
    // 提现金额
    // 提现人数
    async queryWithdrawCount(packageId, apkId, date) {
        const { ctx } = this;
        const countSql = 'ifnull(sum(b.Amount), 0) as count';
        const usersSql = 'ifnull(count(distinct a.UserId), 0) as users';
        const selectSql = `select ${countSql}, ${usersSql} from ${usertable} as a, ${payouttable} as b`;
        const whereSql = 'where a.UserId = b.UserId and a.PackageId = ? and a.ApkId = ? and date(b.VerifyTime) = ? and PayoutStatus = 5';
        const sql = `${selectSql} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ packageId, apkId, date ]);
        if (result.length === 0) {
            return 0;
        }
        return result[0];
    }
    // 抽水金额
    async queryTaxCount(packageId, apkId, date) {
        const { ctx } = this;
        const tablename = `Revenue_${ctx.transferMonth(date)}`;
        const countSql = 'ifnull(sum(b.Gold), 0) as count';
        const usersSql = 'ifnull(sum(b.CashbackGold), 0) as rebate';
        const selectSql = `select ${countSql}, ${usersSql} from ${usertable} as a, ${tablename} as b`;
        const whereSql = 'where a.UserId = b.WinUserId and a.PackageId = ? and a.ApkId = ? and date(b.CreateTime) = ?';
        const sql = `${selectSql} ${whereSql}`;
        const result = await ctx.mysqlQueryByGame(sql, [ packageId, apkId, date ]);
        if (result.length === 0) {
            return 0;
        }
        return result[0];
    }

    // 获取用户在线图表数据
    async getOnlineByCharts() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const date = reqBody.querydate;
        const yesdate = ctx.getDateByCustomAndAdd(date, -1);
        const sevendate = ctx.getDateByCustomAndAdd(date, -6);
        const sql = `select data from ${app.config.TableName.Online_Recharge_Charts} where createdate = ? and datatype = ?`;
        const cur_result = await ctx.mysqlQueryByLocal(sql, [ date, app.config.ORCJsonType.Online ]);
        let data = [];
        if (cur_result.length === 0) {
            data.push([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
        } else {
            data.push(JSON.parse(cur_result[0].data));
        }
        const yes_result = await ctx.mysqlQueryByLocal(sql, [ yesdate, app.config.ORCJsonType.Online ]);
        if (yes_result.length === 0) {
            data.push([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
        } else {
            data.push(JSON.parse(yes_result[0].data));
        }
        const seven_result = await ctx.mysqlQueryByLocal(sql, [ sevendate, app.config.ORCJsonType.Online ]);
        if (seven_result.length === 0) {
            data.push([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
        } else {
            data.push(JSON.parse(seven_result[0].data));
        }
        return data;
    }

    disposeUserGoldData(result, len) {
        let data = [];
        if (result.length === 0) {
            for (let i = 0; i < len; i++) {
                data.push(0);
            }
        } else {
            for (const key in JSON.parse(result[0].data)) {
                if (Object.hasOwnProperty.call(JSON.parse(result[0].data), key)) {
                    const element = JSON.parse(result[0].data)[key];
                    data.push(element);
                }
            }
        }
        return data;
    }

    async getTotalGoldByCharts() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const date = reqBody.enddate;
        const apkId = reqBody.apk_id;
        const yesdate = ctx.getDateByCustomAndAdd(date, -1);
        const sevendate = ctx.getDateByCustomAndAdd(date, -7);

        this.logger.info(`date : ${date}, yesdate: ${yesdate}, sevendate: ${sevendate}`);

        const sql = `select data from ${app.config.TableName.User_Gold_Charts} where createdate = ? and datatype = ? and apkid = ?`;
        let data = [];
        const cur_result = await ctx.mysqlQueryByLocal(sql, [ date, app.config.ChartsType.TotalGold, apkId ]);
        data.push(this.disposeUserGoldData(cur_result, 15));

        const yes_result = await ctx.mysqlQueryByLocal(sql, [ yesdate, app.config.ChartsType.TotalGold, apkId ]);
        data.push(this.disposeUserGoldData(yes_result, 15));

        const seven_result = await ctx.mysqlQueryByLocal(sql, [ sevendate, app.config.ChartsType.TotalGold, apkId ]);
        data.push(this.disposeUserGoldData(seven_result, 15));

        return data;
    }

    async getRobotGoldByCharts() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const date = reqBody.enddate;
        const apkId = reqBody.apk_id;
        const yesdate = ctx.getDateByCustomAndAdd(date, -1);
        const sevendate = ctx.getDateByCustomAndAdd(date, -7);

        this.logger.info(`date : ${date}, yesdate: ${yesdate}, sevendate: ${sevendate}`);

        const sql = `select data from ${app.config.TableName.User_Gold_Charts} where createdate = ? and datatype = ? and apkid = ?`;
        let data = [];
        const cur_result = await ctx.mysqlQueryByLocal(sql, [ date, app.config.ChartsType.RobotGold, apkId ]);
        data.push(this.disposeUserGoldData(cur_result, 23));

        const yes_result = await ctx.mysqlQueryByLocal(sql, [ yesdate, app.config.ChartsType.RobotGold, apkId ]);
        data.push(this.disposeUserGoldData(yes_result, 23));

        const seven_result = await ctx.mysqlQueryByLocal(sql, [ sevendate, app.config.ChartsType.RobotGold, apkId ]);
        data.push(this.disposeUserGoldData(seven_result, 23));

        return data;
    }

    async getTotalGoldTable() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const startDate = reqBody.startdate;
        const endDate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;

        const selectSql = `select createdate, data from ${app.config.TableName.User_Gold_Charts} where createdate >= ? and createdate < ? and datatype = ? and apkid = ? `;
        const other_sql = 'group by CreateDate order by CreateDate desc limit ?, ?';
        const sql = `${selectSql}${other_sql}`;
        const cur_result = await ctx.mysqlQueryByLocal(sql, [ startDate, endDate, app.config.ChartsType.TotalGold, apkId, startPage, pageSize ]);
        const result = [];
        for (let i = 0; i < cur_result.length; i++) {
            const item = cur_result[i];
            const obj = {
                date: ctx.transferDate(item.createdate),
            };
            const data = JSON.parse(item.data);
            Object.assign(obj, data);
            result.push(obj);
        }
        const count_sql = `select count(*) as count from ${app.config.TableName.User_Gold_Charts} where createdate >= ? and createdate < ? and datatype = ? and apkid = ? `;
        const count_params = [ startDate, endDate, app.config.ChartsType.TotalGold, apkId ];
        const count_result = await ctx.mysqlQueryByLocal(count_sql, count_params);
        const data = {
            page,
            tableData: result,
            page_total: count_result[0].count,
        };
        return data;
    }

    // 获取KYC数据
    async getKycData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const startDate = reqBody.startdate + ' 00:00:00';
        const endDate = reqBody.enddate + ' 23:59:59';
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startIndex = (page - 1) * pageSize;
        const endIndex = pageSize;
        const selectstatus = reqBody.selectstatus;
        const selectSql = 'SELECT * FROM AccountInfo';
        const joinSql = 'LEFT JOIN KycPhone on AccountInfo.UserId = KycPhone.UserId';
        const joinSql2 = 'LEFT JOIN AadHaarCard on AccountInfo.UserId = AadHaarCard.UserId';
        let whereSql = 'WHERE AccountInfo.CreateTime >= ? and AccountInfo.CreateTime <= ?';
        if (selectstatus > 0) {
            whereSql += `and AccountInfo.AuthStatus = ${selectstatus} `;
        }
        const oderSql = 'ORDER BY CreateTime DESC';
        const limitSql = 'LIMIT ?, ?';
        const sql = `${selectSql} ${joinSql} ${joinSql2} ${whereSql} ${oderSql} ${limitSql}`;
        const kycData = await ctx.mysqlQueryByGame(sql, [ startDate, endDate, startIndex, endIndex ]);
        const countSelectSql = 'SELECT COUNT(*) AS count FROM AccountInfo';
        const countSql = `${countSelectSql} ${joinSql} ${joinSql2} ${whereSql}`;
        const countResult = await ctx.mysqlQueryByGame(countSql, [ startDate, endDate ]);
        const result = {
            onePageData: kycData,
            totalPage: countResult[0].count,
        };
        return result;
    }

    // otp获取验证码
    async getVerifyCode() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const params = `phone=${reqBody.phoneCode}`;
        const result = await ctx.httpGet(app.config.QueryVerCode, params);
        if (result.msg === '成功') {
            this.logger.info('get verify code result: ', result);
            const data = result.code;
            this.logger.info('get verify code data: ', data);
            return data;
        }
        return null;
    }

    // 邀请返利查询
    async getInviteData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const page = reqBody.page;
        const startDate = reqBody.startdate + ' 00:00:00';
        const endDate = reqBody.enddate + ' 23:59:59';
        const userId = reqBody.userId;
        const pageSize = reqBody.pageSize;
        const startIndex = (page - 1) * pageSize;
        const endIndex = pageSize;
        const dateArray = ctx.getDateByStartAndEnd(startDate, endDate);
        let tabel_name = '';
        for (let i = 0; i < dateArray.length; i++) {
            const date = dateArray[i];
            tabel_name += `Revenue_${date}`;
            if (i !== dateArray.length - 1) {
                tabel_name += ', ';
            }
        }
        const selectSql = `SELECT CreateTime, Description FROM ${tabel_name}`;
        const whereSql = `WHERE WinUserId = ${userId} and CreateTime >= '${startDate}' and CreateTime <= '${endDate}' and Description <> ''`;
        const orderSql = 'ORDER BY ID DESC';
        const limitSql = 'LIMIT ?, ?';
        const sql = `${selectSql} ${whereSql} ${orderSql} ${limitSql}`;
        const data = await ctx.mysqlQueryByGame(sql, [ startIndex, endIndex ]);
        const fmData = data.map(item => {
            item.CreateTime = ctx.transferDate(item.CreateTime);
            item.Conf = item.Description ? JSON.parse(item.Description).Conf : [];
            item.Users = item.Description ? JSON.parse(item.Description).Users : [];
            return item;
        });
        const countSql = `SELECT COUNT(*) AS count FROM ${tabel_name} WHERE WinUserId = ${userId} and CreateTime >= '${startDate}' and CreateTime <= '${endDate}' and Description <> ''`;
        const countResult = await ctx.mysqlQueryByGame(countSql, []);
        const result = {
            onePageData: fmData,
            totalPage: countResult[0].count,
        };
        return result;
    }

    // 查询总返利金
    async getTotalRebate() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const userId = reqBody.userId;
        const sql = 'SELECT RGold FROM InviteUser where UserID = ?';
        const result = await ctx.mysqlQueryByGame(sql, [ userId ]);
        return result[0] ? result[0].RGold : 0;
    }

    // 查询档位输赢数据
    async getUserGearsData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startDate = reqBody.startdate + ' 00:00:00';
        const endDate = reqBody.enddate + ' 23:59:59';
        const userId = reqBody.userId;
        const startIndex = (page - 1) * pageSize;
        const endIndex = pageSize;
        const dateArray = ctx.getDateByStartAndEnd(startDate, endDate);

        let selectSql = 'SELECT * FROM ';
        let whereSql = `WHERE UserId = ${userId} and CreateTime >= '${startDate}' and CreateTime <= '${endDate}' `;

        for (let i = 0; i < dateArray.length; i++) {
            if (i === (dateArray.length - 1)) {
                selectSql += `PlayerRankRecord_${dateArray[i]} ${whereSql}`;
            } else {
                selectSql += `PlayerRankRecord_${dateArray[i]} ${whereSql}UNION SELECT * FROM `;
            }
        }

        const oderSql = 'ORDER BY CreateTime DESC ';
        const limitSql = 'LIMIT ?, ?';
        const sql = selectSql + oderSql + limitSql;
        const result = await ctx.mysqlQueryByGame(sql, [ startIndex, endIndex ]);
        const countData = await ctx.mysqlQueryByGame(selectSql, []);
        const data = {
            onePageData: result,
            totalPage: countData.length,
        };
        return data;
    }

    async activeUserSift() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const queryType = reqBody.queryType;
        if (queryType === app.config.ActiveUserType.RecentActive) {
            return await this.queryRecentActive();
        } else if (queryType === app.config.ActiveUserType.TotalGoldMax) {
            return await this.queryTotalGoldMax();
        } else if (queryType === app.config.ActiveUserType.GearGoldMax) {
            return await this.queryGearGoldMax();
        } else if (queryType === app.config.ActiveUserType.WinGoldMax) {
            return await this.queryWinGoldMax();
        } else if (queryType === app.config.ActiveUserType.GoldMax) {
            return await this.queryGoldMax();
        } else if (queryType === app.config.ActiveUserType.PayInMax) {
            return await this.queryPayInMax();
        } else if (queryType === app.config.ActiveUserType.PayOutMax) {
            return await this.queryPayOutMax();
        } else if (queryType === app.config.ActiveUserType.TeenPattiSessionMax) {
            return await this.queryTeenPattiSessionMax();
        } else if (queryType === app.config.ActiveUserType.RummySessionMax) {
            return await this.queryRummySessionMax();
        } else if (queryType === app.config.ActiveUserType.Rummy2UserSessionMax) {
            return await this.queryRummy2UserSessionMax();
        } else if (queryType === app.config.ActiveUserType.QuickTPSessionMax) {
            return await this.queryQuickTPSessionMax();
        } else if (queryType === app.config.ActiveUserType.Ak47SessionMax) {
            return await this.queryAk47SessionMax();
        } else if (queryType === app.config.ActiveUserType.LowestJokerSessionMax) {
            return await this.queryLowestJokerSessionMax();
        } else if (queryType === app.config.ActiveUserType.HighestJokerSessionMax) {
            return await this.queryHighestJokerSessionMax();
        }
    }
    getSqlUserInfo() {
        const { app } = this;
        const usertable = app.config.TableName.User_Game;
        let select_sql = `date_format(${usertable}.RegTime, '%Y-%m-%d %T') as RegTime,`;
            select_sql += `date_format(${usertable}.LoginTime, '%Y-%m-%d %T') as LoginTime,`;
            select_sql += `${usertable}.FbId as FbId,`;
            select_sql += `${usertable}.FbBusinessToken as FbBusinessToken,`;
            select_sql += `${usertable}.Phone as Phone,`;
            select_sql += `${usertable}.BindUser as BindUser,`;
            select_sql += `${usertable}.Campaign as Campaign,`;
            select_sql += `${usertable}.MediaSource as MediaSource,`;
            select_sql += `${usertable}.DeviceId as DeviceId,`;
            select_sql += `${usertable}.AfStatus as AfStatus,`;
            select_sql += `${usertable}.FirstPay as FirstPay,`;
            select_sql += `${usertable}.isDelete as isDelete,`;
            select_sql += `${usertable}.UserId as UserId,`;
            select_sql += `${usertable}.Account as Account,`;
            select_sql += `${usertable}.NickName as NickName,`;
            select_sql += `${usertable}.Gold as Gold,`;
            select_sql += `${usertable}.WinGold as WinGold,`;
            select_sql += `${usertable}.PayGold as PayGold,`;
            select_sql += `${usertable}.PayWinGold as PayWinGold,`;
            select_sql += `${usertable}.RobotGold as RobotGold,`;
            select_sql += `${usertable}.TotalPayIn as TotalPayIn,`;
            select_sql += `${usertable}.TotalPayOut as TotalPayOut,`;
            select_sql += `${usertable}.ApkId as ApkId,`;
            select_sql += `${usertable}.PackageId as PackageId`;
        return select_sql;
    }

    convertUserInfo(data) {
        const { ctx } = this;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.Gold = ctx.changeClientRatio(element.Gold);
            element.WinGold = ctx.changeClientRatio(element.WinGold);

            element.PayGold = ctx.changeClientRatio(element.PayGold);
            element.PayWinGold = ctx.changeClientRatio(element.PayWinGold);

            element.RobotGold = ctx.changeClientRatio(element.RobotGold);
            element.TotalPayIn = ctx.changeClientRatio(element.TotalPayIn);
            element.TotalPayOut = ctx.changeClientRatio(element.TotalPayOut);
            element.RegTime = ctx.transferDateTime(element.RegTime);
            element.LoginTime = ctx.transferDateTime(element.LoginTime);
        }
        return data;
    }

    getReqBody() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const startDate = reqBody.startdate;
        const endDate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const pageMax = pageSize;
        const startPage = (page - 1) * pageMax;
        return { apkId, startDate, endDate, pageMax, startPage };
    }

    // 最近活跃
    async queryRecentActive() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const select_1 = `(select distinct ${sessiontable}.UserId from ${sessiontable} join ${usertable} on ${usertable}.UserId = ${sessiontable}.UserId where ApkId = ? and date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? order by ${sessiontable}.CreateTime desc limit ?, ?) t`;
        const select_2 = `(select UserId from ${select_1})`;
        let sql = `select * from ${usertable} where UserId in ${select_2}`;
        let result = await ctx.mysqlQueryByGame(sql, [ apkId, startDate, endDate, 0, 50 ]);
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const select_1_count = `(select distinct ${sessiontable}.UserId from ${sessiontable} join ${usertable} on ${usertable}.UserId = ${sessiontable}.UserId where ApkId = ? and date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ?)`;
        // const sql_count = `select count(UserId) as total from ${usertable} where UserId in ${select_1_count}`;
        // const result_count = await ctx.mysqlQueryByGame(sql_count, [ apkId, startDate, endDate ]);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // 总金币最多
    async queryTotalGoldMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const logintable = app.config.TableName.Login_log;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}`;
        let sql = `from ${usertable} join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
        sql += ` where date(${logintable}.Login_day) >= ? and date(${logintable}.Login_day) < ? and ${usertable}.ApkId = ?`;
        let order_sql = `order by (${usertable}.Gold / 10000 + ${usertable}.WinGold /10000 + ${usertable}.PayGold / 10000 + ${usertable}.PayWinGold / 10000) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // 档位金币最多
    async queryGearGoldMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const logintable = app.config.TableName.Login_log;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}`;
        let sql = `from ${usertable} join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
        sql += ` where date(${logintable}.Login_day) >= ? and date(${logintable}.Login_day) < ? and ${usertable}.ApkId = ?`;
        let order_sql = `order by ${usertable}.RobotGold desc limit ?, ?`;
        let params = [ startDate, endDate, apkId ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // 可提现最多
    async queryWinGoldMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const logintable = app.config.TableName.Login_log;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}`;
        let sql = `from ${usertable} join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
        sql += ` where date(${logintable}.Login_day) >= ? and date(${logintable}.Login_day) < ? and ${usertable}.ApkId = ?`;
        let order_sql = `order by (${usertable}.WinGold / 10000 + ${usertable}.PayWinGold / 10000) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // 不可提现最多
    async queryGoldMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const logintable = app.config.TableName.Login_log;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}`;
        let sql = `from ${usertable} join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
        sql += ` where date(${logintable}.Login_day) >= ? and date(${logintable}.Login_day) < ? and ${usertable}.ApkId = ?`;
        let order_sql = `order by (${usertable}.Gold / 10000 + ${usertable}.PayGold / 10000) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // 充值最多
    async queryPayInMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const logintable = app.config.TableName.Login_log;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}`;
        let sql = `from ${usertable} join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
        sql += ` where date(${logintable}.Login_day) >= ? and date(${logintable}.Login_day) < ? and ${usertable}.ApkId = ? and ${usertable}.TotalPayIn > 0`;
        let order_sql = `order by ${usertable}.TotalPayIn desc limit ?, ?`;
        let params = [ startDate, endDate, apkId ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // 提现最多
    async queryPayOutMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const logintable = app.config.TableName.Login_log;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}`;
        let sql = `from ${usertable} join ${logintable} on ${usertable}.UserId = ${logintable}.UserId`;
        sql += ` where date(${logintable}.Login_day) >= ? and date(${logintable}.Login_day) < ? and ${usertable}.ApkId = ? and ${usertable}.TotalPayOut > 0`;
        let order_sql = `order by ${usertable}.TotalPayOut desc limit ?, ?`;
        let params = [ startDate, endDate, apkId ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // TeenPatti场次最多
    async queryTeenPattiSessionMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}, count(${sessiontable}.UserId) as TotalSession`;
        let sql = `from ${usertable} join ${sessiontable} on ${usertable}.UserId = ${sessiontable}.UserId`;
        sql += ` where date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? and ${usertable}.ApkId = ? and GameName = ? and RoomLevel != ?`;
        let order_sql = `group by ${sessiontable}.UserId order by count(${sessiontable}.UserId) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId, 'TeenPatti', 'PracticeArena' ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    // Rummy场次最多
    async queryRummySessionMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}, count(${sessiontable}.UserId) as TotalSession`;
        let sql = `from ${usertable} join ${sessiontable} on ${usertable}.UserId = ${sessiontable}.UserId`;
        sql += ` where date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? and ${usertable}.ApkId = ? and GameName = ?`;
        let order_sql = `group by ${sessiontable}.UserId order by count(${sessiontable}.UserId) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId, 'Rummy' ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    async queryRummy2UserSessionMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}, count(${sessiontable}.UserId) as TotalSession`;
        let sql = `from ${usertable} join ${sessiontable} on ${usertable}.UserId = ${sessiontable}.UserId`;
        sql += ` where date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? and ${usertable}.ApkId = ? and GameName = ?`;
        let order_sql = `group by ${sessiontable}.UserId order by count(${sessiontable}.UserId) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId, 'Rummy2User' ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    async queryQuickTPSessionMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}, count(${sessiontable}.UserId) as TotalSession`;
        let sql = `from ${usertable} join ${sessiontable} on ${usertable}.UserId = ${sessiontable}.UserId`;
        sql += ` where date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? and ${usertable}.ApkId = ? and GameName = ?`;
        let order_sql = `group by ${sessiontable}.UserId order by count(${sessiontable}.UserId) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId, 'QuickTP' ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    async queryAk47SessionMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}, count(${sessiontable}.UserId) as TotalSession`;
        let sql = `from ${usertable} join ${sessiontable} on ${usertable}.UserId = ${sessiontable}.UserId`;
        sql += ` where date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? and ${usertable}.ApkId = ? and GameName = ?`;
        let order_sql = `group by ${sessiontable}.UserId order by count(${sessiontable}.UserId) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId, 'Ak47' ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    async queryLowestJokerSessionMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}, count(${sessiontable}.UserId) as TotalSession`;
        let sql = `from ${usertable} join ${sessiontable} on ${usertable}.UserId = ${sessiontable}.UserId`;
        sql += ` where date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? and ${usertable}.ApkId = ? and GameName = ?`;
        let order_sql = `group by ${sessiontable}.UserId order by count(${sessiontable}.UserId) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId, 'LowJoker' ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }
    async queryHighestJokerSessionMax() {
        const { ctx, app } = this;
        const { apkId, startDate, endDate, pageMax } = this.getReqBody();
        const sessiontable = `${app.config.TableName.PlayerRecord}${ctx.transferMonth(endDate)}`;
        const usertable = app.config.TableName.User_Game;
        const sql_info = `distinct ${this.getSqlUserInfo()}, count(${sessiontable}.UserId) as TotalSession`;
        let sql = `from ${usertable} join ${sessiontable} on ${usertable}.UserId = ${sessiontable}.UserId`;
        sql += ` where date(${sessiontable}.CreateTime) >= ? and date(${sessiontable}.CreateTime) < ? and ${usertable}.ApkId = ? and GameName = ?`;
        let order_sql = `group by ${sessiontable}.UserId order by count(${sessiontable}.UserId) desc limit ?, ?`;
        let params = [ startDate, endDate, apkId, 'HighJoker' ];
        let order_params = [ 0, 50 ];
        let result = await ctx.mysqlQueryByGame(`select ${sql_info} ${sql} ${order_sql}`, params.concat(order_params));
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        // result = this.convertUserInfo(result);
        // const sql_count_info = `count(distinct ${usertable}.UserId) as total`;
        // const result_count = await ctx.mysqlQueryByGame(`select ${sql_count_info} ${sql}`, params);
        // data = { data: result, total: result_count.length === 0 ? 1 : result_count[0].total };
        let onePageData = pageDevice.doPage(ctx.request.body.page, pageMax, result);
        onePageData = this.convertUserInfo(onePageData);
        data = { data: onePageData, total: result.length };
        return data;
    }

    async getGoldData() {
        const { ctx, app } = this;
        const dbName = 'GoldStat';
        const reqBody = ctx.request.body;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const pageMax = pageSize;
        const sql = `select * from ${dbName} where Date >= ? and Date < ? order by Date desc limit ?, ?`;
        const params = [ startdate, enddate, startPage, pageMax ];
        const result = await ctx.mysqlQueryByGame(sql, params);
        for (let i = 0; i < result.length; i++) {
            result[i].Date = ctx.transferDate(result[i].Date);
            result[i].RevenueTotal = result[i].RevenueGive + result[i].RevenuePayin;
            for (let key in result[i]) {
                if (key !== 'ID' && key !== 'Date') {
                    result[i][key] = ctx.changeClientRatio(result[i][key]);
                }
            }
        }
        // 查询当天数据
        let dayData = {
            Date: ctx.transferDate(new Date()),
            PlayerGive: 0,
            PlayerPayin: 0,
            RbWinGive: 0,
            RbWinPay: 0,
            RbLoseGold: 0,
            RevenueGive: 0,
            RevenuePayin: 0,
            PayoutGive: 0,
            PayoutPayin: 0,
            RevenueTotal: 0,
            Jackpot: 0,
            PlayerWinAi: 0,
            AiWinPlayer: 0,
        };
        const serverData = await ctx.httpGet(app.config.GetGoldStat);
        if (serverData && serverData.config) {
            dayData = serverData.config;
            dayData.RevenueTotal = serverData.config.RevenueGive + serverData.config.RevenuePayin;
            for (let key in dayData) {
                dayData[key] = ctx.changeClientRatio(dayData[key]);
            }
            dayData.Date = serverData.date;
        }
        if (page === 1 && reqBody.enddate === ctx.transferDate(new Date())) {
            result.unshift(dayData);
        }
        // 查询数据总数
        const countSql = `select count(*) as total from ${dbName} where Date >= ? and Date < ?`;
        const countResult = await ctx.mysqlQueryByGame(countSql, params);
        const data = {
            data: result,
            total: countResult[0].total,
        };
        return data;
    }

}

module.exports = UserService;
