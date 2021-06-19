'use strict';

const Service = require('egg').Service;
const tablename = 'OrderRecord';
const usertable = 'User';
const testname = 'jiadaye';

const SerPayKey = '6C15315291AF4820160ECF4C50E196F0';
class RechargeService extends Service {

    async getRechargeData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const userId = Number.parseInt(reqBody.userId);
        const startdate = reqBody.startdate;
        const enddate = ctx.transferDate(reqBody.enddate);
        const pageSize = reqBody.pageSize;
        const orderStatus = Number.parseInt(reqBody.orderStatus);// 0创建, 1完成, 2异常, 3待确认, 4全部
        const page = reqBody.page;
        const amountType = reqBody.amountType;
        const options = reqBody.options;
        let sql = `select * from ${tablename} where FirstName != ? and EndTime >= ? and EndTime < ?`;
        const startPage = (page - 1) * pageSize;
        let params = [ testname, startdate, enddate ];
        if (orderStatus !== 4) {
            sql += ' and OrderStatus = ?';
            params.push(orderStatus);
        }
        if (userId !== 0) {
            sql += ' and UserId = ?';
            params.push(userId);
        }
        if (amountType !== 'ALL' && amountType !== '其他') {
            sql += ' and Amount = ?';
            params.push(amountType);
        } else if (amountType === '其他') {
            for (let i = 0; i < options.length; i++) {
                sql += ' and Amount <> ?';
                params.push(options[i]);
            }
        }

