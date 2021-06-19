'use strict';
const Controller = require('egg').Controller;

class InviteQueryController extends Controller {

    async form() {
        const { ctx } = this;
        const { onePageData, totalPage } = await ctx.service.user.getInviteData();
        const totalRebate = await ctx.service.user.getTotalRebate();
        const dataList = await this.dataFormat(onePageData, totalRebate);
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: dataList,
            page: ctx.request.body.page,
            page_total: totalPage,
        };
        ctx.body = retBody;
    }
    async dataFormat(onePageData, totalRebate) {
        const dataList = [];
        onePageData.forEach(item => {
            const obj = {};
            obj.date = item.CreateTime;
            obj.rebate_count = totalRebate;
            obj.rebate = [];
            let i;
            for (i = 0; i < item.Conf.length; i++) {
                const rebateObj = {};
                rebateObj.rate = item.Conf[i];
                rebateObj.id = item.Users[i] && item.Users[i].Uid ? item.Users[i].Uid : 0;
                rebateObj.gold = item.Users[i] && item.Users[i].Gold ? item.Users[i].Gold : 0;
                obj.rebate.push(rebateObj);
            }
            dataList.push(obj);
        });
        return dataList;
    }
}

module.exports = InviteQueryController;
