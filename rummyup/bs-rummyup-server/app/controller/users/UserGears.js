'use strict';
const Controller = require('egg').Controller;

class UserGearsController extends Controller {

    async form() {
        const { ctx } = this;
        const result = await ctx.service.user.getUserGearsData();
        const data = await this.dataFormat(ctx, result.onePageData);
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: data,
            page: ctx.request.body.page,
            page_total: result.totalPage,
        };
        ctx.body = retBody;
    }
    async dataFormat(ctx, result) {
        let udl = [];
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const data = result[i];
                if (data != null) {
                    udl[i] = {};
                    udl[i].date_time = ctx.transferDateTime(data.CreateTime);
                    udl[i].game_name = data.GameName;
                    udl[i].room_level = data.RoomLevel;
                    udl[i].player_rank = data.PlayerRank;
                    udl[i].add_rank = data.InningRank;
                    udl[i].start_rank = ctx.changeClientRatio(data.BRankGold);
                    udl[i].end_rank = ctx.changeClientRatio(data.ERankGold);
                    udl[i].difference_rank = ctx.changeClientRatio(data.BRankGold - data.ERankGold);
                    udl[i].win_type = data.Winner === 0 ? '玩家获胜' : '机器人获胜';
                    udl[i].event_id = data.EventID;
                    udl[i].player_give_cannot = ctx.changeClientRatio(data.PlayerGive);
                    udl[i].player_recharge_cannot = ctx.changeClientRatio(data.PlayerPayin);
                    udl[i].player_give_can = ctx.changeClientRatio(data.PlayerWinGive);
                    udl[i].player_recharge_can = ctx.changeClientRatio(data.PlayerWinPayin);
                    udl[i].robot_give_can = ctx.changeClientRatio(data.RobotWinGive);
                    udl[i].robot_recharge_can = ctx.changeClientRatio(data.RobotWinPayin);
                    udl[i].start_m = ctx.changeClientRatio(data.BeginM);
                    udl[i].end_m = ctx.changeClientRatio(data.EndM);
                    udl[i].start_n = ctx.changeClientRatio(data.BeginN);
                    udl[i].end_n = ctx.changeClientRatio(data.EndN);
                    udl[i].give_connot = ctx.changeClientRatio(data.CurGold);
                    udl[i].recharge_connot = ctx.changeClientRatio(data.CurPayGold);
                    udl[i].give_con = ctx.changeClientRatio(data.CurWinGold);
                    udl[i].recharge_con = ctx.changeClientRatio(data.CurWinPayGold);
                    udl[i].revenue = ctx.changeClientRatio(data.Revenue);
                    udl[i].BPayGoldStat = ctx.changeClientRatio(data.BPayGoldStat);
                    udl[i].EPayGoldStat = ctx.changeClientRatio(data.EPayGoldStat);
                    udl[i].BPayinOutPer = data.BPayinOutPer;
                    udl[i].EPayinOutPer = data.EPayinOutPer;
                    udl[i].PayinLevel = data.PayinLevel;
                    udl[i].PayinRank = data.PayinRank;
                }
            }
        }
        return udl;
    }
}

module.exports = UserGearsController;
