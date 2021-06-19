'use strict';


const Service = require('egg').Service;
const pageDevice = require('../utils/DevicePage');
const typeData = require('../common/ChargeType');

class HistoryService extends Service {

    // 获取充值数据
    async getRechargeData() {
        return await this.queryTableDataForRecharge('recharge_data');
    }

    // 获取用户留存
    async getUserKeep() {
        return await this.queryTableDataForUserKeep('user_keep_data');
    }

    // 活跃数据
    async getActiveData() {
        return await this.queryTableDataForActive('active_data');
    }

    // 用户画像
    async getUserData() {
        const result = await this.queryTableDataForUser();
        const numbers = await this.getGameTimes();
        result.numbers = numbers;
        return result;
    }

    async queryTableDataForRecharge(tablename) {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const packageId = reqBody.package_id;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;

        let params = [ startdate, enddate, apkId ];

        const sumSql = `date, apk_id, package_id,
                    sum(activate) as activate,
                    sum(register) as register,
                    ifnull(round(sum(register) / sum(activate) * 100, 2), 0) as register_rate,
                    sum(dau) as dau,
                    sum(dau_old) as dau_old,
                    round(sum(recharge_count), 2) as recharge_count,
                    round(sum(recharge_count_new), 2) as recharge_count_new,
                    round(sum(witddraw_count), 2) as witddraw_count,
                    round(sum(witddraw_real_count), 2) as witddraw_real_count,
                    round(sum(tax_count), 2) as tax_count,
                    round(sum(tax_rebate_count), 2) as tax_rebate_count,
                    sum(recharge_users) as recharge_users,
                    sum(recharge_users_new) as recharge_users_new,

                    sum(recharge_users_old) as recharge_users_old,
                    sum(recharge_count_old) as recharge_count_old,
                    sum(recharge_users_rep) as recharge_users_rep,
                    sum(recharge_count_rep) as recharge_count_rep,

                    sum(withdraw_users) as withdraw_users,
                    ifnull(round(sum(recharge_count_new) / sum(register), 2), 0) as arpu_register,
                    ifnull(round(sum(recharge_count) / sum(dau), 2), 0) as arpu_dau,
                    ifnull(round(sum(recharge_count) / sum(recharge_users), 2), 0) as arpu_recharge,
                    ifnull(round(sum(recharge_users) / sum(dau) * 100, 2), 0) as pay_rate,
                    ifnull(round(sum(recharge_users_new) / sum(register) * 100, 2), 0) as pay_rate_new,
                    ifnull(round(sum(withdraw_users) / sum(dau) * 100, 2), 0) as withdraw_rate`;
                    // round(avg(arpu_register), 2) as arpu_register,
                    // round(avg(arpu_dau), 2) as arpu_dau,
                    // round(avg(arpu_recharge), 2) as arpu_recharge,
                    // round(avg(pay_rate), 2) as pay_rate,
                    // round(avg(pay_rate_new), 2) as pay_rate_new,
                    // round(avg(withdraw_rate), 2) as withdraw_rate`;

        const selectSql = `select ${sumSql} from ${tablename}`;
        let whereSql = 'where date >= ? and date < ? and apk_id = ?';
        if (packageId !== app.config.All) {
            whereSql += ' and package_id = ?';
            params.push(packageId);
        }
        const groupSql = 'group by date';
        const orderSql = 'order by date desc';
        const limitSql = 'limit ?, ?';
        const sql = `${selectSql} ${whereSql} ${groupSql} ${orderSql} ${limitSql}`;

        const startPage = (page - 1) * pageSize;
        params.push(startPage);
        params.push(pageSize);

        let result = await ctx.mysqlQueryByLocal(sql, params);
        let data = { data: [], total: 1 };
        if (result.length === 0) {
            return data;
        }
        this.logger.info('result : ', JSON.stringify(result));

        for (let i = 0; i < result.length; i++) {
            let item = result[i];
            if (item.date) {
                item.date = ctx.transferDate(item.date);
            }
            item.recharge_users_old = item.recharge_users_old ? item.recharge_users_old : 0;
            item.recharge_count_old = item.recharge_count_old ? item.recharge_count_old : 0;
            item.recharge_users_rep = item.recharge_users_rep ? item.recharge_users_rep : 0;
            item.recharge_count_rep = item.recharge_count_rep ? item.recharge_count_rep : 0;
            if (packageId === app.config.All) {
                item.package_id = app.config.All;
            }
        }
        let countParams = [ startdate, enddate, apkId ];
        let countSql = `select ifnull(count(*), 0) as total from ${tablename} where date >= ? and date < ? and apk_id = ?`;
        if (packageId !== app.config.All) {
            countSql += ' and package_id = ?';
            countParams.push(packageId);
        }
        countSql += ' group by date';
        const countResult = await ctx.mysqlQueryByLocal(countSql, countParams);
        this.logger.info('countResult : ', JSON.stringify(countResult));
        data = { data: result, total: countResult.length === 0 ? 1 : countResult.length };
        return data;
    }

