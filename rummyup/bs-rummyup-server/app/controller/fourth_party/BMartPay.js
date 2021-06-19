'use strict';
const Controller = require('egg').Controller;

class BMartPayController extends Controller {
    async recharge() {
        const { ctx } = this;
        const result = await ctx.service.bmartpay.requestRecharge();
        if (result.code === '0') {
            // 保存订单
            // await ctx.service.bmartpay.insertRechargeOrder(result.data.orderId);
            let retBody = ctx.getSuccessBody();
            retBody.result = {
                jumpUrl: result.data.jumpUrl,
                code: result.code,
            };
            ctx.body = retBody;
        } else {
            let retBody = ctx.getFailedBody();
            retBody.result = {
                code: result.code,
            };
            ctx.body = retBody;
        }
    }

    async rechargeNofity() {
        const { ctx } = this;
        // const reqBody = ctx.request.body;
        // const result = await ctx.service.bmartpay.updateRechargeOrder();
        // if (result) {
            // await ctx.service.user.sendGold(result.user_id, result.amount);
        // }
        ctx.body = 'success';
    }

    async withdraw() {
        const { ctx } = this;
        const result = await ctx.service.bmartpay.requestWithdraw();
        if (result.code === 0) {
            let retBody = ctx.getSuccessBody();
            retBody.result = {
            };
            ctx.body = retBody;
        } else {
            let retBody = ctx.getFailedBody();
            ctx.body = retBody;
        }
    }

    async withdrawNofity() {
        const { ctx } = this;
        // const reqBody = ctx.request.body;
        ctx.body = 'success';
    }

    async manualWithdraw() {
        const { ctx } = this;
        // {"amount":"1.20","appId":"100000204","code":"1","currency":"","failMessage":"",
        // "merchantId":"10131","notifyParam":"","orderId":"202101161415287559940610",
        // "outOrderNo":"688262571610777696997","outUserId":"68826257","payAccount":"shshhsh@qq.com",
        // "realAmount":"1.20","sign":"5c6698458e9b3b4dd62a62cfbc6438e2","successTime":"2021-01-16 14:15:30"}
        // amount, appId, code, currency, merchantId, orderId, outOrderNo, outUserId, payAccount, realAmount, successTime
        // amount=1.20&appId=100000204&code=1&currency=&merchantId=10131&orderId=202101161415287559940610&outOrderNo=688262571610777696997&outUserId=68826257&payAccount=shshhsh@qq.com&realAmount=1.20&successTime=2021-01-16 14:15:30&key=EQ7VEBV6KH5BCT5N
        // channelCode=XXXX&outOrderNo=XXXXXX&outUserId=XXXXX&payAccount=XXXXXXXX&payAmount=2000&payType=7&key=XXXXXXX
        // const result = await ctx.genBMartPayWithdrawNotify('1.20', '100000204', '1', '', '10131', '202101161415287559940610', '688262571610777696997', '68826257', 'shshhsh@qq.com', '1.20', '2021-01-16 14:15:30');
        // const result = await ctx.service.bmartpay.manualWithdraw(3);
        let arr = await ctx.genRandomArray(30, 30, 20, 10, 8, 2);

        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        let e = 0;
        let f = 0;

        let n = 0;
        let last = 0;
        let g = 0;

        let clast = -1;
        for (let i = 0; i < 10000; i++) {
            let ran = ctx.randomInt(0, 99);
            if (arr[ran] === clast && clast > 1) {
                clast = -1;
                ran = ctx.randomInt(0, 99);
            }
            last = -1;
            if (arr[ran] === 0) {
                a += 1;
                clast = 0;
            } else if (arr[ran] === 1) {
                b += 1;
                clast = 1;
            } else if (arr[ran] === 2) {
                c += 1;
                last = 2;
                clast = 2;
            } else if (arr[ran] === 3) {
                d += 1;
                clast = 3;
            } else if (arr[ran] === 4) {
                e += 1;
                clast = 4;
            } else if (arr[ran] === 5) {
                f += 1;
                clast = 5;
            }
            if (last === 2) {
                n += 1;
                if (n >= 3) {
                    g += 1;
                    n = 0;
                }
            } else {
                n = 0;
            }
        }
        const result = {
            length: arr.length,
            a, b, c, d, e, f,
            tonghua: g,
            array: arr,
        };
        ctx.body = result;
    }

}

module.exports = BMartPayController;
