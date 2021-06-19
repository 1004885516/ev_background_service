'use strict';

const Service = require('egg').Service;
const tablename_rummy = 'sessions_rummy';
const tablename_teenpatti = 'sessions_teenpatti';
const tabelname_upload = 'config_filelist';

class SessionService extends Service {

    async getSessionNames(jsontype) {
        // app.config.UploadFileType.SessionRummy
        // app.config.UploadFileType.SessionTeenPatti
        // app.config.UploadFileType.TwoPersonsRummy
        const { ctx } = this;
        const result = await ctx.service.upload.getUploadDataByType(jsontype);
        let namelist = [];
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const ele = result[i];
                namelist.push(ele.session_name);
            }
        }
        return namelist;
    }
    async getRummySessionNames() {
        const { ctx } = this;
        return await ctx.mysqlByLocal(ctx.MysqlType.Select, tablename_rummy, { columns: [ 'session_name' ] });
    }

    async getTeenPattiSessionNames() {
        const { ctx } = this;
        return await ctx.mysqlByLocal(ctx.MysqlType.Select, tablename_teenpatti, { columns: [ 'session_name' ] });
    }

    async getRoom() {
        const { ctx, app } = this;
        let roomData = {};
        const result = await ctx.httpGet(app.config.RoomUrl);
        this.logger.info('result : ', result);
        const rummySessionNames = await this.getSessionNames(app.config.UploadFileType.SessionRummy);
        let rummyData = [];
        for (let i = 0; i < rummySessionNames.length; i++) {
            const sname = rummySessionNames[i];
            let item = { name: sname, data: 0 };
            if (result.Rummy && result.Rummy[sname]) {
                item.data = result.Rummy[sname];
            }
            rummyData.push(item);
        }
        roomData.rummy = rummyData;

        const teenpattiSessionNames = await this.getSessionNames(app.config.UploadFileType.SessionTeenPatti);
        let teenpattiData = [];
        for (let i = 0; i < teenpattiSessionNames.length; i++) {
            const sname = teenpattiSessionNames[i];
            let item = { name: sname, data: 0 };
            if (result.TeenPatti && result.TeenPatti[sname]) {
                item.data = result.TeenPatti[sname];
            }
            teenpattiData.push(item);
        }
        roomData.teenpatti = teenpattiData;

        // Rummy2User
        const rummyP2Names = await this.getSessionNames(app.config.UploadFileType.TwoPersonsRummy);
        let rummyP2Data = [];
        for (let i = 0; i < rummyP2Names.length; i++) {
            const sname = rummyP2Names[i];
            let item = { name: sname, data: 0 };
            if (result.Rummy2User && result.Rummy2User[sname]) {
                item.data = result.Rummy2User[sname];
            }
            rummyP2Data.push(item);
        }
        roomData.rummyp2 = rummyP2Data;
        // QuickTP
        const tpSpeedNames = await this.getSessionNames(app.config.UploadFileType.SessionTeenPattiSpeed);
        let tpSpeedData = [];
        for (let i = 0; i < tpSpeedNames.length; i++) {
            const sname = tpSpeedNames[i];
            let item = { name: sname, data: 0 };
            if (result.QuickTP && result.QuickTP[sname]) {
                item.data = result.QuickTP[sname];
            }
            tpSpeedData.push(item);
        }
        roomData.teenpattispeed = tpSpeedData;

        // AK47
        const akNames = await this.getSessionNames(app.config.UploadFileType.AK47);
        let akData = [];
        for (let i = 0; i < akNames.length; i++) {
            const aname = akNames[i];
            let item = { name: aname, data: 0 };
            if (result.Ak47 && result.Ak47[aname]) {
                item.data = result.Ak47[aname];
            }
            akData.push(item);
        }
        roomData.ak47 = akData;

        // LowJoker
        const lowJokerNames = await this.getSessionNames(app.config.UploadFileType.AK47);
        let LowJokerData = [];
        for (let i = 0; i < lowJokerNames.length; i++) {
            const lname = lowJokerNames[i];
            let item = { name: lname, data: 0 };
            if (result.LowJoker && result.LowJoker[lname]) {
                item.data = result.LowJoker[lname];
            }
            LowJokerData.push(item);
        }
        roomData.lowJoker = LowJokerData;

        // HighJoker
        const highJokerNames = await this.getSessionNames(app.config.UploadFileType.AK47);
        let highJokerData = [];
        for (let i = 0; i < highJokerNames.length; i++) {
            const hname = highJokerNames[i];
            let item = { name: hname, data: 0 };
            if (result.HighJoker && result.HighJoker[hname]) {
                item.data = result.HighJoker[hname];
            }
            highJokerData.push(item);
        }
        roomData.highJoker = highJokerData;
        return roomData;
    }

    // async getTodaySession() {
    //     const rummySession = await this.getTodaySessionRummy();
    //     const teenpattiSession = await this.getTodaySessionTeenPatti();
    //     const rummy2UserSession = await this.getTodaySessionRummy2User();
    //     const teenpattiSpeedSession = await this.getTodaySessionTeenPattiSpeed();
    //     const ak47Session = await this.getTodaySessionAK47();
    //     const lowJokerSession = await this.getTodaySessionlowJoker();
    //     const highJokerSession = await this.getTodaySessionHighJoker();
    //     const dragonVSTigerSession = await this.getTodaySessionDragonVSTiger();
    //     let sessionData = {};
    //     sessionData.rummy = rummySession;
    //     sessionData.teenpatti = teenpattiSession;
    //     sessionData.rummy2User = rummy2UserSession;
    //     sessionData.teenpattispeed = teenpattiSpeedSession;
    //     sessionData.ak47 = ak47Session;
    //     sessionData.lowJoker = lowJokerSession;
    //     sessionData.highJoker = highJokerSession;
    //     sessionData.dragonVSTiger = dragonVSTigerSession;
    //     sessionData.total = rummySession + teenpattiSession + rummy2UserSession + teenpattiSpeedSession + ak47Session + lowJokerSession + highJokerSession + dragonVSTigerSession;
    //     return sessionData;
    // }

    async getTodaySession() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = `select GameName,count(*) as total from ${tabel_name} where date(CreateTime) = ? and RoomLevel <> 'PracticeArena' group by GameName`;
        const result = await ctx.mysqlQueryByGame(sql, [ today ]);
        const sessionData = {
            Rummy: 0,
            TeenPatti: 0,
            Rummy2User: 0,
            QuickTP: 0,
            Ak47: 0,
            LowJoker: 0,
            HighJoker: 0,
            DragonVSTiger: 0,
            Total: 0,
        };
        for (let key in sessionData) {
            const data = result.find(item => {
                return item.GameName === key;
            });
            if (data) {
                sessionData[key] = data.total;
            }
            if (key !== 'Total') {
                sessionData.Total += sessionData[key];
            }
        }
        return sessionData;
    }

    async getTodaySessionTeenPatti() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ? and RoomLevel <> ?';
        const teenpattiTotal = await ctx.mysqlQueryByGame(sql, [ today, 'TeenPatti', 'PracticeArena' ]);
        return teenpattiTotal[0].total;
    }

    async getTodaySessionRummy() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ?';
        const rummyTotal = await ctx.mysqlQueryByGame(sql, [ today, 'Rummy' ]);
        return rummyTotal[0].total;
    }

    async getTodaySessionRummy2User() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ?';
        const rummyTotal = await ctx.mysqlQueryByGame(sql, [ today, 'Rummy2User' ]);
        return rummyTotal[0].total;
    }

    async getTodaySessionTeenPattiSpeed() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ?';
        const rummyTotal = await ctx.mysqlQueryByGame(sql, [ today, 'QuickTP' ]);
        return rummyTotal[0].total;
    }

    async getTodaySessionAK47() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ?';
        const rummyTotal = await ctx.mysqlQueryByGame(sql, [ today, 'AK47' ]);
        return rummyTotal[0].total;
    }

    async getTodaySessionlowJoker() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ?';
        const rummyTotal = await ctx.mysqlQueryByGame(sql, [ today, 'LowJoker' ]);
        return rummyTotal[0].total;
    }

    async getTodaySessionHighJoker() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ?';
        const rummyTotal = await ctx.mysqlQueryByGame(sql, [ today, 'HighJoker' ]);
        return rummyTotal[0].total;
    }

    async getTodaySessionDragonVSTiger() {
        const { ctx } = this;
        const tabel_name = 'RoundRecord_' + ctx.getMonthNoSymbol();
        let today = ctx.getTodaySymbol();
        const sql = 'select count(*) as total from ' + tabel_name + ' where date(CreateTime) = ? and GameName = ?';
        const rummyTotal = await ctx.mysqlQueryByGame(sql, [ today, 'DragonVSTiger' ]);
        return rummyTotal[0].total;
    }

    async getSessionFiles(filetype) {
        const { ctx } = this;
        const sql = `select * from ${tabelname_upload} where filetype = ? order by id desc limit ?, ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ filetype, 0, 5 ]);
        return result;
    }

    async insertSessionFile(filename, createtime, filetype) {
        const { ctx } = this;
        const data = { filetype, createtime, filename };
        const result = await ctx.mysqlByLocal(ctx.MysqlType.Insert, tabelname_upload, data);
        return result;
    }

    async notifyGameServerBySR(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session rummy data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=rummy&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=rummy&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async notifyGameServerBySTP(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session teenpatti data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=teenpatti&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=teenpatti&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async notifyGameServerBySTR(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session teenpatti data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=rummy2user&');
        this.logger.info('notifyGameServerBySTR xhr : ', xhr);
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=rummy2user&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async notifyGameServerByQuickTP(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session QuickTP data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=QuickTP&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=QuickTP&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async notifyGameServerByAK47(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session QuickTP data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=AK47&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=AK47&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async notifyGameServerByPractice(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session Practice data: ${JSON.stringify(data)}`);

        let sessionData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;
        }
        this.logger.info('sessionData : ', sessionData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=TPPractice&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }
        return result;
    }

    async notifyGameServerByLowestJoker(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session Practice data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=LowJoker&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=LowJoker&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async notifyGameServerByHighestJoker(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session QuickTP data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=HighJoker&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=HighJoker&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async notifyGameServerByDragonTiger(data) {
        const { ctx, app } = this;
        this.logger.info(`notify game server session QuickTP data: ${JSON.stringify(data)}`);

        let sessionData = {};
        let onlineData = {};
        for (let i = 0; i < data.length; i++) {
            let sub = data[i];
            let sname = sub.session_name;
            let namedata = {};
            namedata.RoomLevel = sname;
            namedata.MinPayIn = ctx.changeServerRatio(sub.threshold);
            namedata.Rank = Number.parseInt(sub.session_id);
            namedata.BaseScore = ctx.changeServerRatio(sub.base_score);
            namedata.GoldMin = ctx.changeServerRatio(sub.min_into);
            namedata.GoldMax = ctx.changeServerRatio(sub.max_into);
            namedata.Rate = Number.parseInt(sub.service_charge);
            namedata.Blind = Number.parseInt(sub.blinds_rounds);
            namedata.PlayerChipLimit = ctx.changeServerRatio(sub.betting_cap);
            namedata.TotalChipLImit = ctx.changeServerRatio(sub.chip_cap);
            namedata.Robot = Number.parseInt(sub.robot);
            sessionData[sname] = namedata;

            let onamedata = [];
            for (let j = 0; j < 12; j++) {
                let tdata = {};
                let oudata = sub[`online_users${j * 2}_${(j + 1) * 2}`];
                this.logger.info('oudata : ', oudata);
                let spdata = oudata.split(',');
                tdata.Begin = j * 2;
                tdata.End = (j + 1) * 2;
                tdata.Min = Number.parseInt(spdata[0]);
                tdata.Max = Number.parseInt(spdata[1]);
                onamedata[j] = tdata;
            }
            onlineData[sname] = onamedata;
        }
        this.logger.info('sessionData : ', sessionData);
        this.logger.info('onlineData : ', onlineData);
        let result = { session: true, online: true };
        const xhr = await ctx.httpPost(app.config.RoomConfig, JSON.stringify(sessionData), 'game=DragonTiger&');
        if (xhr.msg === 'ok') {
            this.logger.info(`notify game server session xhr: ${JSON.stringify(xhr)}`);
        } else {
            this.logger.info(`notify game server session error: ${JSON.stringify(xhr)}`);
            result.session = false;
        }

        const onlinexhr = await ctx.httpPost(app.config.OnlineConfig, JSON.stringify(onlineData), 'game=DragonTiger&');
        if (onlinexhr.msg === 'ok') {
            this.logger.info(`notify game server online xhr: ${JSON.stringify(onlinexhr)}`);
        } else {
            this.logger.info(`notify game server online error: ${JSON.stringify(onlinexhr)}`);
            result.online = false;
        }
        return result;
    }

    async getUserSessionChartsData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const dayDate = reqBody.enddate;
        const yesDate = ctx.getDateByCustomAndAdd(dayDate, -1);
        const sevenDate = ctx.getDateByCustomAndAdd(dayDate, -7);
        const apkId = reqBody.apk_id;
        let sessiondata = [];
        for (let i = app.config.ChartsType.TeenPattiSession; i <= app.config.ChartsType.HighJokerSession; i++) {
            const arr = [];
            const sql = `select * from ${app.config.TableName.User_Gold_Charts} where createdate = ? and apkid = ? and datatype = ?`;
            // 今日数据
            const cur_result = await ctx.mysqlQueryByLocal(sql, [ dayDate, apkId, i ]);
            arr.push(this.disposeUserSessionData(cur_result, 17));
            // 昨日数据
            const yes_result = await ctx.mysqlQueryByLocal(sql, [ yesDate, apkId, i ]);
            arr.push(this.disposeUserSessionData(yes_result, 17));
            // 7日数据
            const seven_result = await ctx.mysqlQueryByLocal(sql, [ sevenDate, apkId, i ]);
            arr.push(this.disposeUserSessionData(seven_result, 17));
            sessiondata.push(arr);
        }
        return sessiondata;
    }

    async getSessionTable() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const startDate = reqBody.startdate;
        const endDate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const dataType = reqBody.dataType;
        const selectSql = `select createdate, data from ${app.config.TableName.User_Gold_Charts} where createdate >= ? and createdate < ? and datatype = ? and apkid = ? `;
        const other_sql = 'group by CreateDate order by CreateDate desc limit ?, ?';
        const sql = `${selectSql}${other_sql}`;
        const cur_result = await ctx.mysqlQueryByLocal(sql, [ startDate, endDate, dataType, apkId, startPage, pageSize ]);
        const result = [];
        for (let i = 0; i < cur_result.length; i++) {
            const item = cur_result[i];
            const obj = {
                date: ctx.transferDate(item.createdate),
                total: 0,
            };
            const data = JSON.parse(item.data);
            for (let key in data) {
                obj.total += data[key];
            }
            Object.assign(obj, data);
            result.push(obj);
        }
        const count_sql = `select count(*) as count from ${app.config.TableName.User_Gold_Charts} where createdate >= ? and createdate < ? and datatype = ? and apkid = ? `;
        const count_params = [ startDate, endDate, dataType, apkId ];
        const count_result = await ctx.mysqlQueryByLocal(count_sql, count_params);
        const data = {
            page,
            tableData: result,
            page_total: count_result[0].count,
        };
        return data;
    }

    disposeUserSessionData(result, len) {
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

    // async getUserSessionChartsData() {
    //     const { ctx, app } = this;
    //     const reqBody = ctx.request.body;
    //     const querydate = reqBody.querydate;
    //     const apkId = reqBody.apk_id;
    //     const sql = `select * from ${app.config.TableName.User_Gold_Charts} where createdate = ? and apkid = ? and datatype >= ? and datatype <= ?`;
    //     const result = await ctx.mysqlQueryByLocal(sql, [ querydate, apkId, app.config.ChartsType.TeenPattiSession, app.config.ChartsType.HighJokerSession ]);
    //     this.logger.info('result : ', JSON.stringify(result));
    //     let sessiondata = [];
    //     for (let i = app.config.ChartsType.TeenPattiSession; i <= app.config.ChartsType.HighJokerSession; i++) {
    //         let data = result.find(item => {
    //             return item.datatype === i;
    //         });
    //         sessiondata.push(this.disposeUserSessionData(data, i, 17));
    //     }
    //     return sessiondata;
    // }

    // disposeUserSessionData(itemdata, type, len) {
    //     const { app } = this;
    //     let resultdata = { SessionData: [], ClientType: type - app.config.ChartsType.TeenPattiSession };
    //     if (!itemdata) {
    //         for (let i = 0; i < len; i++) {
    //             resultdata.SessionData.push(0);
    //         }
    //     } else {
    //         let idata = JSON.parse(itemdata.data);
    //         let data = [];
    //         for (const key in idata) {
    //             if (Object.hasOwnProperty.call(idata, key)) {
    //                 const value = idata[key];
    //                 data.push(value);
    //             }
    //         }
    //         resultdata.SessionData = data;
    //     }
    //     return resultdata;
    // }
}

module.exports = SessionService;