    async getSessionData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const game_select = reqBody.game_select;
        const startdate = `${reqBody.startdate} 00:00:00`;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        // 获取玩法对应的场次名称
        const jsonData = await ctx.service.upload.getUploadDataByType(game_select);
        let namelist = [];
        if (jsonData) {
            for (let i = 0; i < jsonData.length; i++) {
                const ele = jsonData[i];
                namelist.push(ele.session_name);
            }
        }

        // 获取日期之间的所有表名
        const dateArr = ctx.getDateByStartAndEnd(reqBody.startdate, reqBody.enddate);
        let title = [];
        title.push({ key: 'createDate', name: '日期' });
        title.push({ key: 'total', name: '总场次' });
        let sessionSql = 'date(CreateTime) as createDate';
        if (game_select === app.config.UploadFileType.Practice) {
            sessionSql += ', count(*) as total';
        } else {
            for (let i = 0; i < namelist.length; i++) {
                const name = namelist[i];
                title.push({ key: name, name });
                sessionSql += `, count(RoomLevel = '${name}' or null) as '${name}'`;
            }
        }
        let selectSql = `SELECT ${sessionSql} FROM `;
        let whereSql = `where CreateTime >= '${startdate}' and CreateTime < '${enddate}'`;
        if (game_select === app.config.UploadFileType.Practice) {
            whereSql += ' and GameName = "TeenPatti" and RoomLevel = "PracticeArena"';
        } else if (game_select === app.config.UploadFileType.SessionRummy) {
            whereSql += ' and GameName = "Rummy"';
        } else if (game_select === app.config.UploadFileType.SessionTeenPatti) {
            whereSql += ' and GameName = "TeenPatti" and RoomLevel != "PracticeArena"';
        } else if (game_select === app.config.UploadFileType.TwoPersonsRummy) {
            whereSql += ' and GameName = "Rummy2User"';
        } else if (game_select === app.config.UploadFileType.SessionTeenPattiSpeed) {
            whereSql += ' and GameName = "QuickTP"';
        } else if (game_select === app.config.UploadFileType.AK47) {
            whereSql += ' and GameName = "Ak47"';
        } else if (game_select === app.config.UploadFileType.LowestJoker) {
            whereSql += ' and GameName = "LowJoker"';
        } else if (game_select === app.config.UploadFileType.HighestJoker) {
            whereSql += ' and GameName = "HighJoker"';
        } else if (game_select === app.config.UploadFileType.DragonVSTiger) {
            whereSql += ' and GameName = "DragonVSTiger"';
        }
        const groupSql = 'group by date(createDate)';
        for (let i = 0; i < dateArr.length; i++) {
            if (i === (dateArr.length - 1)) {
                selectSql += `RoundRecord_${dateArr[i]} ${whereSql} ${groupSql}`;
            } else {
                selectSql += `RoundRecord_${dateArr[i]} ${whereSql} ${groupSql} UNION ${selectSql} `;
            }
        }
        const orderSql = 'order by date(createDate) desc';
        const sql = `${selectSql} ${orderSql}`;
        let result = await ctx.mysqlQueryByGame(sql, []);
        let data = { data: [], total: 1, title };
        if (result.length === 0) {
            return data;
        }
        let onePageData = [];
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const endPage = startPage + pageSize;
        for (let i = startPage; i < endPage; i++) {
            if (i < result.length && result[i]) {
                const item = result[i];
                item.createDate = ctx.transferDate(item.createDate);
                if (game_select !== app.config.UploadFileType.Practice) {
                    item.total = 0;
                    for (const key in item) {
                        if (key !== 'createDate' && key !== 'total') {
                            if (Object.hasOwnProperty.call(item, key)) {
                                item.total += item[key];
                            }
                        }
                    }
                }
                onePageData.push(item);
            }
        }
        data = { data: onePageData, total: result.length, title };
        return data;

    }
    async getPlayGameData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const startdate = `${reqBody.startdate} 00:00:00`;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const type = reqBody.type;
        const dbName = 'PlayerRobotStat';
        const sql = `SELECT * FROM ${dbName} WHERE CreateTime >= ? and CreateTime < ? and GameName = ? order by CreateTime desc limit ?, ?`;
        const params = [ startdate, enddate, type, startPage, pageSize ];
        const result = await ctx.mysqlQueryByGame(sql, params);
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            item.CreateTime = ctx.transferDate(item.CreateTime);
        }
        const countSql = `SELECT COUNT(*) AS count FROM ${dbName} WHERE CreateTime >= ? and CreateTime < ? and GameName = ?`;
        const countParams = [ startdate, enddate, type, startPage, pageSize ];
        const countResult = await ctx.mysqlQueryByGame(countSql, countParams);
        const data = {
            data: result,
            total: countResult[0].count,
        };
        return data;
    }

    async getGoldSurplusData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const startdate = `${reqBody.startdate} 00:00:00`;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const type = reqBody.type;
        const dbName = 'gold_surplus';
        const sql = `SELECT * FROM ${dbName} WHERE date >= ? and date < ? and type = ? order by date desc limit ?, ?`;
        const params = [ startdate, enddate, type, startPage, pageSize ];
        const result = await ctx.mysqlQueryByLocal(sql, params);
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            item.date = ctx.transferDate(item.date);
        }
        const countSql = `SELECT COUNT(*) AS count FROM ${dbName} WHERE date >= ? and date < ? and type = ?`;
        const countParams = [ startdate, enddate, type, startPage, pageSize ];
        const countResult = await ctx.mysqlQueryByLocal(countSql, countParams);
        const data = {
            data: result,
            total: countResult[0].count,
        };
        return data;
    }

    async getOptionData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const medSql = 'SELECT DISTINCT(MediaSourceId) as MediaSource, CampaignId FROM active_data WHERE ApkId = ? and create_date >= ? and create_date < ?';
        const mediasourcesData = await ctx.mysqlQueryByLocal(medSql, [ apkId, startdate, enddate ]);
        let data = [];
        for (let i = 0; i < mediasourcesData.length; i++) {
            const item = mediasourcesData[i];
            let lastdata = data.find(sub => {
                return sub.MediaSource === item.MediaSource;
            });
            if (lastdata) {
                lastdata.Campaigns.push(item.CampaignId);
            } else {
                data.push({ MediaSource: item.MediaSource, Campaigns: [ 'All', item.CampaignId ] });
            }
        }
        if (data.length > 0) {
            data.unshift({ MediaSource: 'All' });
        }
        return data;
    }

    async queryTableDataForActive(tablename) {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apkId;
        const mediasources = reqBody.mediasources;
        const campaignId = reqBody.campaignId;
        const startdate = `${reqBody.startdate} 00:00:00`;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageMax = reqBody.pageSize;
        const selectSql = `select * from ${tablename}`;
        const orderSql = 'order by create_date desc';
        let whereSql;
        let params;
        let result;
        if (apkId === 'All') {
            whereSql = 'where create_date >= ? and create_date < ?';
            const sql = `${selectSql} ${whereSql} ${orderSql}`;
            params = [ startdate, enddate ];
            const data = await ctx.mysqlQueryByLocal(sql, params);
            const dateSql = `select DISTINCT create_date from ${tablename} where create_date >= ? and create_date < ?`;
            const dates = await ctx.mysqlQueryByLocal(dateSql, params);
            const dataArr = dates.map(item => {
                return ctx.transferDate(item.create_date);
            });
            result = await this.dataFormat(ctx, dataArr, data);
        } else if (apkId !== 'All' && mediasources === 'All') {
            whereSql = 'where create_date >= ? and create_date < ? and ApkId = ?';
            const sql = `${selectSql} ${whereSql} ${orderSql}`;
            params = [ startdate, enddate, apkId ];
            const data = await ctx.mysqlQueryByLocal(sql, params);

            const dateSql = `select DISTINCT create_date from ${tablename} where create_date >= ? and create_date < ? and ApkId = ?`;
            const dates = await ctx.mysqlQueryByLocal(dateSql, params);
            const dataArr = dates.map(item => {
                return ctx.transferDate(item.create_date);
            });

            result = await this.dataFormat(ctx, dataArr, data);
        } else if (apkId !== 'All' && mediasources !== 'All' && campaignId === 'All') {
            whereSql = 'where create_date >= ? and create_date < ? and ApkId = ? and MediaSourceId = ?';
            const sql = `${selectSql} ${whereSql} ${orderSql}`;
            params = [ startdate, enddate, apkId, mediasources ];
            const data = await ctx.mysqlQueryByLocal(sql, params);

            const dateSql = `select DISTINCT create_date from ${tablename} where create_date >= ? and create_date < ? and ApkId = ? and MediaSourceId = ?`;
            const dates = await ctx.mysqlQueryByLocal(dateSql, params);
            const dataArr = dates.map(item => {
                return ctx.transferDate(item.create_date);
            });

            result = await this.dataFormat(ctx, dataArr, data);
        } else {
            whereSql = 'where create_date >= ? and create_date < ? and ApkId = ? and MediaSourceId = ? and CampaignId = ?';
            const sql = `${selectSql} ${whereSql} ${orderSql}`;
            params = [ startdate, enddate, apkId, mediasources, campaignId ];
            result = await ctx.mysqlQueryByLocal(sql, params);
        }

        for (let i = 0; i < result.length; i++) {
            let item = result[i];
            for (let key in item) {
                if (item[key] === null) {
                    item[key] = 0;
                }
            }
            if (item.create_date) {
                item.create_date = ctx.transferDate(item.create_date);
            }
        }
        const onePageData = pageDevice.doPage(page, pageMax, result);
        const data = { data: onePageData, total: result.length };

        return data;
    }

    async dataFormat(ctx, dates, result) {
        const dataArr = [];
        // 合并同一个时间内的数据，将数值累加
        dates.forEach(item1 => {
            const obj = {
                create_date: item1,
                online_max: 0,

                login_users: 0,
                new_users: 0,
                new_fb_user: 0,
                new_phone_user: 0,
                new_guest: 0,

                recharge_users: 0,
                new_recharge_users: 0,

                rummy_number: 0,
                user2rummy_number: 0,
                teenpatti_number: 0,
                speed_teenpatti_number: 0,
                relation_number: 0,

                noGame: 0,
                noGame_fb: 0,
                noGame_phone: 0,
                noGame_tourist: 0,
                noSign: 0,
                noSign_fb: 0,
                noSign_phone: 0,
                noSign_tourist: 0,
                // one_day_residue: 0,

                noWheel_total: 0,
                noWheel_fb: 0,
                noWheel_ph: 0,
                noWheel_tourist: 0,
            };
            result.forEach(item2 => {
                const time = ctx.transferDate(item2.create_date);
                if (item1 === time) {
                    obj.online_max = item2.online_max;

                    obj.login_users += item2.login_users;
                    obj.new_users += item2.new_users;
                    obj.new_fb_user += item2.new_fb_user;
                    obj.new_phone_user += item2.new_phone_user;
                    obj.new_guest += item2.new_guest;
                    obj.recharge_users += item2.recharge_users;
                    obj.new_recharge_users += item2.new_recharge_users;

                    obj.rummy_number = item2.rummy_number;
                    obj.user2rummy_number = item2.user2rummy_number;
                    obj.teenpatti_number = item2.teenpatti_number;
                    obj.speed_teenpatti_number = item2.speed_teenpatti_number;
                    obj.relation_number = item2.relation_number;

                    obj.noGame += item2.noGame;
                    obj.noGame_fb += item2.noGame_fb;
                    obj.noGame_phone += item2.noGame_phone;
                    obj.noGame_tourist += item2.noGame_tourist;
                    obj.noSign += item2.noSign;
                    obj.noSign_fb += item2.noSign_fb;
                    obj.noSign_phone += item2.noSign_phone;
                    obj.noSign_tourist += item2.noSign_tourist;
                    // obj.one_day_residue += item2.one_day_residue;
                    obj.noWheel_total += item2.noWheel_total;
                    obj.noWheel_fb += item2.noWheel_fb;
                    obj.noWheel_ph += item2.noWheel_ph;
                    obj.noWheel_tourist += item2.noWheel_tourist;
                }
            });
            dataArr.push(obj);
        });
        // 对合并的结果按时间降序排序
        dataArr.sort((a, b) => {
            return Date.parse(b.create_date) - Date.parse(a.create_date);
        });
        return dataArr;
    }

    async queryTableDataForUser() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const startdate = `${reqBody.startdate} 00:00:00`;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const userId = reqBody.userId;
        const page = reqBody.page;
        const pageMax = reqBody.pageSize;
        const type = reqBody.type;
        // 获取日期间的所有表名
        const dateArr = ctx.getDateByStartAndEnd(reqBody.startdate, reqBody.enddate);
        let tabel_name = '';
        for (let i = 0; i < dateArr.length; i++) {
            const date = dateArr[i];
            tabel_name += `Charge_${date}`;
            if (i !== dateArr.length - 1) {
                tabel_name += ', ';
            }
        }
        let selectSql = `select * from ${tabel_name}`;
        let whereSql = ' WHERE UserId = ? and CreateTime >= ? and CreateTime < ?';
        let values = [];
        if (type !== 0) {
            switch (type) {
                case 1:
                    values = [ 1, 2, 3, 4, 5, 102, 103 ];
                   break;
                case 2:
                    values = [ 106, 117, 118, 119, 120, 121 ];
                   break;
                case 3:
                    values = [ 8, 9, 107, 112 ];
                   break;
                case 4:
                    values = [ 108, 109, 110, 111, 113, 115, 116 ];
                   break;
                case 5:
                    values = [ 6, 7, 100, 101, 104, 105, 114 ];
                   break;
                default:
                    values = [];
            }
        }
        if (values.length > 0) {
            whereSql += ` and ChgType in (${values})`;
        }
        const orderSql = ' order by ID desc';
        const limitSql = ' limit ?, ?';
        const sql = selectSql + whereSql + orderSql + limitSql;
        const startPage = (page - 1) * pageMax;
        const params = [ userId, startdate, enddate, startPage, pageMax ];
        let result = await ctx.mysqlQueryByGame(sql, params);
        const onePageData = [];
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                let data = result[i];
                if (data != null) {
                    onePageData[i] = {};
                    onePageData[i].datetime = ctx.transferDateTime(data.CreateTime);
                    onePageData[i].userId = data.UserId;
                    onePageData[i].access = typeData[data.ChgType] ? typeData[data.ChgType] : data.ChgType;
                    onePageData[i].coinNum = data.ChgType < 100 ? '-' + ctx.changeClientRatio(data.CoinNum) : '+' + ctx.changeClientRatio(data.CoinNum);
                    onePageData[i].balance = ctx.changeClientRatio(data.Balance);
                }
            }
        }
        let countSql = `select COUNT(*) as total from ${tabel_name} WHERE UserId = ? and CreateTime >= ? and CreateTime < ?`;
        if (values.length > 0) {
            countSql += ` and ChgType in (${values})`;
        }
        const count = await ctx.mysqlQueryByGame(countSql, [ userId, startdate, enddate ]);
        const data = { data: onePageData, total: count[0].total };
        return data;
    }
    async getGameTimes() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const startDate = `${reqBody.startdate} 00:00:00`;
        const endDate = ctx.getAfterDate(reqBody.enddate);
        const userId = reqBody.userId;
        // 获取日期之间的所有表名
        const dateArr = ctx.getDateByStartAndEnd(reqBody.startdate, reqBody.enddate);
        let tabel_name = '';
        for (let i = 0; i < dateArr.length; i++) {
            const date = dateArr[i];
            tabel_name += `PlayerRankRecord_${date}`;
            if (i !== dateArr.length - 1) {
                tabel_name += ', ';
            }
        }
        // rummy场次
        const sql = `SELECT COUNT(*) as rummy_session FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ?`;
        const result = await ctx.mysqlQueryByGame(sql, [ 'Rummy', startDate, endDate, userId ]);
        // teenpatti场次
        const sql2 = `SELECT COUNT(*) as teenpatti_session FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ? and RoomLevel <> ?`;
        const result2 = await ctx.mysqlQueryByGame(sql2, [ 'Teenpatti', startDate, endDate, userId, 'PracticeArena' ]);
        // 练习场场次
        const sql3 = `SELECT COUNT(*) as practice_session FROM ${tabel_name} WHERE RoomLevel = ? and CreateTime >= ? and CreateTime < ? and UserId = ?`;
        const result3 = await ctx.mysqlQueryByGame(sql3, [ 'PracticeArena', startDate, endDate, userId ]);

        // Rummy胜率
        const sql4 = `SELECT COUNT(*) as rummy_count FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ? and IsWinner = ?`;
        const result4 = await ctx.mysqlQueryByGame(sql4, [ 'Rummy', startDate, endDate, userId, 1 ]);
        const rummyWinRate = (result4[0].rummy_count / result[0].rummy_session).toFixed(2);

        // TeenPatti胜率
        const sql5 = `SELECT COUNT(*) as teenpatti_count FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ? and IsWinner = ?`;
        const result5 = await ctx.mysqlQueryByGame(sql5, [ 'TeenPatti', startDate, endDate, userId, 1 ]);
        const teenpattiWinRate = (result5[0].teenpatti_count / result2[0].teenpatti_session).toFixed(2);

        const lastOne = userId.substr(userId.length - 1, 1);

        // PlayerGameStat_ 表中 UserId GameName RoomLevel三个字段为一组联合索引，RoomLevel = '' 记录了总连赢和连输
        const tabel_name2 = `PlayerGameStat_${lastOne}`;

        // rummy最大连赢和连输把数
        const sql6 = `SELECT  MaxWinStreak as rummy_winning, MaxLoseStreak as rummy_losing FROM ${tabel_name2} WHERE UserId = ? and GameName = ? and RoomLevel = ?`;
        const result6 = await ctx.mysqlQueryByGame(sql6, [ userId, 'Rummy', '' ]);

        // TeenPatti最大连赢和连输把数
        const sql7 = `SELECT  MaxWinStreak as teenpatti_winning, MaxLoseStreak as teenpatti_losing FROM ${tabel_name2} WHERE UserId = ? and GameName = ? and RoomLevel = ?`;
        const result7 = await ctx.mysqlQueryByGame(sql7, [ userId, 'TeenPatti', '' ]);
        const winningAndLosing = {
            rummy_winning: result6[0] && result6[0].rummy_winning ? result6[0].rummy_winning : 0,
            rummy_losing: result6[0] && result6[0].rummy_losing ? result6[0].rummy_losing : 0,
            teenpatti_winning: result7[0] && result7[0].teenpatti_winning ? result7[0].teenpatti_winning : 0,
            teenpatti_losing: result7[0] && result7[0].teenpatti_losing ? result7[0].teenpatti_losing : 0,
        };
        // 签到领取总额
        let tabel_name3 = '';
        for (let i = 0; i < dateArr.length; i++) {
            const date = dateArr[i];
            tabel_name3 += `Charge_${date}`;
            if (i !== dateArr.length - 1) {
                tabel_name3 += ', ';
            }
        }
        const sql8 = `SELECT ifnull(SUM(CoinNum), 0) as signin_total_money FROM ${tabel_name3} WHERE UserId = ? and ChgType = ?`;
        const result8 = await ctx.mysqlQueryByGame(sql8, [ userId, 113 ]);
        if (result8[0].signin_total_money) {
            result8[0].signin_total_money = ctx.changeClientRatio(result8[0].signin_total_money);
        }
        // 转盘领取总金额
        const sql9 = `SELECT ifnull(SUM(CoinNum), 0)  as turntable_total_money FROM ${tabel_name3} WHERE UserId = ? and ChgType = ?`;
        const result9 = await ctx.mysqlQueryByGame(sql9, [ userId, 115 ]);
        if (result9[0].turntable_total_money) {
            result9[0].turntable_total_money = ctx.changeClientRatio(result9[0].turntable_total_money);
        }

        // 二人rummy把数
        const sql10 = `SELECT COUNT(*) as rummy_two_count FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ?`;
        const result10 = await ctx.mysqlQueryByGame(sql10, [ 'rummy2User', startDate, endDate, userId ]);

        // 二人rummy胜率
        const rummyTwoWinnerSql = `SELECT COUNT(*) as rummy_two_count FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ? and IsWinner = ?`;
        const rummyTwoWinner = await ctx.mysqlQueryByGame(rummyTwoWinnerSql, [ 'rummy2User', startDate, endDate, userId, 1 ]);
        const rummyTwoWinRate = (rummyTwoWinner[0].rummy_two_count / result10[0].rummy_two_count).toFixed(2);

        // 快速TP把数
        const sql11 = `SELECT COUNT(*) as quick_tp_count FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ?`;

        const result11 = await ctx.mysqlQueryByGame(sql11, [ 'QuickTP', startDate, endDate, userId ]);
        // 快速TP胜率
        const quickSql = `SELECT COUNT(*) as quick_tp_count FROM ${tabel_name} WHERE GameName = ? and CreateTime >= ? and CreateTime < ? and UserId = ? and IsWinner = ?`;
        const quickTeenpatti = await ctx.mysqlQueryByGame(quickSql, [ 'QuickTP', startDate, endDate, userId, 1 ]);
        const quickTeenpattiWinRate = (quickTeenpatti[0].quick_tp_count / result11[0].quick_tp_count).toFixed(2);
        const WinRate = {
            rummy_win_rate: isNaN(rummyWinRate) ? 0 : ctx.changeServerRatioBy100(rummyWinRate),
            rummy_two_win_rate: isNaN(rummyTwoWinRate) ? 0 : ctx.changeServerRatioBy100(rummyTwoWinRate),
            teenpatti_win_rate: isNaN(teenpattiWinRate) ? 0 : ctx.changeServerRatioBy100(teenpattiWinRate),
            quick_teenpatti_win_rate: isNaN(quickTeenpattiWinRate) ? 0 : ctx.changeServerRatioBy100(quickTeenpattiWinRate),
        };
        const obj = Object.assign({}, result[0], result2[0], result3[0], result4[0], result5[0], winningAndLosing, WinRate, result8[0], result9[0], result10[0], result11[0]);
        return obj;
    }

    async queryTableDataForUserKeep(tablename) {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const startDate = `${reqBody.startdate} 00:00:00`;
        const endDate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageMax = app.config.PageSize;
        const startPage = (page - 1) * pageMax;
        const apkId = reqBody.apk_id;
        const packageId = reqBody.package_id;

        let params = [ startDate, endDate, apkId ];
        const selectSql = `SELECT * FROM ${tablename}`;
        let whereSql = 'where date >= ? and date < ? and apk_id = ?';
        if (packageId !== app.config.All) {
            whereSql += ' and package_id = ?';
            params.push(packageId);
        }
        const orderSql = 'order by date desc';
        const limitSql = 'limit ?, ?';
        const sql = `${selectSql} ${whereSql} ${orderSql} ${limitSql}`;
        params.push(startPage);
        params.push(pageMax);
        let result = await ctx.mysqlQueryByLocal(sql, params);
        for (let i = 0; i < result.length; i++) {
            let item = result[i];
            if (item.date) {
                item.date = ctx.transferDate(item.date);
            }
            if (packageId === app.config.All) {
                item.package_id = app.config.All;
            }
        }
        let countParams = [ startDate, endDate, apkId ];
        let countSql = `select count(*) as total from ${tablename} where date >= ? and date <= ? and apk_id = ?`;
        if (packageId !== app.config.All) {
            countSql += ' and package_id = ?';
            countParams.push(packageId);
        }
        const countResult = await ctx.mysqlQueryByLocal(countSql, countParams);
        const totalCount = countResult[0].total;
        const data = { data: result, total: totalCount };
        return data;
    }

    async getImportantData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const page = reqBody.page;
        const startDate = reqBody.startdate;
        const endDate = ctx.getAfterDate(reqBody.enddate);
        const selectSql = 'SELECT * from important_data WHERE date(date) >= ? and date(date) < ? ';
        const orderSql = 'order by date desc ';
        const limitSql = 'limit ?, ?';
        const sql = `${selectSql}${orderSql}${limitSql}`;
        const pageMax = reqBody.pageSize;
        const startPage = (page - 1) * pageMax;
        const result = await ctx.mysqlQueryByLocal(sql, [ startDate, endDate, startPage, pageMax ]);
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            item.date = ctx.transferDate(item.date);
            item.gold_free = ctx.changeClientRatio(item.gold_free);
            item.robot_win_recharge = ctx.changeClientRatio(item.robot_win_recharge);
            item.robot_win_give = ctx.changeClientRatio(item.robot_win_give);
            item.robot_lose = ctx.changeClientRatio(item.robot_lose);
        }
        const countSql = 'SELECT count(*) as count from important_data WHERE date(date) >= ? and date(date) < ?';
        const countData = await ctx.mysqlQueryByLocal(countSql, [ startDate, endDate ]);
        const data = {
            data: result,
            total: countData[0].count,
        };
        return data;
    }
}

module.exports = HistoryService;
