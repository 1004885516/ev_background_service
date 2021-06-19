'use strict';
const Service = require('egg').Service;
const tablename = 'config_filelist';
const jsontable = 'config_json';

const baseswitch = [
    { PlayerOnoff: [ 1, 1, 1, 1, 1 ], RobotOnoff: [ 1, 1, 1, 1, 1 ], Type: 0 },
    { PlayerOnoff: [ 1, 1, 1, 1, 1 ], RobotOnoff: [ 1, 1, 1, 1, 1 ], Type: 1 },
];

const basefilling = {
    SealOff: 0,
    EnterRate: [ 0, 0, 0, 0 ],
    LeaveRate: [ 0, 0, 0, 0 ],
};

class AiService extends Service {
    async getAiFiles(filetype) {
        const { ctx } = this;
        const sql = `select * from ${tablename} where filetype = ? order by id desc limit ?, ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ filetype, 0, 5 ]);
        return result;
    }

    async insertAiFile(filename, createtime, filetype) {
        const { ctx } = this;
        const data = { filetype, createtime, filename };
        const result = await ctx.mysqlByLocal(ctx.MysqlType.Insert, tablename, data);
        return result;
    }

    async notifyGameServerByTPCC(pageData) {
        const { ctx, app } = this;
        this.logger.info(`notify game server tpcc pagedata: ${JSON.stringify(pageData)}`);
        const result = await ctx.httpPost(app.config.TPControlCard, JSON.stringify(pageData));
        this.logger.info('notify game server tpcc result: ', result);
        return result;
    }

    async notifyGameServerByRCC(pageData) {
        const { ctx, app } = this;
        this.logger.info(`notify game server rcc pagedata: ${pageData}`);
        const result = await ctx.httpPost(app.config.RControlCard, JSON.stringify(pageData));
        this.logger.info('notify game server rcc result: ', result);
        return result;
    }

    async getSwitchData() {
        // const { ctx, app } = this;
        // const sql = `select * from ${jsontable} where jsontype = ? order by id desc limit 1`;
        // const result = await ctx.mysqlQueryByLocal(sql, [ app.config.JsonDataType.Switch ]);
        // if (result.length === 0) {
        //     return baseswitch;
        // }
        // const jsondata = JSON.parse(result[0].json);
        // return jsondata;
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getpolicyonoff);
        this.logger.info('get switch result : ', JSON.stringify(result));
        if (!result.Rummy && !result.TeenPatti) {
            return baseswitch;
        }
        const jsondata = [ result.Rummy, result.TeenPatti ];
        return jsondata;
    }

    async setSwitchData(switchdata) {
        const { ctx, app } = this;
        const sql = `insert into ${jsontable} (createtime, jsontype, json) values (?, ?, ?)`;
        const time = ctx.getTimeSymbol();
        await ctx.mysqlQueryByLocal(sql, [ time, app.config.JsonDataType.Switch, JSON.stringify(switchdata) ]);
    }

    async notifyGameServerBySwitch(data) {
        const { ctx, app } = this;
        const result = await ctx.httpPost(app.config.AISwitch, JSON.stringify(data));
        this.logger.info('notify game server switch result : ', result);
        return result;
    }

    async getFillingData() {
        const { ctx, app } = this;
        const sql = `select * from ${jsontable} where jsontype = ? order by id desc limit 1`;
        const result = await ctx.mysqlQueryByLocal(sql, [ app.config.JsonDataType.Filling ]);
        if (result.length === 0) {
            return basefilling;
        }
        const jsondata = JSON.parse(result[0].json);
        return jsondata;
    }

    async getTPFillingData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.GetTPAIFilling);
        this.logger.info('get TP Filling result : ', JSON.stringify(result));
        if (result.code === 200) {
            this.logger.info('get TP Filling result : ', result);
            const data = result.config.List;
            this.logger.info('get TP Filling data : ', data);
            return data;
        }
        return null;
    }

    async setTPFillingData(data) {
        const { ctx, app } = this;
        this.logger.info('Set TP Filling data : ', data);
        const result = await ctx.httpPost(app.config.SetTPAIFilling, JSON.stringify(data));
        this.logger.info('Set TP Filling data result : ', result);
        return result;
    }

    async setFillingData(fillingdata) {
        const { ctx, app } = this;
        const sql = `insert into ${jsontable} (createtime, jsontype, json) values (?, ?, ?)`;
        const time = ctx.getTimeSymbol();
        await ctx.mysqlQueryByLocal(sql, [ time, app.config.JsonDataType.Filling, JSON.stringify(fillingdata) ]);
    }

    async notifyGameServerByFilling(data) {
        const { ctx, app } = this;
        this.logger.info('notify game server filling data : ', data);
        const result = await ctx.httpPost(app.config.AIFilling, JSON.stringify(data));
        this.logger.info('notify game server filling result : ', result);
        return result;
    }

    async getSessionLimitData() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.Getinningrank);
        if (result.code === 200) {
            this.logger.info('get session limit data : ', result);
            const data = result.config;
            this.logger.info('get session limit result : ', data);
            return data;
        }
        return null;
    }
    async setSessionLimitData(data) {
        const { ctx, app } = this;
        this.logger.info('set game server session limit data : ', data);
        const correctValue = data.CorrectValue.map(item => {
            return Number(item);
        });
        const sentData = {
            BaseInning: Number(data.BaseInning),
            CorrectValue: correctValue,
            PayInConvert: Number(data.PayInConvert),
        };
        const result = await ctx.httpPost(app.config.Setinningrank, JSON.stringify(sentData));
        this.logger.info('set game server session limit result : ', result);
        return result;
    }

    async getPolicyByServerConfig(data) {
        const { ctx, app } = this;
        let policyConfig = [];
        const params = `type=${data}`;
        const result = await ctx.httpGet(app.config.GetPolicy, params);
        this.logger.info('get policy by server config result : ', JSON.stringify(result));
        if (result.code === 200) {
            policyConfig = result.config.PolicyRankList;
            this.logger.info('get policy by server config policyConfig : ', JSON.stringify(policyConfig));
            for (let i = 0; i < policyConfig.length; i++) {
                const item = policyConfig[i];
                if (!item.OfficeRejectCompare) {
                    item.OfficeRejectCompare = [];
                }
                if (!item.OtherRejectCompare) {
                    item.OtherRejectCompare = [];
                }
            }
            return policyConfig;
        }
        return null;
    }

    async getSessionByServerConfig(data) {
        const { ctx, app } = this;
        const SessionList = [];
        let config = {};
        let onLine = {};
        const params = `type=${data}`;
        const result = await ctx.httpGet(app.config.GetRoomConfig, params);
        this.logger.info('get session by server config result : ', JSON.stringify(result));
        if (result) {
            config = result.config;
            onLine = result.OnLine;
        }
        if (!onLine) {
            const data = {};
            data.session_name = config.RoomLevel;
            data.session_id = 0;
            data.base_score = ctx.changeClientRatio(config.BaseScore);
            data.threshold = ctx.changeClientRatio(config.MinPayIn);
            data.min_into = ctx.changeClientRatio(config.GoldMin);
            data.max_into = ctx.changeClientRatio(config.GoldMax);
            data.service_charge = config.Rate;
            data.robot = config.Robot;
            data.blinds_rounds = config.Blind;
            data.betting_cap = ctx.changeClientRatio(config.PlayerChipLimit);
            data.chip_cap = ctx.changeClientRatio(config.TotalChipLimit);
            SessionList.push(data);
        } else {
            Object.keys(config).forEach((key, index) => {
                const data = {};
                const item = config[key];
                data.session_name = item.RoomLevel;
                data.session_id = index;
                data.base_score = ctx.changeClientRatio(item.BaseScore);
                data.threshold = ctx.changeClientRatio(item.MinPayIn);
                data.min_into = ctx.changeClientRatio(item.GoldMin);
                data.max_into = item.GoldMax;
                data.service_charge = item.Rate;
                data.robot = item.Robot;

                if (item.Blind) {
                    data.blinds_rounds = item.Blind;
                }

                if (item.PlayerChipLimit) {
                    data.betting_cap = ctx.changeClientRatio(item.PlayerChipLimit);
                }

                if (item.TotalChipLimit) {
                    data.chip_cap = ctx.changeClientRatio(item.TotalChipLimit);
                }

                const onLineData = onLine[item.RoomLevel];
                data.online_users0_2 = onLineData[0].Min + ',' + onLineData[0].Max;
                data.online_users2_4 = onLineData[1].Min + ',' + onLineData[1].Max;
                data.online_users4_6 = onLineData[2].Min + ',' + onLineData[2].Max;
                data.online_users6_8 = onLineData[3].Min + ',' + onLineData[3].Max;
                data.online_users8_10 = onLineData[4].Min + ',' + onLineData[4].Max;
                data.online_users10_12 = onLineData[5].Min + ',' + onLineData[5].Max;
                data.online_users12_14 = onLineData[6].Min + ',' + onLineData[6].Max;
                data.online_users14_16 = onLineData[7].Min + ',' + onLineData[7].Max;
                data.online_users16_18 = onLineData[8].Min + ',' + onLineData[8].Max;
                data.online_users18_20 = onLineData[9].Min + ',' + onLineData[9].Max;
                data.online_users20_22 = onLineData[10].Min + ',' + onLineData[10].Max;
                data.online_users22_24 = onLineData[11].Min + ',' + onLineData[11].Max;
                SessionList.push(data);
            });
        }

        this.logger.info('get server config sessionConfig : ', JSON.stringify(SessionList));

        return SessionList;
    }

    async getTriggerConfig() {
        const { ctx, app } = this;
        const params = 'Type=1';
        const result = await ctx.httpGet(app.config.GetTrigger, params);
        if (result.code === 200) {
            this.logger.info('get trigger config data : ', result);
            const data = result.config.List;
            this.logger.info('get trigger config result : ', data);
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                item.ID = i + 1;
                item.BaseScore = item.BaseScore.toString();
                item.GameName = item.GameName.toString();
                item.Rank = item.Rank.toString();
                item.EventID = item.EventID.toString();
                item.EventPercent = item.EventPercent.toString();
                if (item.TheEndTimes !== 0) {
                    item.TheGameTimes = item.TheGameTimes + ',' + item.TheEndTimes;
                }
            }

            return data;
        }
        return null;
    }

    async setTriggerConfig(data) {
        const { ctx, app } = this;
        this.logger.info('set trigger config data : ', data);
        const sentData = {
            Type: 1,
            List: [],
        };
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const obj = {};
            obj.TriggerID = item.ID;
            obj.UserType = Number(item.UserType);
            obj.Rank = Number.isFinite(item.Rank) ? [ item.Rank ] : item.Rank.split(',').map(item => {
                return Number(item);
            });
            if (Number.isFinite(item.TheGameTimes)) {
                obj.TheGameTimes = item.TheGameTimes;
            } else {
                const values = item.TheGameTimes.split(',').map(item => {
                    return Number(item);
                });
                obj.TheGameTimes = values[0];
                obj.TheEndTimes = values[1];
            }
            obj.GameName = Number.isFinite(item.GameName) ? [ item.GameName ] : item.GameName.split(',').map(item => {
                return Number(item);
            });
            obj.BaseScore = Number.isFinite(item.BaseScore) ? [ item.BaseScore ] : item.BaseScore.split(',').map(item => {
                return Number(item);
            });
            obj.Percent = Number(item.Percent);
            obj.EventID = Number.isFinite(item.EventID) ? [ item.EventID ] : item.EventID.split(',').map(item => {
                return Number(item);
            });
            obj.EventPercent = Number.isFinite(item.EventPercent) ? [ item.EventPercent ] : item.EventPercent.split(',').map(item => {
                return Number(item);
            });
            // obj.LoseRoundNum = Number(item.LoseRoundNum);
            // obj.RAPercent = Number(item.RAPercent);
            sentData.List.push(obj);
        }
        this.logger.info('set trigger config sentData : ', JSON.stringify(sentData));
        const result = await ctx.httpPost(app.config.SetTrigger, JSON.stringify(sentData));
        this.logger.info('set trigger config result : ', result);
        return result;
    }

    async getTriggerRConfig() {
        const { ctx, app } = this;
        const params = 'Type=1';
        const result = await ctx.httpGet(app.config.GetPayinTrigger, params);
        console.log('result', result);
        if (result.code === 200) {
            this.logger.info('get trigger_r config data : ', result);
            const data = result.config.List;
            this.logger.info('get trigger_r config result : ', data);
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                item.ID = i + 1;
                item.GameName = item.GameName.toString();
                item.BaseScore = item.BaseScore.toString();
                item.PayinRank = item.PayinRank.toString();
                item.PayinLevel = item.PayinLevel.toString();
                item.Percent = item.Percent.toString();
            }

            return data;
        }
        return false;
    }

    async setTriggerRConfig(data) {
        const { ctx, app } = this;
        this.logger.info('set trigger config data : ', data);
        const sentData = {
            Type: 1,
            List: [],
        };
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const obj = {};
            obj.ID = item.ID;
            obj.GameName = Number.isFinite(item.GameName) ? [ item.GameName ] : item.GameName.split(',').map(item => {
                return Number(item);
            });

            obj.BaseScore = Number.isFinite(item.BaseScore) ? [ item.BaseScore ] : item.BaseScore.split(',').map(item => {
                return Number(item);
            });

            obj.PayinRank = Number.isFinite(item.PayinRank) ? [ item.PayinRank ] : item.PayinRank.split(',').map(item => {
                return Number(item);
            });

            obj.PayinLevel = Number.isFinite(item.PayinLevel) ? [ item.PayinLevel ] : item.PayinLevel.split(',').map(item => {
                return Number(item);
            });

            obj.Percent = Number.isFinite(item.Percent) ? [ item.Percent ] : item.Percent.split(',').map(item => {
                return Number(item);
            });

            sentData.List.push(obj);
        }
        this.logger.info('set trigger_r config sentData : ', JSON.stringify(sentData));
        const result = await ctx.httpPost(app.config.SetPayinTrigger, JSON.stringify(sentData));
        this.logger.info('set trigger_r config result : ', result);
        return result;
    }

    async getRechargeCardConfig() {
        const { ctx, app } = this;
        const params = 'Type=1';
        const result = await ctx.httpGet(app.config.GetPayinHaveRobotDealCard, params);
        if (result.code === 200) {
            this.logger.info('get recharge card config data : ', result);
            const data = result.config.List;
            this.logger.info('get recharge card config result : ', data);
            const list = [];
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const obj = {
                    CardType: [],
                    Probability: [],
                };
                obj.ID = i + 1;
                for (let j = 0; j < item.Percent.length; j++) {
                    const item2 = item.Percent[j];
                    const probability = item2 % 1000;
                    const cardType = (item2 - probability) / 1000;
                    obj.CardType.push(cardType);
                    obj.Probability.push(probability);
                }
                obj.CardType = obj.CardType.toString();
                obj.Probability = obj.Probability.toString();
                list.push(obj);
            }
            return list;
        }
        return false;
    }

    async setRechargeCardConfig(data) {
        const { ctx, app } = this;
        this.logger.info('set recharge card config data : ', data);
        const sentData = {
            Type: 1,
            List: [],
        };
        for (let i = 0; i < data.length; i++) {
            const obj = {};
            obj.Percent = [];
            const item = data[i];
            const cardTypes = Number.isFinite(item.CardType) ? [ item.CardType ] : item.CardType.split(',').map(item => {
                return Number(item);
            });
            const probabilitys = Number.isFinite(item.Probability) ? [ item.Probability ] : item.Probability.split(',').map(item => {
                return Number(item);
            });
            for (let i = 0; i < cardTypes.length; i++) {
                obj.Percent.push(cardTypes[i] * 1000 + probabilitys[i]);
            }
            sentData.List.push(obj);
        }
        this.logger.info('set recharge card config sentData : ', JSON.stringify(sentData));
        const result = await ctx.httpPost(app.config.SetPayinHaveRobotDealCard, JSON.stringify(sentData));
        this.logger.info('set recharge card config result : ', result);
        return result;
    }

    async getTPrechargeConfig() {
        const { ctx, app } = this;
        const params = 'Type=1';
        const cardType = [
            'SHighCard',
            'BHighCard',
            'SPair',
            'BPair',
            'SColor',
            'BColor',
            'SSequenece',
            'BSequenece',
            'SPureSequence',
            'BPureSequence',
            'STrailOrSet',
            'BTrailOrSet' ];
        const result = await ctx.httpGet(app.config.GetTPrecharge, params);
        if (result.code === 200) {
            this.logger.info('get tprecharge config data : ', result);
            const data = result.config.List;
            this.logger.info('get tprecharge config result : ', data);
            const list = [];
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const obj = {
                    Level: 0,
                    Payin: 0,
                    SHighCard: 0,
                    BHighCard: 0,
                    SPair: 0,
                    BPair: 0,
                    SColor: 0,
                    BColor: 0,
                    SSequenece: 0,
                    BSequenece: 0,
                    SPureSequence: 0,
                    BPureSequence: 0,
                    STrailOrSet: 0,
                    BTrailOrSet: 0,
                };
                obj.Level = item.Index;
                obj.Payin = ctx.changeClientRatio(item.Payin);
                for (let i = 0; i < cardType.length; i++) {
                    const card = cardType[i];
                    for (let j = 0; j < item.Percent.length; j++) {
                        const cardProb = item.Percent[j];
                        const index = parseInt(cardProb / 1000);
                        if (index === i) {
                            obj[card] = cardProb % 1000;
                        }
                    }
                }
                list.push(obj);
            }
            return list;
        }
        return null;
    }

    async setTPrechargeConfig(data) {
        const { ctx, app } = this;
        this.logger.info('set tprecharge config data : ', data);
        const sentData = {
            Type: 1,
            List: [],
        };
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const obj = {};
            obj.Index = item.Level;
            obj.Payin = ctx.changeServerRatio(item.Payin);
            const arr = [ item.SHighCard, item.BHighCard, item.SPair, item.BPair, item.SColor, item.BColor, item.SSequenece, item.BSequenece, item.SPureSequence, item.BPureSequence, item.STrailOrSet, item.BTrailOrSet ];
            obj.Percent = [];
            let sum = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== 0) {
                    obj.Percent.push(i * 1000 + arr[i]);
                }
                sum += arr[i];
            }
            if (sum !== 100) {
                ctx.throw('牌型概率总和必须为100');
            }
            sentData.List.push(obj);
        }
        this.logger.info('set tprecharge config sentData : ', JSON.stringify(sentData));
        const result = await ctx.httpPost(app.config.SetTPrecharge, JSON.stringify(sentData));
        this.logger.info('set tprecharge config result : ', result);
        return result;
    }

    async getEventConfig() {
        const { ctx, app } = this;
        const params = 'Type=1';
        const result = await ctx.httpGet(app.config.GetOperEvent, params);
        if (result.code === 200) {
            this.logger.info('get event config data : ', result);
            const data = result.config.List;
            this.logger.info('get event config result : ', data);
            return data;
        }
        return null;
    }

    async setEventConfig(data) {
        const { ctx, app } = this;
        this.logger.info('set event config data : ', data);
        const sentData = {
            Type: 1,
            List: data,
        };
        this.logger.info('get event config sentData : ', JSON.stringify(sentData));
        const result = await ctx.httpPost(app.config.SetOperEvent, JSON.stringify(sentData));
        this.logger.info('set event config result : ', result);
        return result;
    }
}

module.exports = AiService;
