'use strict';
const Service = require('egg').Service;

class DotDataService extends Service {

    async getBaseData(PackageId, ApkId, Date) {

        this.logger.info('getBaseData : ', PackageId, ApkId, Date);

        const { ctx, app } = this;

        const incidentData = await this.getIncidentData(ctx, app, PackageId, ApkId, Date);

        return [
            { name: '新增注册', data: incidentData.NewRegCount },
            { name: '启动设备', data: incidentData.StartApp },
            { name: '热更新成功', data: incidentData.HotUpdate },
            { name: '获取服务器列表', data: incidentData.ServerList },
            { name: '获取Token', data: incidentData.Token },
            { name: '获取Token失败', data: incidentData.TokenErr },
            { name: '获取定位失败', data: incidentData.LocationErr },
            { name: '首充成功(Mobb)', data: incidentData.FirstSuccessfu },
            { name: '首充成功(BMart)', data: incidentData.FirstSuccessfuBMart },
            { name: '首充成功(Funzone)', data: incidentData.FirstSuccessfuFun },
            { name: '首充成功(活动)', data: incidentData.FirstSuccessfuActivity },
            { name: '余额不足回大厅弹出(活动)', data: incidentData.MONEY_NOT_ENOUGH_2_OPEN_PURGE },
        ];
    }

    async getClickLogin(PackageId, ApkId, Date) {

        this.logger.info('getClickLogin : ', PackageId, ApkId, Date);

        const { ctx, app } = this;

        const incidentData = await this.getIncidentData(ctx, app, PackageId, ApkId, Date);
        return [
            { name: 'Facebook', data: incidentData.ClickFBLogin },
            { name: 'Phone', data: incidentData.ClickPboneLogin },
            { name: 'Guest', data: incidentData.ClickGuestLogin },
            { name: '总计', data: incidentData.TotalClickLogin },
        ];
    }

    async getLoginSuccess(PackageId, ApkId, Date) {

        this.logger.info('getLoginSuccess : ', PackageId, ApkId, Date);

        const { ctx, app } = this;

        const incidentData = await this.getIncidentData(ctx, app, PackageId, ApkId, Date);

        return [
            { name: 'Facebook', data: incidentData.FBLogin },
            { name: 'Phone', data: incidentData.PhoneLogin },
            { name: 'Guest', data: incidentData.GuestLogin },
            { name: '总计', data: incidentData.TotalLogin },
        ];
    }

    async getLoginFail(PackageId, ApkId, Date) {

        this.logger.info('getLoginFail : ', PackageId, ApkId, Date);

        const { ctx, app } = this;

        const incidentData = await this.getIncidentData(ctx, app, PackageId, ApkId, Date);

        return [
            { name: 'Token失效', data: incidentData.Error1 },
            { name: '系统错误', data: incidentData.Error2 },
            { name: '服务器维护', data: incidentData.Error3 },
            { name: 'FB授权登录失败', data: incidentData.Error4 },
            { name: '总计', data: incidentData.TotalError },
        ];
    }

    async getLocationNo(PackageId, ApkId, Date) {

        this.logger.info('getLocationNo : ', PackageId, ApkId, Date);

        const { ctx, app } = this;

        const incidentData = await this.getIncidentData(ctx, app, PackageId, ApkId, Date);

        return [
            { name: 'Assam', data: incidentData.Assam },
            { name: 'Nagaland', data: incidentData.Nagaland },
            { name: 'Orissa', data: incidentData.Orissa },
            { name: 'Sikkim', data: incidentData.Sikkim },
            { name: 'Telangana', data: incidentData.Telangana },
            { name: 'AndhraPradesh', data: incidentData.AndhraPradesh },
            { name: 'TamilNadu', data: incidentData.TamilNadu },
            { name: 'Karnataka', data: incidentData.Karnataka },
            { name: 'Default', data: incidentData.Default },
            { name: '总计', data: incidentData.TotalLocation },
        ];
    }

