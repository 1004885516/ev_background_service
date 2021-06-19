'use strict';
const Service = require('egg').Service;

class LoseGoldService extends Service {
    async getUserLoseData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const page = reqBody.page;
        const loseType = reqBody.lose_type;
        const startDate = reqBody.startdate;
        const endDate = ctx.getAfterDate(reqBody.enddate);
        const selectSql = 'SELECT * from user_lose_gold WHERE apk_id = ? and lose_type = ? and date(date) >= ? and date(date) < ? ';
        const orderSql = 'order by date desc ';
        const limitSql = 'limit ?, ?';
        const sql = `${selectSql}${orderSql}${limitSql}`;
        const pageMax = reqBody.pageSize;
        const startPage = (page - 1) * pageMax;
        const result = await ctx.mysqlQueryByLocal(sql, [ apkId, loseType, startDate, endDate, startPage, pageMax ]);
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            item.date = ctx.transferDate(item.date);
        }
        const countSql = 'SELECT count(*) as count from user_lose_gold WHERE apk_id = ? and lose_type = ? and date(date) >= ? and date(date) < ?';
        const countData = await ctx.mysqlQueryByLocal(countSql, [ apkId, loseType, startDate, endDate ]);
        const data = {
            data: result,
            total: countData[0].count,
        };
        return data;
    }
}

module.exports = LoseGoldService;
