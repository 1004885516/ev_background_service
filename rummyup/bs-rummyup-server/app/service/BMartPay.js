'use strict';

const Service = require('egg').Service;
const recharge_url = 'https://pay.bmartpay.com/api/payment/corder';
const widthdraw_url = 'https://pay.bmartpay.com/api/payment/btrans';
const channel_code = 'QEJLR80N';
const out_user_id = '10131';

const recharge_table = 'recharge_orders_bmart';

const OrderStatus_Create = 0;
const OrderStatus_Finish = 1;
const OrderStatus_Error = 2;

class BMartPayService extends Service {

    async requestRecharge() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const channelCode = channel_code; // 平台分配给接入方的渠道编号 是
        const outUserId = out_user_id; // 接入方用户id 是
        const outOrderNo = ctx.genBMartPayOrderNo(); // 接入方订单号 是
        const commodityAmount = reqBody.commodityAmount; // 支付金额，币种：INR 示例：“1200.01” 精确到两位小数 是
        const name = reqBody.name;
        const email = reqBody.email; // 收款人邮箱，格式xxx@xxx.xxx
        const mobile = reqBody.mobile; // 收款人手机，格式10位数字,不带地区码+91
        const sign = ctx.genBMartPayRechargeMD5(channelCode, outUserId, outOrderNo, commodityAmount);
        const data = { channelCode, outUserId, outOrderNo, commodityAmount, name, email, mobile, sign };
        // this.logger.info('data : ', data);
        const result = await app.curl(recharge_url, {
            dataType: 'json',
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        });
        return result.data;
    }

    async insertRechargeOrder(orderId) {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const result = await ctx.mysqlByLocal(ctx.MysqlType.Insert, recharge_table, {
            user_id: reqBody.userId,
            create_time: ctx.getTimeSymbol(),
            amount: reqBody.commodityAmount,
            name: reqBody.name,
            email: reqBody.email,
            mobile: reqBody.mobile,
            order_id: orderId,
            status: OrderStatus_Create,
        });
        return result;
    }

    async updateRechargeOrder() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const orderId = reqBody.data.orderId;
        const code = reqBody.data.code;
        const result = await ctx.mysqlByLocal(ctx.MysqlType.Select, recharge_table, { where: { order_id: orderId } });
        if (result.length === 0) {
            // this.logger.info('error order id not exsit : ', orderId);
            return false;
        }
        // this.logger.info('updateRechargeOrder result : ', result[0]);
        let data = result[0];
        if (code === 0) {
            data.status = OrderStatus_Finish;
        } else {
            data.status = OrderStatus_Error;
        }
        await ctx.mysqlByLocal(ctx.MysqlType.Insert, recharge_table, data);
        return data;
    }

    async requestWithdraw() {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const channelCode = channel_code; // 平台分配渠道编号， 请联系平台获取
        const outUserId = reqBody.userId.toString(); // 接入方用户ID
        const outOrderNo = ctx.genBMartPayOrderNo(); // 接入方订单号
        const payType = parseInt(reqBody.payType); // 付款类型 见下表 3 Paytm(paytm手机号码(10位数字不带+91)), 4 UPI(格式为xxx@xxx 或者 手机号码(10位数字不带+91)), 7 IMPS(银行账号)
        const payAccount = reqBody.payAccount.toString(); // 跟付款类型对应的收款账号，格式见下表
        const payAmount = parseFloat(reqBody.payAmount); // 付款金额，单位印度卢比，可带2位小数
        const accountOwner = reqBody.accountOwner; // 收款人姓名，payType为4,7时必传
        const bankCode = reqBody.bankCode; // ifsc payType为7时必传
        const email = reqBody.email; // 收款人邮箱，格式xxx@xxx.xxx
        const mobile = reqBody.mobile; // 收款人手机，格式10位数字,不带地区码+91
        // const serverNotify = ''; // 代付完成后通知地址
        const sign = ctx.genBMartPayWidthdrawMD5(channelCode, outUserId, outOrderNo, payType, payAccount, payAmount);
        const data = { channelCode, outUserId, outOrderNo, payType, payAccount, payAmount, accountOwner, bankCode, email, mobile, sign };
        // this.logger.info('data : ', data);
        const result = await app.curl(widthdraw_url, {
            dataType: 'json',
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        });
        return result.data;
    }

    async manualWithdraw(id) {
        const { ctx, app } = this;
        const result = await ctx.mysqlByGame(ctx.MysqlType.Select, 'Payout', { where: { ID: id } });
        if (result.length === 0) {
            // this.logger.info(`没有找到ID:${id}的记录`);
            return;
        }
        const data = result[0];
        const details = JSON.parse(data.Details);
        const channelCode = channel_code; // 平台分配渠道编号， 请联系平台获取
        const outUserId = data.UserId; // 接入方用户ID
        const outOrderNo = data.PayoutId; // 接入方订单号
        const payType = parseInt(data.PayType); // 付款类型 见下表 3 Paytm(paytm手机号码(10位数字不带+91)), 4 UPI(格式为xxx@xxx 或者 手机号码(10位数字不带+91)), 7 IMPS(银行账号)
        const payAccount = details.PayAccount; // 跟付款类型对应的收款账号，格式见下表
        const payAmount = parseFloat(details.PayAmount); // 付款金额，单位印度卢比，可带2位小数
        const accountOwner = details.AccountOwner; // 收款人姓名，payType为4,7时必传
        const bankCode = details.BankCode; // ifsc payType为7时必传
        const email = data.Email; // 收款人邮箱，格式xxx@xxx.xxx
        const mobile = data.Phone; // 收款人手机，格式10位数字,不带地区码+91
        // const serverNotify = ''; // 代付完成后通知地址
        const sign = ctx.genBMartPayWidthdrawMD5(channelCode, outUserId, outOrderNo, payType, payAccount, payAmount);
        const params = { channelCode, outUserId, outOrderNo, payType, payAccount, payAmount, accountOwner, bankCode, email, mobile, sign };
        // this.logger.info('params : ', params);
        const httpResult = await app.curl(widthdraw_url, {
            dataType: 'json',
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: params,
        });
        return httpResult.data;
    }
}

module.exports = BMartPayService;
