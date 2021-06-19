'use strict';
const Controller = require('egg').Controller;

class RealTimeDataController extends Controller {
    async index() {
        const { ctx } = this;
        const type = Number(ctx.request.query.type);
        // 在线玩家
        // const online = await this.getOnline();
        // 房间数
        // const room = await ctx.service.session.getRoom();
        // 今日场次
        // const todaySession = await ctx.service.session.getTodaySession();
        // 今日活跃
        // const todayActive = await ctx.service.user.getTodayActivePlayers();
        // 累计用户
        // const totalUsers = await ctx.service.user.getGrandTotalUsers();
        // 最高在线
        // const onlineMax = await ctx.service.user.getOnlineMax();
        // 今日新增注册
        // const newRegister = await ctx.service.user.newRegister();
        // 实时打点数据
        // const markData = await ctx.service.user.getMarkData();
        let retBody = ctx.getSuccessBody();

        if (type === 1) {
            // 在线玩家
            const online = await this.getOnline();
            // 今日活跃
            const todayActive = await ctx.service.user.getTodayActivePlayers();
            // 累计用户
            const totalUsers = await ctx.service.user.getGrandTotalUsers();
            // 最高在线
            const onlineMax = await ctx.service.user.getOnlineMax();
            // 今日新增注册
            const newRegister = await ctx.service.user.newRegister();
            // 金币池
            const goldPool = await ctx.service.definition.getGoldPoolConfig();
            // 今日场次
            // const todaySession = await ctx.service.session.getTodaySession();
            retBody.result = {
                online,
                todayActive,
                totalUsers,
                onlineMax,
                newRegister,
                goldPool: goldPool.Jackpot,
                // todaySessiontotal: todaySession.total,
            };
        } else if (type === 2) {
            // 今日场次
            const todaySession = await ctx.service.session.getTodaySession();
            retBody.result = todaySession;
        } else if (type === 3) {
            // 房间数
            const room = await ctx.service.session.getRoom();
            retBody.result = room;
        }
        // retBody.result = {
        //     online,
        //     room,
        //     todaySession,
        //     todayActive,
        //     totalUsers,
        //     onlineMax,
        //     newRegister,
        //     markData,
        // };

        ctx.body = retBody;
    }

    // 当前在线
    async getOnline() {
        const { ctx, app } = this;
        const result = await ctx.httpGet(app.config.OnlineUrl);
        this.logger.info('result : ', JSON.stringify(result));
        return {
            hall: result.Online - result.GameUser,
            game: result.GameUser,
        };
    }
}

module.exports = RealTimeDataController;