        sql += ' order by CreateTime desc limit ?, ?';
        params.push(startPage);
        params.push(pageSize);
        this.logger.info(`sql : ${sql}, params : ${params}`);
        const result = await ctx.mysqlQueryByGame(sql, params);
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                item.CreateTime = ctx.transferDateTime(item.CreateTime);
                item.EndTime = ctx.transferDateTime(item.EndTime);
                item.Balance = ctx.changeClientRatio(item.Balance);
            }
        }
        this.logger.info('result : ', JSON.stringify(result));

        // 总条数
        let page_total_sql = `select ifnull(count(*), 0) as page_total from ${tablename} where FirstName != ? and EndTime >= ? and EndTime < ?`;
        let page_total_params = [ testname, startdate, enddate ];
        if (orderStatus !== 4) {
            page_total_sql += ' and OrderStatus = ?';
            page_total_params.push(orderStatus);
        }
        if (userId !== 0) {
            page_total_sql += ' and UserId = ?';
            page_total_params.push(userId);
        }

        if (amountType !== 'ALL' && amountType !== '其他') {
            page_total_sql += ' and Amount = ?';
            page_total_params.push(amountType);
        } else if (amountType === '其他') {
            for (let i = 0; i < options.length; i++) {
                page_total_sql += ' and Amount <> ?';
                page_total_params.push(options[i]);
            }
        }
        const page_total_result = await ctx.mysqlQueryByGame(page_total_sql, page_total_params);
        this.logger.info('page_total_result : ', page_total_result);

        // 充值人数(总)
        const recharge_user_count_sql = `select count(distinct UserId) as recharge_user_count from ${tablename} where EndTime >= ? and EndTime < ? and OrderStatus = 1 and FirstName != ?`;
        const recharge_user_count_result = await ctx.mysqlQueryByGame(recharge_user_count_sql, [ startdate, enddate, testname ]);
        this.logger.info('recharge_user_count_result : ', JSON.stringify(recharge_user_count_result));
        // 充值人数(新,首) 充值人数(新,复)
        const recharge_user_new_sql = `select ${tablename}.UserId from ${tablename}
                left join ${usertable} on ${tablename}.UserId = ${usertable}.UserId where ${tablename}.EndTime >= ? and ${tablename}.EndTime < ?
                and ${usertable}.RegTime >= ? and ${usertable}.RegTime < ? and OrderStatus = 1 and FirstName != ?`;
        const recharge_user_new_result = await ctx.mysqlQueryByGame(recharge_user_new_sql, [ startdate, enddate, startdate, enddate, testname ]);
        this.logger.info('recharge_user_new_result : ', JSON.stringify(recharge_user_new_result));
        const rechargeUserIds = [];
        for (let i = 0; i < recharge_user_new_result.length; i++) {
            const item = recharge_user_new_result[i];
            if (!rechargeUserIds.includes(item.UserId)) {
                rechargeUserIds.push(item.UserId);
            }
        }
        let recharge_user_new_plural = 0;
        let recharge_user_new_first = rechargeUserIds.length;
        for (let i = 0; i < rechargeUserIds.length; i++) {
            const UserId = rechargeUserIds[i];
            const firstOrders = recharge_user_new_result.filter(item => {
                return item.UserId === UserId;
            });
            if (firstOrders.length > 1) {
                recharge_user_new_plural += 1;
            }
        }
        // 查询当前时间范围内充值的 老用户(当前时间范围之前)
        const recharge_user_old_sql = `select ${tablename}.UserId, ${tablename}.Amount, ${tablename}.EndTime from ${tablename}
                left join ${usertable} on ${tablename}.UserId = ${usertable}.UserId where ${tablename}.EndTime >= ? and ${tablename}.EndTime < ?
                and ${usertable}.RegTime < ? and OrderStatus = 1 and FirstName != ?`;
        const recharge_user_old_result = await ctx.mysqlQueryByGame(recharge_user_old_sql, [ startdate, enddate, startdate, testname ]);
        const userIds = [];
        for (let i = 0; i < recharge_user_old_result.length; i++) {
            const item = recharge_user_old_result[i];
            if (!userIds.includes(item.UserId)) {
                userIds.push(item.UserId);
            }
        }
        let recharge_users_old = 0; // 充值人数(老,首)
        let recharge_count_old = 0; // 充值金额(老,首)
        let recharge_users_rep = 0; // 充值人数(老,复)
        let recharge_count_rep = 0; // 充值金额(老,复)
        for (let i = 0; i < userIds.length; i++) {
            const UserId = userIds[i];
            // 查询老用户在当前时间范围之前是否有充值记录
            const sql = `select * from ${tablename} where UserId = ? and date(EndTime) < ? and FirstName != ? and OrderStatus = 1`;
            const orderData = await ctx.mysqlQueryByGame(sql, [ UserId, startdate, testname ]);
            // 如果 orderData 不为空，说明之前有充值，并将此用户定义为老用户复充
            if (orderData.length > 0) {
                recharge_users_rep += 1;
                for (let i = 0; i < recharge_user_old_result.length; i++) {
                    const itemData = recharge_user_old_result[i];
                    if (itemData.UserId === UserId) {
                        recharge_count_rep += itemData.Amount;
                    }
                }
            } else {
                // 如果该用户在当前时间范围之前没有充值，但在当前时间范围内有多次充值，也将该用户定义为老用户复充
                const firstOrders = recharge_user_old_result.filter(item => {
                    return item.UserId === UserId;
                });
                recharge_users_old += 1;
                if (firstOrders.length > 0) {
                    firstOrders.sort((a, b) => {
                        return a.EndTime > b.EndTime ? 1 : -1;
                    });
                    recharge_count_old += firstOrders[0].Amount;
                }
                if (firstOrders.length > 1) {
                    let num = 0;
                    for (let i = 1; i < firstOrders.length; i++) {
                        num += firstOrders[i].Amount;
                    }
                    recharge_count_rep += num;
                    recharge_users_rep += 1;
                }
            }
        }
        this.logger.info('recharge_user_old_result : ', JSON.stringify(recharge_user_old_result));
        // 订单数(总)
        const order_count_sql = `select count(*) as order_count from ${tablename} where EndTime >= ? and EndTime < ? and FirstName != ?`;
        const order_count_result = await ctx.mysqlQueryByGame(order_count_sql, [ startdate, enddate, testname ]);
        this.logger.info('order_count_result : ', JSON.stringify(order_count_result));
        // 订单数(完成)
        const order_finish_sql = `select count(*) as order_finish from ${tablename} where EndTime >= ? and EndTime < ? and OrderStatus = 1 and FirstName != ?`;
        const order_finish_result = await ctx.mysqlQueryByGame(order_finish_sql, [ startdate, enddate, testname ]);
        this.logger.info('order_finish_result : ', JSON.stringify(order_finish_result));
        // 订单数(创建)
        const order_create_sql = `select count(*) as order_create from ${tablename} where EndTime >= ? and EndTime < ? and OrderStatus = 0 and FirstName != ?`;
        const order_create_result = await ctx.mysqlQueryByGame(order_create_sql, [ startdate, enddate, testname ]);
        this.logger.info('order_create_result : ', JSON.stringify(order_create_result));
        // 订单数(异常)
        const order_error_sql = `select count(*) as order_error from ${tablename} where EndTime >= ? and EndTime < ? and OrderStatus = 2 and FirstName != ?`;
        const order_error_result = await ctx.mysqlQueryByGame(order_error_sql, [ startdate, enddate, testname ]);
        this.logger.info('order_error_result : ', JSON.stringify(order_error_result));
        // 充值金额(总)
        const amount_sql = `select ifnull(sum(Amount), 0) as amount from ${tablename} where EndTime >= ? and EndTime < ? and OrderStatus = 1`;
        const amount_result = await ctx.mysqlQueryByGame(amount_sql, [ startdate, enddate ]);
        this.logger.info('amount_result : ', JSON.stringify(amount_result));
        // 充值金额(新)
        const amount_new_sql = `select ${tablename}.UserId, ${tablename}.Amount, ${tablename}.EndTime from ${tablename}
                join ${usertable} on ${tablename}.UserId = ${usertable}.UserId where ${tablename}.EndTime >= ? and ${tablename}.EndTime < ?
                and ${usertable}.RegTime >= ? and ${usertable}.RegTime < ? and OrderStatus = 1 and FirstName != ?`;
        const amount_new_result = await ctx.mysqlQueryByGame(amount_new_sql, [ startdate, enddate, startdate, enddate, testname ]);
        const newUserIds = [];
        for (let i = 0; i < amount_new_result.length; i++) {
            const item = amount_new_result[i];
            if (!newUserIds.includes(item.UserId)) {
                newUserIds.push(item.UserId);
            }
        }
        let first_amount_new = 0;
        let plural_amount_new = 0;
        for (let i = 0; i < newUserIds.length; i++) {
            const UserId = newUserIds[i];
            const firstOrders = amount_new_result.filter(item => {
                return item.UserId === UserId;
            });
            if (firstOrders.length > 0) {
                firstOrders.sort((a, b) => {
                    return a.EndTime > b.EndTime ? 1 : -1;
                });
                first_amount_new += firstOrders[0].Amount;
                let num = 0;
                for (let i = 1; i < firstOrders.length; i++) {
                    num += firstOrders[i].Amount;
                }
                plural_amount_new += num;
            }
        }
        // 新用户订单数(总) 新用户订单数(完成) 新用户订单数(创建) 新用户订单数(异常)
        const new_orders_sql = `select 
                count(*) as total,
                count(if (OrderStatus = 1,true,null)) as success_count,
                count(if (OrderStatus = 0,true,null)) as create_count,
                count(if (OrderStatus = 2,true,null)) as error_count
                from ${tablename} left join ${usertable} on ${tablename}.UserId = ${usertable}.UserId 
                where ${tablename}.EndTime >= ? and ${tablename}.EndTime < ? and ${usertable}.RegTime >= ? and ${usertable}.RegTime < ? and FirstName != ?`;
        const new_orders_result = await ctx.mysqlQueryByGame(new_orders_sql, [ startdate, enddate, startdate, enddate, testname ]);
        this.logger.info('new_orders_result : ', JSON.stringify(new_orders_result));

        // 老用户订单数(总) 老用户订单数(完成) 老用户订单数(创建) 老用户订单数(异常)
        const old_orders_sql = `select 
                count(*) as total,
                count(if (OrderStatus = 1,true,null)) as success_count,
                count(if (OrderStatus = 0,true,null)) as create_count,
                count(if (OrderStatus = 2,true,null)) as error_count
                from ${tablename} left join ${usertable} on ${tablename}.UserId = ${usertable}.UserId 
                where ${tablename}.EndTime >= ? and ${tablename}.EndTime < ? and ${usertable}.RegTime < ? and FirstName != ?`;
        const old_orders_result = await ctx.mysqlQueryByGame(old_orders_sql, [ startdate, enddate, startdate, testname ]);
        this.logger.info('old_orders_result : ', JSON.stringify(old_orders_result));

        // 成功率
        let success_rate = 0;
        if (order_count_result[0].order_count !== 0) {
            success_rate = (order_finish_result[0].order_finish / order_count_result[0].order_count * 100).toFixed(2);
        }
        // 新用户成功率
        let new_success_rate = 0;
        if (new_orders_result[0].total !== 0) {
            new_success_rate = (new_orders_result[0].success_count / new_orders_result[0].total * 100).toFixed(2);
        }
        // 老用户成功率
        let old_success_rate = 0;
        if (old_orders_result[0].total !== 0) {
            old_success_rate = (old_orders_result[0].success_count / old_orders_result[0].total * 100).toFixed(2);
        }
        this.logger.info('success_rate : ', success_rate);
        return {
            data: result,
            page,
            page_total: page_total_result[0].page_total,
            recharge_user_count: recharge_user_count_result[0].recharge_user_count,
            recharge_user_new_first,
            recharge_user_new_plural,
            recharge_count_old,
            recharge_users_rep,
            recharge_users_old,
            recharge_count_rep,
            order_count: order_count_result[0].order_count,
            order_finish: order_finish_result[0].order_finish,
            order_create: order_create_result[0].order_create,
            order_error: order_error_result[0].order_error,
            amount: amount_result[0].amount,
            first_amount_new,
            plural_amount_new,
            success_rate,
            new_order_count: new_orders_result[0].total,
            new_order_finish: new_orders_result[0].success_count,
            new_order_create: new_orders_result[0].create_count,
            new_order_error: new_orders_result[0].error_count,
            old_order_count: old_orders_result[0].total,
            old_order_finish: old_orders_result[0].success_count,
            old_order_create: old_orders_result[0].create_count,
            old_order_error: old_orders_result[0].error_count,
            new_success_rate,
            old_success_rate,
        };
    }

    async getRechargeByCharts() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const date = reqBody.querydate;
        const sql = `select data from ${app.config.TableName.Online_Recharge_Charts} where createdate = ? and datatype = ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ `${date}`, app.config.ORCJsonType.Recharge ]);
        let data = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        ];
        if (result.length !== 0) {
            data = JSON.parse(result[0].data);
        }
        return data;
    }

    async getData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const sql = `select * from ${tablename} where CreateTime >= ? and CreateTime < ? and PayWay = ? and OrderStatus = ? order by CreateTime desc limit ?, ?`;
        const startdate = `${reqBody.startdate} 00:00:00`;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const payway = reqBody.payway;
        const result = await ctx.mysqlQueryByGame(sql, [ startdate, enddate, payway, 0, startPage, pageSize ]);
        let data = [];
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                const temp = result[i];
                let item = {};
                item.datetime = ctx.transferDateTime(temp.CreateTime);
                item.user_id = temp.UserId;
                item.name = temp.FirstName;
                item.phone = temp.Phone;
                item.mail = temp.Email;
                item.amount = temp.Amount;
                item.order_id = temp.Txnid;
                data.push(item);
            }
        }

        const count_sql = `select count(*) as count from ${tablename} where CreateTime >= ? and CreateTime < ? and PayWay = ? and OrderStatus = ?`;
        const count_result = await ctx.mysqlQueryByGame(count_sql, [ startdate, enddate, payway, 0 ]);
        return { onePageData: data, total: count_result[0].count };
    }

    async getDataByOrderID() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const order_id = reqBody.order_id;
        const sql = `select * from ${tablename} where Txnid = ?`;
        return await ctx.mysqlQueryByGame(sql, [ order_id ]);
    }

    async sendNotifyToServer(orderInfo) {
        const { ctx, app } = this;
        const orderMap = {
            amount: orderInfo.Amount,
            appId: '100000',
            code: '0',
            merchantId: '100000',
            orderId: orderInfo.Txnid,
            outUserId: orderInfo.UserId,
            currency: 'inr',
            passageTradeNo: orderInfo.Txnid,
            successTime: ctx.transferDateTime(orderInfo.CreateTime),
        };
        const md5 = ctx.genBMartPayRechargeNotifyMD5(orderMap);
        this.logger.info('md5 : ', JSON.stringify(md5));
        orderMap.sign = md5;
        orderMap.outOrderNo = orderInfo.Txnid;
        const result = await app.curl(`${app.config.GameURL}/bmartpay`, {
            // dataType: 'json',
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: orderMap,
        });
        return result.data;
    }

    async notifyServerBySerPay(orderInfo) {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const ordStatus = reqBody.ordStatus;
        const orderMap = {
            version: '2.1',
            orgNo: '8210400669',
            custId: '21040900002233',
            custOrderNo: orderInfo.Txnid,
            prdOrdNo: '20210412192956269212',
            ordAmt: Number.parseInt(orderInfo.Amount * 100),
            ordTime: '20210412192956',
            payAmt: Number.parseInt(orderInfo.Amount * 100),
            ordStatus,
        };
        const md5 = this.genMD5BySerPay(orderMap);
        orderMap.sign = md5;
        this.logger.info(`orderMap : ${JSON.stringify(orderMap)}`);
        const result = await app.curl(`${app.config.GameURL}/serpay`, {
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: orderMap,
        });
        this.logger.info(`result : ${JSON.stringify(result)}`);
        return result.data;
    }

    genMD5BySerPay(dataMap) {
        const { ctx } = this;
        const str = 'version orgNo custId custOrderNo prdOrdNo ordAmt ordTime payAmt ordStatus';
        const result = ctx.sortByASCII(str);
        let data = '';
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            data += `${item}=${dataMap[item]}`;
            if (i < result.length - 1) {
                data += '&';
            } else {
                data += `&key=${SerPayKey}`;
            }
        }
        return ctx.genMD5(data);
    }

    async getUserDetail() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const userId = reqBody.userId;
        const sql = `select UserId, PayGold, Gold, WinGold, PayWinGold, FbId, Phone, RegTime, TotalPayIn, TotalPayOut from ${usertable} where UserId = ?`;
        const result = await ctx.mysqlQueryByGame(sql, [ userId ]);
        result[0].RegTime = ctx.transferDateTime(result[0].RegTime);
        result[0].Gold = ctx.changeClientRatio(result[0].Gold);
        result[0].PayGold = ctx.changeClientRatio(result[0].PayGold);
        result[0].WinGold = ctx.changeClientRatio(result[0].WinGold);
        result[0].PayWinGold = ctx.changeClientRatio(result[0].PayWinGold);
        result[0].TotalPayIn = ctx.changeClientRatio(result[0].TotalPayIn);
        result[0].TotalPayOut = ctx.changeClientRatio(result[0].TotalPayOut);

        return result[0];
    }

    async getRechargeStatisticsData() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const startdate = reqBody.startdate;
        const enddate = ctx.getAfterDate(reqBody.enddate);
        const page = reqBody.page;
        const pageSize = reqBody.pageSize;
        const startPage = (page - 1) * pageSize;
        const type = reqBody.type;
        const dbName = 'recharge_statistics';
        let sql = `select * from ${dbName} where date >= ? and date < ? and type = ? order by date desc limit ?, ?`;
        let params = [ startdate, enddate, type, startPage, pageSize ];
        const result = await ctx.mysqlQueryByLocal(sql, params);
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            item.date = ctx.transferDate(item.date);
        }
        const countSql = `select count(*) as count from ${dbName} where date >= ? and date < ? and type = ?`;
        const countParams = [ startdate, enddate, type ];
        const countResult = await ctx.mysqlQueryByLocal(countSql, countParams);
        const data = {
            page,
            page_total: countResult[0].count,
            tableData: result,
        };
        return data;
    }

    async createOrder() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        reqBody.data.UserId = Number(reqBody.data.UserId);
        reqBody.data.Amount = Number(reqBody.data.Amount);
        const sendData = reqBody.data;
        const result = await ctx.httpPost(app.config.PlayerOrder, JSON.stringify(sendData));
        if (result.code === 200) {
            this.logger.info('create order result : ', result);
            const data = result.config;
            this.logger.info('create order data : ', data);
            return data;
        }
        return null;
    }

    async operation() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const sendData = {
            UserId: reqBody.user_id,
            OrderId: reqBody.order_id,
            Accept: reqBody.isAgree,
        };
        const result = await ctx.httpPost(app.config.OperPlayerOrder, JSON.stringify(sendData));
        if (result.code === 200) {
            this.logger.info('operation order result : ', result);
            const data = result.config;
            this.logger.info('operation order data : ', data);
            return data;
        }
        return null;
    }

}

module.exports = RechargeService;