    async getTPBaseData(PackageId, ApkId, Date) {

        this.logger.info('getLocationNo : ', PackageId, ApkId, Date);

        const { ctx, app } = this;

        const incidentData = await this.getIncidentData(ctx, app, PackageId, ApkId, Date);

        return [
            { name: 'TP从列表正常加入房间(重复)', data: incidentData.NOMAL_ENTER_ROOM_TP },
            { name: 'TP从大厅快速加入房间(重复)', data: incidentData.QUICK_ENTER_ROOM_TP_HALL },
            { name: 'TP从列表快速加入房间(重复)', data: incidentData.QUICK_ENTER_ROOM_TP_LIST },
            { name: '快速TP从列表正常加入房间(重复)', data: incidentData.NOMAL_ENTER_ROOM_SPEED_TP },
            { name: '快速TP从列表快速加入房间(重复)', data: incidentData.QUICK_ENTER_ROOM_SPEED_TP_LIST },
        ];
    }
    async getBaseDataByPackageAndDate(PackageId, ApkId, startDate, endDate) {

        const { ctx, app } = this;

        this.logger.info('getLocationNo : ', PackageId, ApkId, startDate, endDate);

        const incidentData = await this.getIncidentData(ctx, app, PackageId, ApkId, startDate, endDate);
        const data = [
            { name: '新增注册', data: incidentData.NewRegCount },
            { name: '启动设备', data: incidentData.StartApp },
            { name: '热更新成功', data: incidentData.HotUpdate },
            { name: '获取服务器列表', data: incidentData.ServerList },
            { name: '获取Token', data: incidentData.Token },
            { name: '获取Token失败', data: incidentData.TokenErr },
            { name: '获取定位失败', data: incidentData.LocationErr },
            { name: '定位不允许', data: incidentData.TotalLocation },
            { name: '点击登录按钮', data: incidentData.TotalClickLogin },
            { name: '成功登录大厅', data: incidentData.TotalLogin },
            { name: '登录失败', data: incidentData.TotalError },
        ];
        return data;
    }
    // 获取打点数据
    async getIncidentData(ctx, app, PackageId, ApkId, Date) {
        const sDate = Date ? Date + ' 00:00:00' : ctx.getTodaySymbol() + ' 00:00:00';
        const eDate = Date ? Date + ' 23:59:59' : ctx.getTodaySymbol() + ' 23:59:59';
        let markData = [];
        let user;

        const result = {

            // 新增注册
            NewRegCount: 0,

            // 数据统计
            StartApp: 0, // 启动设备
            HotUpdate: 0, // 热更新成功
            ServerList: 0, // 获取服务器列表
            Token: 0, // 获取Token
            TokenErr: 0, // 获取Token失败
            LocationErr: 0, // 获取定位失败
            FirstSuccessfu: 0, // 首冲成功
            FirstSuccessfuBMart: 0, // bmart首充
            FirstSuccessfuFun: 0, // funzone首充
            FirstSuccessfuActivity: 0, // 首充活动
            MONEY_NOT_ENOUGH_2_OPEN_PURGE: 0, // 钱不够返回大厅打开充值入口(重复打点)

            // 成功登录大厅
            FBLogin: 0,
            PhoneLogin: 0,
            GuestLogin: 0,
            TotalLogin: 0,

            // 点击登录按钮
            ClickFBLogin: 0, // Facebook
            ClickPboneLogin: 0, // Phone
            ClickGuestLogin: 0, // Guest
            TotalClickLogin: 0, // 点击登录总计

            // 定位不允许
            Assam: 0,
            Nagaland: 0,
            Orissa: 0,
            Sikkim: 0,
            Telangana: 0,
            AndhraPradesh: 0,
            TamilNadu: 0,
            Karnataka: 0,
            Default: 0,
            TotalLocation: 0,

            // 登陆失败
            Error1: 0,
            Error2: 0,
            Error3: 0,
            Error4: 0,
            TotalError: 0,

            // tp数据统计
            NOMAL_ENTER_ROOM_TP: 0,
            QUICK_ENTER_ROOM_TP_HALL: 0,
            QUICK_ENTER_ROOM_TP_LIST: 0,
            NOMAL_ENTER_ROOM_SPEED_TP: 0,
            QUICK_ENTER_ROOM_SPEED_TP_LIST: 0,
        };

        // 打点数据获取, 如果传入时间，查询历史打点数据，否则查询实时打点数据
        if (!Date) {
            const data = await ctx.httpGet(app.config.MarkLogUrl);
            const MarkData = data.MarkData;
            let filterData;
            if (PackageId !== app.config.All) {
                filterData = MarkData.filter(item => {
                    return ApkId === item.ApkId && PackageId === item.PackageId;
                });
            } else {
                filterData = MarkData.filter(item => {
                    return ApkId === item.ApkId;
                });
            }
            markData = filterData.map(item => {
                return item.MardData;
            });
        } else {
            const selectSql = 'SELECT MarkContent FROM MarkLog';
            let whereSql = ' WHERE MarkDay = ? and ApkId = ? ';
            const params = [ Date, ApkId ];

            if (PackageId !== app.config.All) {
                whereSql += 'and PackageId = ?';
                params.push(PackageId);
            }

            const sql = selectSql + whereSql;
            const data = await ctx.mysqlQueryByGame(sql, params);
            const arr = [];
            for (let i = 0; i < data.length; i++) {
                const item = JSON.parse(data[i].MarkContent);
                arr.push(item);
            }
            markData = arr;
        }

        markData.forEach(item => {
            const MarkContent = item;
            // 数据统计
            if (MarkContent['1']) {
                result.StartApp += MarkContent['1'];
            }
            if (MarkContent['2']) {
                result.HotUpdate += MarkContent['2'];
            }
            if (MarkContent['4']) {
                result.ServerList += MarkContent['4'];
            }
            // 首充打点默认mobb
            if (MarkContent['16']) {
                result.FirstSuccessfu += MarkContent['16'];
            }
            // funzone
            if (MarkContent['16_1']) {
                result.FirstSuccessfuFun += MarkContent['16_1'];
            }
            // bmart
            if (MarkContent['16_2']) {
                result.FirstSuccessfuBMart += MarkContent['16_2'];
            }
            // 首充活动
            if (MarkContent['16_3']) {
                result.FirstSuccessfuActivity += MarkContent['16_3'];
            }
            // 成功登录大厅
            if (MarkContent['10_2']) {
                result.FBLogin += MarkContent['10_2'];
            }
            if (MarkContent['10_3']) {
                result.PhoneLogin += MarkContent['10_3'];
            }
            if (MarkContent['10_1']) {
                result.GuestLogin += MarkContent['10_1'];
            }

            // 点击登录按钮
            if (MarkContent['7']) {
                result.Token += MarkContent['7'];
            }
            if (MarkContent['8']) {
                result.TokenErr += MarkContent['8'];
            }
            if (MarkContent['12']) {
                result.LocationErr += MarkContent['12'];
            }

            // 定位不允许
            if (MarkContent['3_1']) {
                result.ClickGuestLogin += MarkContent['3_1'];
            }
            if (MarkContent['3_2']) {
                result.ClickFBLogin += MarkContent['3_2'];
            }
            if (MarkContent['3_3']) {
                result.ClickPboneLogin += MarkContent['3_3'];
            }
            if (MarkContent['13_Assam']) {
                result.Assam += MarkContent['13_Assam'];
            }
            if (MarkContent['13_Nagaland']) {
                result.Nagaland += MarkContent['13_Nagaland'];
            }
            if (MarkContent['13_Orissa']) {
                result.Orissa += MarkContent['13_Orissa'];
            }
            if (MarkContent['13_Sikkim']) {
                result.Sikkim += MarkContent['13_Sikkim'];
            }
            if (MarkContent['13_Telangana']) {
                result.Telangana += MarkContent['13_Telangana'];
            }
            if (MarkContent['13_AndhraPradesh']) {
                result.AndhraPradesh += MarkContent['13_AndhraPradesh'];
            }
            if (MarkContent['13_TamilNadu']) {
                result.TamilNadu += MarkContent['13_TamilNadu'];
            }
            if (MarkContent['13_Karnataka']) {
                result.Karnataka += MarkContent['13_Karnataka'];
            }
            if (MarkContent['13_']) {
                result.Default += MarkContent['13_'];
            }

            // 登陆失败
            if (MarkContent['11_64']) {
                result.Error1 += MarkContent['11_64'];
            }
            if (MarkContent['11_60']) {
                result.Error2 += MarkContent['11_60'];
            }
            if (MarkContent['11_55']) {
                result.Error3 += MarkContent['11_55'];
            }
            if (MarkContent['11_10']) {
                result.Error4 += MarkContent['11_10'];
            }

            // tp数据统计
            if (MarkContent['17']) {
                result.NOMAL_ENTER_ROOM_TP += MarkContent['17'];
            }
            if (MarkContent['18']) {
                result.QUICK_ENTER_ROOM_TP_HALL += MarkContent['18'];
            }
            if (MarkContent['19']) {
                result.QUICK_ENTER_ROOM_TP_LIST += MarkContent['19'];
            }
            if (MarkContent['20']) {
                result.NOMAL_ENTER_ROOM_SPEED_TP += MarkContent['20'];
            }
            if (MarkContent['21']) {
                result.QUICK_ENTER_ROOM_SPEED_TP_LIST += MarkContent['21'];
            }
            if (MarkContent['22']) {
                result.MONEY_NOT_ENOUGH_2_OPEN_PURGE += MarkContent['22'];
            }
        });

        // 新增注册
        const selectSql = 'SELECT IFNULL(COUNT(distinct(DeviceId)), 0) as NewRegCount FROM User ';
        let whereSql = 'WHERE RegTime >= ? and RegTime <= ? and ApkId = ?';
        let params2 = [ sDate, eDate, ApkId ];
        if (PackageId !== 'All') {
            whereSql += ' and PackageId = ?';
            params2.push(PackageId);
        }
        const sql = selectSql + whereSql;
        user = await ctx.mysqlQueryByGame(sql, params2);
        this.logger.info('params2 : ', JSON.stringify(params2));
        this.logger.info('user : ', JSON.stringify(user));
        result.NewRegCount = user[0].NewRegCount;

        // 总数统计
        result.TotalClickLogin = result.ClickFBLogin + result.ClickPboneLogin + result.ClickGuestLogin; // 登录总计
        result.TotalLogin = result.FBLogin + result.GuestLogin + result.PhoneLogin; // 成功登录大厅总计
        result.TotalLocation = result.Assam + result.Nagaland + result.Orissa + result.Sikkim + result.Telangana + result.AndhraPradesh + result.TamilNadu + result.Karnataka + result.Default; // 定位不允许总计
        result.TotalError = result.Error1 + result.Error2 + result.Error3 + result.Error4; // 登陆失败总计

        return result;
    }
}

module.exports = DotDataService;
