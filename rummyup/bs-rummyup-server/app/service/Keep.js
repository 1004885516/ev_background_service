'use strict';
const Service = require('egg').Service;

class KeepService extends Service {
    // 获取MediaSource列表
    async getMediaSources() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const sql = `select distinct(MediaSource) as MediaSource, Campaign from ${app.config.TableName.Keep_Statistics} where ApkId = ? and CreateDate >= ? and CreateDate < ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ apkId, startdate, enddate ]);

        let data = [];
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            let lastdata = data.find(sub => {
                return sub.MediaSource === item.MediaSource;
            });
            if (lastdata) {
                lastdata.Campaigns.push(item.Campaign);
            } else {
                data.push({ MediaSource: item.MediaSource, Campaigns: [ 'All', item.Campaign ] });
            }
        }
        if (data.length > 0) {
            data.unshift({ MediaSource: 'All' });
        }
        return data;
    }

    async getUserKeepData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const apkId = reqBody.apk_id;
        const mediaSource = reqBody.media_source;
        const campaign = reqBody.campaign;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const userType = reqBody.user_type;
        let dbName;
        switch (userType) {
            case 0:
                dbName = app.config.TableName.Keep_Statistics;
               break;
            case 1:
                dbName = app.config.TableName.Keep_Active_Statistics;
               break;
            case 2:
                dbName = app.config.TableName.Keep_Pay_Statistics;
               break;
            default:
                dbName = app.config.TableName.Keep_Statistics;
        }
        let sql = '';
        let select_sql = 'date_format(CreateDate, "%Y-%m-%d") as CreateDate,';
            select_sql += 'sum(NewUsers) as NewUsers,';
            select_sql += 'sum(ActiveUsers2) as ActiveUsers2,';
            select_sql += 'sum(ActiveUsers3) as ActiveUsers3,';
            select_sql += 'sum(ActiveUsers7) as ActiveUsers7,';
            select_sql += 'sum(ActiveUsers15) as ActiveUsers15,';
            select_sql += 'sum(ActiveUsers30) as ActiveUsers30';

        const other_sql = 'group by CreateDate order by CreateDate desc limit ?, ?';
        let params = [ apkId, startdate, enddate ];
        let count_params = [ apkId, startdate, enddate ];
        let where_sql = '';
        if (mediaSource === 'All') {
            where_sql = 'where ApkId = ? and CreateDate >= ? and CreateDate < ?';
        } else {
            if (campaign === 'All') {
                select_sql += ', MediaSource';
                where_sql = 'where ApkId = ? and CreateDate >= ? and CreateDate < ? and MediaSource = ?';
                params.push(mediaSource);
                count_params.push(mediaSource);
            } else {
                select_sql += ', MediaSource, Campaign';
                where_sql = 'where ApkId = ? and CreateDate >= ? and CreateDate < ? and MediaSource = ? and Campaign = ?';
                params.push(mediaSource);
                params.push(campaign);
                count_params.push(mediaSource);
                count_params.push(campaign);
            }
        }
        params.push(startPage);
        params.push(pageSize);

        sql = `select ${select_sql} from ${dbName} ${where_sql} ${other_sql}`;
        const result = await ctx.mysqlQueryByLocal(sql, params);

        const count_sql = `select ifnull(count(distinct CreateDate), 0) as total from ${dbName} ${where_sql} group by CreateDate`;
        const count_result = await ctx.mysqlQueryByLocal(count_sql, count_params);
        this.logger.info('count_result : ', JSON.stringify(count_result));
        return { data: result, total: count_result.length };

        // if (mediaSource === 'All') {
        //     const where_sql = 'where ApkId = ? and CreateDate >= ? and CreateDate < ?';
        //     const other_sql = 'group by CreateDate order by CreateDate desc limit ?, ?';
        //     const startPage = (page - 1) * app.config.PageSize;
        //     let params = [ apkId, startdate, enddate, startPage, app.config.PageSize ];
        //     sql = `select ${select_sql} from ${app.config.TableName.Keep_Statistics} ${where_sql} ${other_sql}`;
        //     const result = await ctx.mysqlQueryByLocal(sql, params);

        //     const count_sql = `select ifnull(count(distinct CreateDate), 0) as total from ${app.config.TableName.Keep_Statistics} ${where_sql} group by CreateDate`;
        //     const count_params = [ apkId, startdate, enddate ];
        //     const count_result = await ctx.mysqlQueryByLocal(count_sql, count_params);
        //     this.logger.info('count_result : ', JSON.stringify(count_result));
        //     return { data: result, total: count_result.length };
        // }
        // const campaign = reqBody.campaign;
        // if (campaign === 'All') {
        //     const where_sql = 'where ApkId = ? and CreateDate >= ? and CreateDate < ? and MediaSource = ?';
        //     const other_sql = 'group by CreateDate order by CreateDate desc limit ?, ?';
        //     const startPage = (page - 1) * app.config.PageSize;
        //     let params = [ apkId, startdate, enddate, mediaSource, startPage, app.config.PageSize ];
        //     sql = `select ${select_sql} from ${app.config.TableName.Keep_Statistics} ${where_sql} ${other_sql}`;
        //     const result = await ctx.mysqlQueryByLocal(sql, params);
        //     this.logger.info('result : ', JSON.stringify(result));
        //     return { data: result, total: 1 };
        // }
        // const where_sql = 'where ApkId = ? and CreateDate >= ? and CreateDate < ? and MediaSource = ? and Campaign = ?';
        // const other_sql = 'group by CreateDate order by CreateDate desc limit ?, ?';
        // const startPage = (page - 1) * app.config.PageSize;
        // let params = [ apkId, startdate, enddate, mediaSource, campaign, startPage, app.config.PageSize ];
        // sql = `select ${select_sql} from ${app.config.TableName.Keep_Statistics} ${where_sql} ${other_sql}`;
        // const result = await ctx.mysqlQueryByLocal(sql, params);
        // this.logger.info('result : ', JSON.stringify(result));
        // return { data: result, total: 1 };
    }
}

module.exports = KeepService;
