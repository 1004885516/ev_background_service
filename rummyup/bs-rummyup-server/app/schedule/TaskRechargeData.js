'use strict';
const Subscription = require('egg').Subscription;

class TaskRechargeData extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            // 秒 (0 - 59, optional) 分钟 (0 - 59) 小时 (0 - 23) 日期 (1 - 31) 月份 (1 - 12) 星期 (0 - 7) (0或7都是星期日)
            // interval: '10s',
            cron: '0 20 1 * * *',
            type: 'worker',
        };
    }

    async subscribe() {
        const { app } = this;
        if (app.config.env === 'default') {
            return;
        }
        this.taskRechargeData();
    }

    async taskRechargeData() {
        const { ctx } = this;
        const packages = await ctx.service.channelPackage.getData();
        if (packages.length === 0) {
            this.logger.info('taskRechargeData packages length 0');
        } else {
            const date = ctx.getDateByAdd(-1);
            for (let i = 0; i < packages.length; i++) {
                const item = packages[i];
                const isExist = await this.selectRechargeData(item.package_id, item.apk_id, date);
                if (isExist) {
                    this.logger.info(`query date: ${date}, packageId: ${item.package_id}, apkId: ${item.apk_id} is exist.`);
                } else {
                    this.logger.info(`query date: ${date}, packageId: ${item.package_id}, apkId: ${item.apk_id} is not exist.`);
                    const data = await this.queryRechargeData(date, item.package_id, item.apk_id);
                    const insertResult = await this.insertRechargeData(data);
                    this.logger.info('insertResult : ', insertResult);
                }
            }
        }
    }

    // 查询是否有充值数据
    async selectRechargeData(packageId, apkId, date) {
        const { ctx } = this;
        const selectSql = 'select * from recharge_data where package_id = ? and apk_id = ? and date(date) = ?';
        const result = await ctx.mysqlQueryByLocal(selectSql, [ packageId, apkId, date ]);
        if (result.length === 0) {
            return false;
        }
        return true;
    }

    // 存储充值数据
    async insertRechargeData(data) {
        const { ctx } = this;
        return await ctx.mysqlByLocal(ctx.MysqlType.Insert, 'recharge_data', data);
    }

    async queryRechargeData(date, packageId, apkId) {
        const { ctx } = this;
        const activate = await this.ctx.service.user.queryActivateByPackage(packageId, apkId, date);
        // this.logger.info('activte : ', activate);

        const register = await this.ctx.service.user.queryRegisterByPackage(packageId, apkId, date);
        // this.logger.info('register : ', register);

        const register_rate = activate === 0 ? 0 : (register / activate * 100).toFixed(2);
        // this.logger.info(`register_rate : ${register_rate}%`);

        const dau = await this.ctx.service.user.queryDauByPackage(packageId, apkId, date);
        // this.logger.info(`dau : ${dau}`);

        const dau_old = await this.ctx.service.user.queryDauOldByPackage(packageId, apkId, date);
        // this.logger.info(`dau_old : ${dau_old}`);

        const recharge_result = await this.ctx.service.user.queryRechargeCount(packageId, apkId, date);
        const recharge_count = recharge_result.count.toFixed(2);
        const recharge_users = recharge_result.users;
        // this.logger.info(`recharge_count : ${recharge_count}`);
        // this.logger.info(`recharge_users : ${recharge_users}`);

        const recharge_new_result = await this.ctx.service.user.queryRechargeCountByNewUser(packageId, apkId, date);
        const recharge_count_new = recharge_new_result.count.toFixed(2);
        const recharge_users_new = recharge_new_result.users;
        // this.logger.info(`recharge_count_new : ${recharge_count_new}`);
        // this.logger.info(`recharge_users_new : ${recharge_users_new}`);

        const withdraw_result = await this.ctx.service.user.queryWithdrawCount(packageId, apkId, date);
        const witddraw_count = ctx.changeClientRatio(withdraw_result.count);
        const withdraw_users = withdraw_result.users;
        // this.logger.info(`witddraw_count : ${witddraw_count}`);
        // this.logger.info(`withdraw_users : ${withdraw_users}`);

        const witddraw_real_count = witddraw_count;
        // this.logger.info(`witddraw_real_count : ${witddraw_real_count}`);

        const tax_result = await this.ctx.service.user.queryTaxCount(packageId, apkId, date);
        const tax_count = ctx.changeClientRatio(tax_result.count);
        const tax_rebate_count = ctx.changeClientRatio(tax_result.rebate);
        // this.logger.info(`tax_count : ${tax_count}`);
        // this.logger.info(`tax_rebate_count : ${tax_rebate_count}`);

        const arpu_register = (register === 0 ? 0 : recharge_count_new / register).toFixed(2);
        // this.logger.info(`arpu_register : ${arpu_register}`);

        const arpu_dau = (dau === 0 ? 0 : recharge_count / dau).toFixed(2);
        // this.logger.info(`arpu_dau : ${arpu_dau}`);

        const arpu_recharge = (recharge_users === 0 ? 0 : recharge_count / recharge_users).toFixed(2);
        // this.logger.info(`arpu_recharge : ${arpu_recharge}`);

        const pay_rate = ((dau === 0 ? 0 : recharge_users / dau) * 100).toFixed(2);
        // this.logger.info(`pay_rate : ${pay_rate}%`);

        const pay_rate_new = ((register === 0 ? 0 : recharge_users_new / register) * 100).toFixed(2);
        // this.logger.info(`pay_rate_new : ${pay_rate_new}%`);

        const withdraw_rate = ((dau === 0 ? 0 : withdraw_users / dau) * 100).toFixed(2);
        // this.logger.info(`withdraw_rate : ${withdraw_rate}%`);

        const { recharge_count_old, recharge_users_rep, recharge_users_old, recharge_count_rep } = await this.ctx.service.user.queryRechargeCountByOldUser(packageId, apkId, date);
        const data = {
            date,
            package_id: packageId,
            apk_id: apkId,
            activate,
            register,
            register_rate,
            dau,
            dau_old,
            recharge_count,
            recharge_count_new,
            witddraw_count,
            witddraw_real_count,
            tax_count,
            tax_rebate_count,
            recharge_users,
            recharge_users_new,
            recharge_count_old,
            recharge_users_rep,
            recharge_users_old,
            recharge_count_rep,
            withdraw_users,
            arpu_register,
            arpu_dau,
            arpu_recharge,
            pay_rate,
            pay_rate_new,
            withdraw_rate,
        };
        return data;
    }
}
module.exports = TaskRechargeData;
