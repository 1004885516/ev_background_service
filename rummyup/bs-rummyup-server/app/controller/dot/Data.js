'use strict';
const Controller = require('egg').Controller;

const md5 = '15fead47be56b308';// yeahmobi#dot
const tablename = 'dot_data';

class DataController extends Controller {
    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const UserId = Number.parseInt(reqBody.UserId);
        const DotType = Number.parseInt(reqBody.DotType);
        const Info = JSON.stringify(reqBody.Info);
        const Md5 = reqBody.Md5;
        const ApkId = reqBody.ApkId;
        const PackageId = reqBody.PackageId;

        const md5_content = `${UserId}${DotType}${Info}${ApkId}${PackageId}${md5}`;
        const serverMd5 = ctx.genMD5(md5_content);

        if (serverMd5 !== Md5) {
            const retBody = ctx.getFailedBody();
            retBody.msg = 'MD5校验失败';
            ctx.body = retBody;
            return;
        }
        const CreateTime = ctx.getTimeSymbol();

        const sql = 'insert into dot_data (UserId, CreateTime, DotType, Info, ApkId, PackageId) values (?, ?, ?, ?, ?, ?)';
        await ctx.mysqlQueryByLocal(sql, [ UserId, CreateTime, DotType, Info, ApkId, PackageId ]);

        ctx.body = ctx.getSuccessBody();
    }

    async getData() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const dottype = reqBody.dottype;

        const sql = `select date_format(CreateTime, '%Y-%m-%d %T') as CreateTime, UserId, DotType, Info, ApkId, PackageId from ${tablename} where CreateTime >= ? and CreateTime < ? and DotType = ?`;
        const order_sql = 'order by CreateTime desc limit ?, ?';
        const startPage = (page - 1) * app.config.PageSize;
        const pageMax = app.config.PageSize;
        const result = await ctx.mysqlQueryByLocal(`${sql} ${order_sql}`, [ startdate, enddate, dottype, startPage, pageMax ]);

        const countSql = 'select count(UserId) as total from dot_data where CreateTime >= ? and CreateTime < ? and DotType = ?';
        const count = await ctx.mysqlQueryByLocal(countSql, [ startdate, enddate, dottype ]);

        let retBody = ctx.getSuccessBody();
        retBody.result = {};
        retBody.result.page_total = count[0].total;
        retBody.result.page = page;
        retBody.result.tableData = result;
        ctx.body = retBody;
    }
}

module.exports = DataController;
