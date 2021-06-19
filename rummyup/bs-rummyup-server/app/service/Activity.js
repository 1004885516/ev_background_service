'use strict';

const Service = require('egg').Service;
const pageDevice = require('../utils/DevicePage');
const tabelname_upload = 'config_filelist';
const basenug = {
    PhoneGive: 0,
    FBGive: 0,
    GuestGive: 0,
    MaxGive: 0,
};

const baselogin = [ 1, 2, 3, 4, 5, 6, 7 ];
const testname = 'jiadaye';
class ActivityService extends Service {

    async getTurntableFiles(filetype) {
        const { ctx } = this;
        const sql = `select * from ${tabelname_upload} where filetype = ? order by id desc limit ?, ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ filetype, 0, 5 ]);
        return result;
    }

    async insertTurntableFile(filename, createtime, filetype) {
        const { ctx } = this;
        const data = { filetype, createtime, filename };
        const result = await ctx.mysqlByLocal(ctx.MysqlType.Insert, tabelname_upload, data);
        return result;
    }

    async getTurntableData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetTurntable);
        return result.config;
    }

    async notifyGameServerByTurntable(data) {
        const { ctx, app } = this;
        // this.logger.info(`notify game server turntable data: ${JSON.stringify(data)}`);
        let turntableData = { PlayCount: Number.parseInt(data.daily_number), PrizeList: [] };
        for (let i = 0; i < data.prize_list.length; i++) {
            let sub = data.prize_list[i];
            let itemdata = {};
            itemdata.ID = Number.parseInt(sub.id);
            itemdata.Chance = Number.parseInt(sub.chance);
            itemdata.PrizeType = Number.parseInt(sub.prize_type);
            itemdata.PrizeNum = Number.parseInt(sub.prize_num);
            itemdata.PrizeName = `${sub.prize_name}`;
            itemdata.PrizeIcon = `${sub.prize_icon}`;
            turntableData.PrizeList.push(itemdata);
        }
        this.logger.info('turntableData : ', turntableData);
        let result = true;
        const xhr = await ctx.httpPost(app.config.TurntableConfig, JSON.stringify(turntableData));
        if (xhr.message === 'ok') {
            this.logger.info(`notify game turntable xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game turntable error: ${JSON.stringify(xhr)}`);
            result = false;
        }
        return result;
    }

    async getNewUserGiveData() {
        const { ctx, app } = this;
        const sql = `select * from ${app.config.TableName.Json} where jsontype = ? order by id desc limit 1`;
        const result = await ctx.mysqlQueryByLocal(sql, [ app.config.JsonDataType.NewUserGive ]);
        if (result.length === 0) {
            return basenug;
        }
        return JSON.parse(result[0].json);
    }

    async setNewUserGiveData(nugdata) {
        const { ctx, app } = this;
        const sql = `insert into ${app.config.TableName.Json} (createtime, jsontype, json) values (?, ?, ?)`;
        const time = ctx.getTimeSymbol();
        await ctx.mysqlQueryByLocal(sql, [ time, app.config.JsonDataType.NewUserGive, JSON.stringify(nugdata) ]);
    }

    async notifyGameServerByNUG(data) {
        const { ctx, app } = this;
        const senddata = {
            PhoneGive: ctx.changeServerRatio(data.PhoneGive),
            FBGive: ctx.changeServerRatio(data.FBGive),
            GuestGive: ctx.changeServerRatio(data.GuestGive),
            DeviceRegNum: Number.parseInt(data.MaxGive),
        };
        this.logger.info('notify game server new user give data : ', senddata);
        const result = await ctx.httpPost(app.config.NewUserGive, JSON.stringify(senddata));
        this.logger.info('notify game server new user give result : ', result);
        return result;
    }

    async getLoginData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetLoginConfig);
        if (result.code === 200) {
            this.logger.info('get login data : ', result);
            const data = result.config.map(item => {
                return ctx.changeClientRatio(item);
            });
            this.logger.info('data : ', data);
            return data;
        }
        return baselogin;
    }

    async notifyGameServerByLogin(data) {
        const { ctx, app } = this;
        const senddata = data.map(item => {
            return ctx.changeServerRatio(item.amount);
        });
        this.logger.info('notify game server login data : ', senddata);
        const result = await ctx.httpPost(app.config.SetLoginConfig, JSON.stringify(senddata));
        this.logger.info('notify game server login result : ', result);
        return result;
    }

    async getTimeLimitData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getlimitshopconfig);
        if (result.code === 200) {
            this.logger.info('get limit data : ', result);
            const data = result.config;
            for (let i = 0; i < data.length; i++) {
                data[i].IncGold = ctx.changeClientRatio(data[i].IncGold);
                data[i].Time = [ data[i].BeginTime, data[i].EndTime ];
                data[i].ExpireTime = ctx.changeClientTime(data[i].ExpireTime);
            }
            this.logger.info('data : ', data);
            return data;
        }
        return null;
    }
    // 限时活动配置，值不需要 x 10000
    async setTimeLimitData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body.data;
        let result;
        const sendData = {
            List: [],
        };
        for (let i = 0; i < reqBody.length; i++) {
            const item = reqBody[i];
            const obj = {};
            obj.ID = item.ID;
            obj.BuyPrice = Number(item.BuyPrice);
            obj.RewardPercent = Number(item.RewardPercent);
            obj.DayBuyCountLimit = Number(item.DayBuyCountLimit);
            obj.BeginTime = item.Time[0];
            obj.EndTime = item.Time[1];
            obj.ExpireTime = ctx.changeServerTime(item.ExpireTime);
            obj.UserType = Number(item.UserType);
            obj.GoodsType = Number(item.GoodsType);
            sendData.List.push(obj);
        }
        this.logger.info('Set Time Limit Data : ', sendData);
        result = await ctx.httpPost(app.config.Setlimitshopconfig, JSON.stringify(sendData));
        this.logger.info('Set Time Limit result : ', result);
        return result;
    }

    async getActivityFirstData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getfirstbuyconfig);
        if (result.code === 200) {
            this.logger.info('get activity first data : ', result);
            const data = result.config;
            data.Time = [ data.BeginTime, data.EndTime ];
            data.IncGold = ctx.changeClientRatio(data.IncGold);
            this.logger.info('first : ', data);
            return data;
        }
        return null;
    }

    async setActivityFirstData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body.data[0];
        const sendData = {
            ActiveName: reqBody.ActiveName,
            IncGold: ctx.changeServerRatio(reqBody.IncGold),
            BuyPrice: Number(reqBody.BuyPrice),
            OriginalPrice: Number(reqBody.OriginalPrice),
            Discount: reqBody.Discount,
            BeginTime: reqBody.Time[0],
            EndTime: reqBody.Time[1],
        };
        this.logger.info('Set Activity First Data : ', sendData);
        const result = await ctx.httpPost(app.config.Setfirstbuyconfig, JSON.stringify(sendData));
        this.logger.info('Set Activity First result : ', result);
        return result;
    }

    async getBulletinBoardData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getflyerconfig);
        if (result.code === 200) {
            this.logger.info('get bulletin board data : ', result);
            const data = result.config;
            this.logger.info('bulletinBoard : ', data);
            return data;
        }
        return null;
    }

    async setBulletinBoardData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body.data;
        const arr = [];
        for (let i = 0; i < reqBody.length; i++) {
            const item = reqBody[i];
            const obj = {};
            obj.Id = Number(item.Id);
            obj.ResName = item.ResName;
            obj.FuncJump = Number(item.FuncJump);
            obj.Active = item.Active;
            obj.Rank = Number(item.Rank);
            arr.push(obj);
        }
        const sendData = {
            config: arr,
        };
        this.logger.info('Set Bulletin Board Data : ', sendData);
        const result = await ctx.httpPost(app.config.Setflyerconfig, JSON.stringify(sendData));
        this.logger.info('Set Bulletin Board result : ', result);
        return result;
    }

    async getActivityShowData() {
        const { ctx, app } = this;
        const obj = {};
        const result = await ctx.httpGet(app.config.Getfuncconfig);
        if (result.code === 200) {
            this.logger.info('get activity show data : ', result);
            const data = result.config.config;
            obj.data1 = data;
            this.logger.info('ActivityShow result: ', data);
        }
        const result2 = await ctx.httpGet(app.config.GetNewPlayerConfig);
        if (result.code === 200) {
            this.logger.info('get activity show data : ', result2);
            const data = result2.config;
            obj.data2 = data;
            this.logger.info('ActivityShow result2: ', data);
        }
        return obj;
    }

    async setActivityShowData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body.data;
        const arrData = reqBody.map(item => {
            const obj = {};
            obj.isOpen = Number(item.isOpen);
            obj.auto = Number(item.auto);
            return obj;
        });
        const sendData = {
            config: arrData,
        };
        this.logger.info('Set Activity Show Data : ', sendData);
        const result = await ctx.httpPost(app.config.Setfuncconfig, JSON.stringify(sendData));
        this.logger.info('Set Activity Show result : ', result);
        return result;
    }

    async getWeekCardData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getweekvipconfig);
        if (result.code === 200) {
            this.logger.info('get week card data : ', result);
            const data = result.config;
            for (let i = 0; i < data.Config.length; i++) {
                for (let j = 0; j < data.Config[i].Reward.length; j++) {
                    data.Config[i].Reward[j] = ctx.changeClientRatio(data.Config[i].Reward[j]);
                }
            }
            this.logger.info('WeekCard : ', data);
            return data;
        }
        return null;
    }

    async setWeekCardData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const arrData = reqBody.data.map(item => {
            const obj = {};
            const rArr = [ ctx.changeServerRatio(item.Reward0), ctx.changeServerRatio(item.Reward1), ctx.changeServerRatio(item.Reward2), ctx.changeServerRatio(item.Reward3), ctx.changeServerRatio(item.Reward4), ctx.changeServerRatio(item.Reward5), ctx.changeServerRatio(item.Reward6) ];

            obj.Type = Number(item.Type);
            obj.Reward = rArr;
            obj.BuyPrice = Number(item.BuyPrice);
            return obj;
        });
        const sendData = {
            CanBuy: Number(reqBody.CanBuy),
            Config: arrData,
        };
        this.logger.info('Set Week Card Data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.Setweekvipconfig, JSON.stringify(sendData));
        this.logger.info('Set Week Card result : ', result);
        return result;
    }

    async getBalancePopUpData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getgoldremind);
        if (result.code === 200) {
            this.logger.info('get balance pop up data : ', result);

            const data = result.config;
            data.MinLimit = ctx.changeClientRatio(data.MinLimit);
            this.logger.info('balance pop up : ', data);
            return data;
        }
        return null;
    }

    async setBalancePopUpData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const sendData = {
            MinLimit: ctx.changeServerRatio(reqBody.MinLimit),
        };
        this.logger.info('Set balance pop up Data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.Setgoldremind, JSON.stringify(sendData));
        this.logger.info('Set balance pop up result : ', result);
        return result;
    }

    async setNoviciateData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const sendData = {
            Guide: Number(reqBody.data[0].value),
            Flyer: Number(reqBody.data[1].value),
        };
        this.logger.info('Set Noviciate Data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.SetNewPlayerConfig, JSON.stringify(sendData));
        this.logger.info('Set Noviciate result : ', result);
        return result;
    }

    async getNewUserRechargeData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetNewUserActivity);
        if (result.code === 200) {
            this.logger.info('get new user recharge result : ', result);
            const data = result.config;
            console.log('1111', data.Stage);
            const obj = {
                Open: data.Open,
                OpenTime: data.OpenTime,
                BuyPrice1: data.Stage[0].BuyPrice,
                RewardPercent1: data.Stage[0].RewardPercent,
                NextDayReward1: data.Stage[0].NextDayReward,
                BuyGive1: data.Stage[0].BuyGive,
                BuyPrice2: data.Stage[1].BuyPrice,
                RewardPercent2: data.Stage[1].RewardPercent,
                NextDayReward2: data.Stage[1].NextDayReward,
                BuyGive2: data.Stage[1].BuyGive,
            };
            this.logger.info('get new user recharge obj: ', obj);
            return obj;
        }
        return null;
    }

    async setNewUserRechargeData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const data = reqBody.data[0];
        const sendData = {
            Open: Number(data.Open),
            OpenTime: Number(data.OpenTime),
            Stage: [
                {
                    BuyPrice: Number(data.BuyPrice1),
                    RewardPercent: Number(data.RewardPercent1),
                    NextDayReward: Number(data.NextDayReward1),
                    BuyGive: Number(data.BuyGive1),
                },
                {
                    BuyPrice: Number(data.BuyPrice2),
                    RewardPercent: Number(data.RewardPercent2),
                    NextDayReward: Number(data.NextDayReward2),
                    BuyGive: Number(data.BuyGive2),
                },
            ],
        };
        this.logger.info('set new user recharge Data : ', JSON.stringify(sendData));
        const result = await ctx.httpPost(app.config.NewUserActivity, JSON.stringify(sendData));
        this.logger.info('set new user recharge result : ', result);
        return result;
    }

    async getActivityData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const payInType = await this.getPayType();
        const dates = ctx.getEveryDay(reqBody.startdate, reqBody.enddate);
        const shopType = reqBody.type;
        const list = [];
        for (let i = 0; i < dates.length; i++) {
            const date = ctx.transferDate(dates[i]);
            const obj = {};
            obj.date = date;
            const selectSql = `select
                count(*) as buyCount,
                count(distinct(UserId)) as buyUserCount
                from OrderRecord`;
            const rWhereSql = ' where date(CreateTime) = ? and ShopType = ? and TotalPayIn >= ? and OrderStatus = ? and FirstName <> ?';
            const rSql = `${selectSql}${rWhereSql}`;
            const params = [ date, shopType, payInType, 1, testname ];
            const rData = await ctx.mysqlQueryByGame(rSql, params);
            obj.rBuyCount = rData[0].buyCount;
            obj.rBuyUserCount = rData[0].buyUserCount;
            const nWhereSql = ' where date(CreateTime) = ? and ShopType = ? and TotalPayIn < ? and OrderStatus = ? and FirstName <> ?';
            const nSql = `${selectSql}${nWhereSql}`;
            const nData = await ctx.mysqlQueryByGame(nSql, params);
            obj.nBuyCount = nData[0].buyCount;
            obj.nBuyUserCount = nData[0].buyUserCount;
            // 破产活动查询 破产活动次数统计
            if (shopType === 5) {
                const goldStatSql = 'select BankruptCount from GoldStat where date(Date) = ?';
                const goldStatData = await ctx.mysqlQueryByGame(goldStatSql, [ date ]);
                obj.numberOfPopUp = goldStatData[0] && goldStatData[0].BankruptCount ? goldStatData[0].BankruptCount : 0;
            }
            list.push(obj);
        }
        // 对结果排降序
        list.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });
        const onePageData = pageDevice.doPage(page, pageSize, list);
        const result = {
            data: onePageData,
            total: list.length,
        };
        return result;
    }

    async getNewUserRecharge() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const dates = ctx.getEveryDay(reqBody.startdate, reqBody.enddate);
        const list = [];
        for (let i = 0; i < dates.length; i++) {
            const date = ctx.transferDate(dates[i]);
            const obj = {
                date,
                firstCount: 0,
                firstUsers: 0,
                secondCount: 0,
                secondUsers: 0,
            };
            const users1 = [];
            const users2 = [];
            const selectSql = 'select UserId, Details from OrderRecord';
            const whereSql = ' where date(CreateTime) = ? and OrderStatus = ? and FirstName <> ? and ShopType = ?';
            const sql = `${selectSql}${whereSql}`;
            const params = [ date, 1, testname, 7 ];
            const result = await ctx.mysqlQueryByGame(sql, params);
            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                if (item.Details !== '') {
                    item.Details = JSON.parse(item.Details);
                    if (item.Details.st === 1) {
                        obj.firstCount += 1;
                        if (!users1.includes(item.UserId)) {
                            users1.push(item.UserId);
                        }
                    }
                    if (item.Details.st === 2) {
                        obj.secondCount += 1;
                        if (!users2.includes(item.UserId)) {
                            users2.push(item.UserId);
                        }
                    }
                }
            }
            obj.firstUsers = users1.length;
            obj.secondUsers = users2.length;
            list.push(obj);
        }
        // 对结果排降序
        list.sort((a, b) => {
            return Date.parse(b.date) - Date.parse(a.date);
        });
        const onePageData = pageDevice.doPage(page, pageSize, list);
        const result = {
            data: onePageData,
            total: list.length,
        };
        return result;
    }

    async getPayType() {
        const { ctx } = this;
        const gameConfig = await ctx.service.definition.getGamePlayer();
        const payInData = gameConfig.find(item => {
            return item.Name === 'PayIn';
        });
        const payInType = Number(payInData.Value) * 10000;
        return payInType;
    }
}

module.exports = ActivityService;
