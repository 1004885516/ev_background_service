'use strict';


const Controller = require('egg').Controller;

class KYCManageController extends Controller {

    async form() {
        const { ctx, app } = this;
        const { onePageData, totalPage } = await ctx.service.user.getKycData();
        const dataList = await this.dataFormat(ctx, app, onePageData);
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            tableData: dataList,
            page: ctx.request.body.page,
            page_total: totalPage,
        };
        ctx.body = retBody;
    }

    async dataFormat(ctx, app, onePageData) {
        const KYCURL = app.config.KYCURL;
        const dataList = [];
        onePageData.forEach(item => {
            const obj = {};
            obj.datetime = ctx.transferDateTime(item.CreateTime);
            obj.user_id = item.UserId;
            obj.name = item.FirstName;
            obj.birth = item.BirthDate;
            obj.city = item.CityState;
            obj.phone = item.Phone;
            obj.mail = item.Email;
            obj.bank = item.BankDetails;
            obj.input_address = item.Address1;
            obj.location_address = item.Address2;
            obj.credit_card_f = KYCURL + '/' + item.FrontSide;
            obj.credit_card_b = KYCURL + '/' + item.BackSide;
            obj.photo_click = KYCURL + '/' + item.PhotoClick;
            obj.pan_card = KYCURL + '/' + item.PanCard;
            obj.status = this.getStatusString(item.AuthStatus);
            dataList.push(obj);
        });
        return dataList;
    }

    getStatusString(auth_status) {
        if (auth_status === 0) {
            return '未审核';
        } else if (auth_status === 1) {
            return '等待审核';
        } else if (auth_status === 2) {
            return '审核通过';
        } else if (auth_status === 3) {
            return '审核不通过';
        }
        return '审核失败';
    }
}

module.exports = KYCManageController;
