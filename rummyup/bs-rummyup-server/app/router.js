'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);

    router.post('/login', controller.login.login.index);
    router.post('/register', controller.login.register.index);

    router.get('/realtime_data', controller.todayData.realtimeData.index);
    router.post('/event_data', controller.todayData.eventData.form);

    // 历史数据-分包数据
    router.post('/package_data', controller.historyData.packageData.form);
    // 历史数据-留存数据
    router.post('/user_keep', controller.historyData.userKeep.form);
    router.post('/user_keep_mediasource', controller.historyData.userKeep.getMediaSources);

    // 历史数据-用户流失金币
    router.post('/user_lose_gold', controller.historyData.userLoseGold.form);

    // 历史数据-活跃数据
    router.post('/active_data', controller.historyData.activeData.form);
    // 用户分析菜单选项
    router.post('/option_menu', controller.historyData.activeData.getOptionMenu);
    // 历史数据-充值数据
    router.post('/recharge_data', controller.historyData.rechargeData.form);
    // 用户画像
    router.post('/user_data', controller.historyData.userData.form);
    // 历史数据-场次数据
    router.post('/session_data', controller.historyData.sessionData.form);

    // 服务器配置-渠道配置
    router.get('/channel_package', controller.serverConfig.channel.package.index);
    router.post('/channel_package', controller.serverConfig.channel.package.form);

    // 商城配置BMart
    router.post('/shop_config_bmart', controller.serverConfig.shop.bMartConfig.index);
    router.post('/shop_config_bmart_save', controller.serverConfig.shop.bMartConfig.form);
    router.post('/upload_file_scb', controller.serverConfig.shop.bMartConfig.uploadFileShopConfig);

    // 商城配置Funzone
    router.post('/shop_config_fun', controller.serverConfig.shop.funzoneConfig.index);
    router.post('/shop_config_fun_save', controller.serverConfig.shop.funzoneConfig.form);
    router.post('/upload_file_scf', controller.serverConfig.shop.funzoneConfig.uploadFileShopConfig);

    // 商城配置Grepay
    router.post('/shop_config_grepay', controller.serverConfig.shop.grepayConfig.index);
    router.post('/shop_config_grepay_save', controller.serverConfig.shop.grepayConfig.form);
    router.post('/upload_file_grepay', controller.serverConfig.shop.grepayConfig.uploadFileShopConfig);

    // 商城配置payway
    router.get('/shop_payway_config', controller.serverConfig.shop.payway.index);
    router.post('/shop_payway_config', controller.serverConfig.shop.payway.form);

    // 商城配置opther配置
    router.get('/shop_other_config', controller.serverConfig.shop.otherConfig.index);
    router.post('/shop_other_config', controller.serverConfig.shop.otherConfig.form);

    // 玩家定义
    router.get('/game_player', controller.serverConfig.definition.gamePlayer.index);
    router.post('/game_player', controller.serverConfig.definition.gamePlayer.form);

    // 牌型定义
    router.get('/card_type', controller.serverConfig.definition.cardType.index);
    router.post('/card_type', controller.serverConfig.definition.cardType.form);

    // 提充及充值档位定义
    router.get('/recharge_and_rank', controller.serverConfig.definition.rechargeAndRank.index);
    router.post('/recharge_and_rank', controller.serverConfig.definition.rechargeAndRank.form);

    // 金币池配置
    router.get('/gold_pool_config', controller.serverConfig.definition.goldPoolConfig.index);
    router.post('/gold_pool_config', controller.serverConfig.definition.goldPoolConfig.form);

    // 金币池增加概率
    router.get('/gold_pool_add', controller.serverConfig.definition.goldPoolAdd.index);
    router.post('/gold_pool_add', controller.serverConfig.definition.goldPoolAdd.form);

    // BMartPay充值
    router.post('/bmartpay_recharge', controller.fourthParty.bMartPay.recharge);
    router.post('/bmartpay_recharge_nofity', controller.fourthParty.bMartPay.rechargeNofity);
    // BMartPay提现
    router.post('/bmartpay_withdraw', controller.fourthParty.bMartPay.withdraw);
    router.post('/bmartpay_withdraw_nofity', controller.fourthParty.bMartPay.withdrawNofity);

    router.get('/manual_withdraw', controller.fourthParty.bMartPay.manualWithdraw);

    router.get('/test_card', controller.test.card.index);
    router.post('/test_card', controller.test.card.form);

    // TeenPatti ai 配牌
    router.post('/ai_teenpatti', controller.serverConfig.ai.teenPatti.index);
    router.post('/ai_teenpatti_save', controller.serverConfig.ai.teenPatti.form);
    router.post('/upload_file_tpcc', controller.serverConfig.ai.teenPatti.uploadFileTPCC);

    // TP充值玩家控牌
    router.post('/ai_tprecharge', controller.serverConfig.ai.tPrecharge.index);
    router.post('/ai_tprecharge_save', controller.serverConfig.ai.tPrecharge.form);
    router.post('/upload_file_tprecharge', controller.serverConfig.ai.tPrecharge.uploadFileTPrecharge);

    // AK47 ai 配牌
    router.post('/ai_ak47', controller.serverConfig.ai.aK47.index);
    router.post('/ai_ak47_save', controller.serverConfig.ai.aK47.form);
    router.post('/upload_file_ai_ak47', controller.serverConfig.ai.aK47.uploadFileAIak47);

    // // LowestJoker ai 配牌
    router.post('/ai_lowest_joker', controller.serverConfig.ai.lowestJoker.index);
    router.post('/ai_lowest_joker_save', controller.serverConfig.ai.lowestJoker.form);
    router.post('/upload_file_ai_lj', controller.serverConfig.ai.lowestJoker.uploadFileAiLj);

    // // HighestJoker ai 配牌
    router.post('/ai_highest_joker', controller.serverConfig.ai.highestJoker.index);
    router.post('/ai_highest_joker_save', controller.serverConfig.ai.highestJoker.form);
    router.post('/upload_file_ai_hj', controller.serverConfig.ai.highestJoker.uploadFileAiHj);

    // Rummy ai 配牌
    router.post('/ai_rummy', controller.serverConfig.ai.rummy.index);
    router.post('/ai_rummy_save', controller.serverConfig.ai.rummy.form);
    router.post('/upload_file_rcc', controller.serverConfig.ai.rummy.uploadFileRCC);

    // Rummy 场次配置
    router.post('/session_rummy', controller.serverConfig.session.rummy.index);
    router.post('/session_rummy_save', controller.serverConfig.session.rummy.form);
    router.post('/upload_file_sr', controller.serverConfig.session.rummy.uploadFileSessionRummy);

    // 2人Rummy 场次配置
    router.post('/session_rummy_2p', controller.serverConfig.session.twoPersonsRummy.index);
    router.post('/session_rummy_2p_save', controller.serverConfig.session.twoPersonsRummy.form);
    router.post('/upload_file_str', controller.serverConfig.session.twoPersonsRummy.uploadFileSessionRummy);

    // TeenPatti 场次配置
    router.post('/session_teenpatti', controller.serverConfig.session.teenPatti.index);
    router.post('/session_teenpatti_save', controller.serverConfig.session.teenPatti.form);
    router.post('/upload_file_stp', controller.serverConfig.session.teenPatti.uploadFileSessionTeenPatti);

    // TeenPatti(speed) 场次配置
    router.post('/session_teenpatti_s', controller.serverConfig.session.teenPattiSpeed.index);
    router.post('/session_teenpatti_s_save', controller.serverConfig.session.teenPattiSpeed.form);
    router.post('/upload_file_sptp', controller.serverConfig.session.teenPattiSpeed.uploadFileSessionTeenPattiSpeed);

    // Practice 场次配置
    router.post('/session_practice', controller.serverConfig.session.practice.index);
    router.post('/session_practice_save', controller.serverConfig.session.practice.form);
    router.post('/upload_file_practice', controller.serverConfig.session.practice.uploadFileSessionPractice);

    // AK47 场次配置
    router.post('/session_ak47', controller.serverConfig.session.aK47.index);
    router.post('/session_ak47_save', controller.serverConfig.session.aK47.form);
    router.post('/upload_file_ak47', controller.serverConfig.session.aK47.uploadFileSessionAK47);

    // LowestJoker 场次配置
    router.post('/session_lowest_joker', controller.serverConfig.session.lowestJoker.index);
    router.post('/session_lowest_joker_save', controller.serverConfig.session.lowestJoker.form);
    router.post('/upload_file_lj', controller.serverConfig.session.lowestJoker.uploadFileSessionLowestJoker);

    // HighestJoker 场次配置
    router.post('/session_highest_joker', controller.serverConfig.session.highestJoker.index);
    router.post('/session_highest_joker_save', controller.serverConfig.session.highestJoker.form);
    router.post('/upload_file_hj', controller.serverConfig.session.highestJoker.uploadFileSessionHighestJoker);

    // DragonVSTiger 场次配置
    router.post('/session_dragon_tiger', controller.serverConfig.session.dragonTiger.index);
    router.post('/session_dragon_tiger_save', controller.serverConfig.session.dragonTiger.form);
    router.post('/upload_file_dt', controller.serverConfig.session.dragonTiger.uploadFileSessionDragonTiger);

    // 控牌开关
    router.get('/ai_switch', controller.serverConfig.ai.switch.index);
    router.post('/ai_switch', controller.serverConfig.ai.switch.form);

    // 机器人补位
    router.get('/ai_filling', controller.serverConfig.ai.filling.index);
    router.post('/ai_filling', controller.serverConfig.ai.filling.form);

    // TP机器人补位
    router.get('/ai_filling_tp', controller.serverConfig.ai.tPFilling.index);
    router.post('/ai_filling_tp', controller.serverConfig.ai.tPFilling.form);

    // 触发配置
    router.post('/ai_trigger_config', controller.serverConfig.ai.triggerConfig.index);
    router.post('/ai_trigger_config_save', controller.serverConfig.ai.triggerConfig.form);
    router.post('/upload_file_trigger', controller.serverConfig.ai.triggerConfig.uploadFileTrigger);

    // 充值玩家触发配置
    router.post('/ai_trigger_config_r', controller.serverConfig.ai.triggerConfigR.index);
    router.post('/ai_trigger_config_r_save', controller.serverConfig.ai.triggerConfigR.form);
    router.post('/upload_file_trigger_r', controller.serverConfig.ai.triggerConfigR.uploadFileTriggerR);

    // 事件配置
    router.post('/ai_event', controller.serverConfig.ai.eventConfig.index);
    router.post('/ai_event_save', controller.serverConfig.ai.eventConfig.form);
    router.post('/upload_file_event', controller.serverConfig.ai.eventConfig.uploadFileEvent);

    // 充值事件牌型概率
    router.post('/ai_recharge_card_config', controller.serverConfig.ai.rechargeCardConfig.index);
    router.post('/ai_recharge_card_config_save', controller.serverConfig.ai.rechargeCardConfig.form);
    router.post('/upload_file_recharge_card', controller.serverConfig.ai.rechargeCardConfig.uploadFileRechargeCard);

    // 操作配置
    router.post('/ai_operation_config', controller.serverConfig.ai.operationConfig.index);
    router.post('/upload_file_operation', controller.serverConfig.ai.operationConfig.uploadFileOperation);

    // 场次额度
    router.get('/ai_session_limit', controller.serverConfig.ai.sessionLimit.index);
    router.post('/ai_session_limit', controller.serverConfig.ai.sessionLimit.form);

    // 活动 转盘配置
    router.get('/activity_turntable', controller.serverConfig.activity.turntable.index);
    router.post('/activity_turntable', controller.serverConfig.activity.turntable.form);
    router.post('/upload_file_turntable', controller.serverConfig.activity.turntable.uploadFileTurntable);

    // 活动 新用户赠送
    router.get('/activity_newusergive', controller.serverConfig.activity.newUserGive.index);
    router.post('/activity_newusergive', controller.serverConfig.activity.newUserGive.form);

    // 活动 签到活动
    router.get('/activity_login', controller.serverConfig.activity.login.index);
    router.post('/activity_login', controller.serverConfig.activity.login.form);

    // 活动 限时活动配置
    router.get('/activity_limit', controller.serverConfig.activity.limitActivity.index);
    router.post('/activity_limit', controller.serverConfig.activity.limitActivity.form);

    // 活动 首充活动配置
    router.get('/activity_first', controller.serverConfig.activity.firstActivity.index);
    router.post('/activity_first', controller.serverConfig.activity.firstActivity.form);

    // 活动 宣传栏配置
    router.get('/bulletin_board', controller.serverConfig.activity.bulletinActive.index);
    router.post('/bulletin_board', controller.serverConfig.activity.bulletinActive.form);

    // 活动 活动显示配置
    router.get('/activity_show', controller.serverConfig.activity.showActivity.index);
    router.post('/activity_show', controller.serverConfig.activity.showActivity.form);
    // 设置新手引导相关配置
    router.post('/set_noviciate', controller.serverConfig.activity.showActivity.setNoviciate);

    // 活动 周卡配置
    router.get('/weeks_card', controller.serverConfig.activity.weeksCard.index);
    router.post('/weeks_card', controller.serverConfig.activity.weeksCard.form);

    // 活动 余额弹窗
    router.get('/balance_pop_up', controller.serverConfig.activity.balancePopUp.index);
    router.post('/balance_pop_up', controller.serverConfig.activity.balancePopUp.form);

    // 活动 新用户充值配置
    router.get('/new_user_recharge', controller.serverConfig.activity.newUserRecharge.index);
    router.post('/new_user_recharge', controller.serverConfig.activity.newUserRecharge.form);

    // 查询用户信息
    router.post('/gm_query_user', controller.serverConfig.gm.user.queryUser);
    router.post('/gm_change_cards', controller.serverConfig.gm.user.changeCards);
    router.post('/gm_change_gold', controller.serverConfig.gm.user.changeGold);
    router.post('/gm_change_gears', controller.serverConfig.gm.user.changeGears);

    // 更新配置
    router.get('/server_update', controller.serverConfig.gm.update.index);
    router.post('/server_update', controller.serverConfig.gm.update.form);

    // 设置是否允许相同IP和相同设备ID进入同一房间
    router.post('/set_ip_config', controller.serverConfig.gm.update.setIpConfig);

    router.post('/gm_recharge', controller.serverConfig.gm.recharge.form);
    router.post('/gm_recharge_notify', controller.serverConfig.gm.recharge.callRecharge);
    // 提现本地回调
    router.post('/gm_payout_notify', controller.serverConfig.gm.payout.notify);

    // 获取跑马灯
    router.get('/gm_marquee', controller.serverConfig.gm.marquee.index);
    // 设置跑马灯
    router.post('/gm_marquee', controller.serverConfig.gm.marquee.form);
    // 获取跑马灯(游戏)
    router.get('/gm_marquee_game', controller.serverConfig.gm.marquee.getMarqueeGame);
    // 设置跑马灯(游戏)
    router.post('/gm_marquee_game', controller.serverConfig.gm.marquee.setMarqueeGame);

    // 充值查询
    router.post('/recharge_query', controller.users.rechargeQuery.form);
    // 查询用户详细信息
    router.post('/get_user_detail', controller.users.rechargeQuery.getUserData);
    // 充值统计
    router.post('/recharge_statistics', controller.users.rechargeStatistics.form);

    // 用户提现
    router.post('/withdraw_manage', controller.users.withdrawManage.form);
    router.post('/withdraw_manage_notify', controller.users.withdrawManage.notify);

    // 在线和充值图表
    router.post('/online_recharge_charts', controller.todayData.onlineRecharge.form);

    // 用户金币图表
    router.post('/user_gold_charts', controller.historyData.userGoldCharts.form);

    // 性能监控图表
    router.post('/pc_info_charts', controller.todayData.pCInfoCharts.form);

    // 用户场次图表
    router.post('/session_charts', controller.historyData.userSessionCharts.form);

    // 客户端数据打点
    router.post('/dotdata', controller.dot.data.form);
    router.post('/getdotdata', controller.dot.data.getData);

    // 验证码查询
    router.post('/kyc_manage', controller.users.kYCManage.form);

    // 验证码查询
    router.post('/otp_query', controller.users.oTPQuery.form);

    // 邀请返利查询
    router.post('/invite_query', controller.users.inviteQuery.form);

    // 档位输赢
    router.post('/user_gears', controller.users.userGears.form);

    // 发送系统邮件
    router.post('/send_system_mail', controller.serverConfig.mail.system.form);
    // 发送用户邮件
    router.post('/send_user_mail', controller.serverConfig.mail.user.form);
    // 搜索邮件
    router.post('/search_mail', controller.serverConfig.mail.cancel.search);
    // 取消邮件
    router.post('/cancel_mail', controller.serverConfig.mail.cancel.cancel);
    // 充值邮件
    router.get('/recharge_mail', controller.serverConfig.mail.recharge.index);
    router.post('/recharge_mail', controller.serverConfig.mail.recharge.form);
    // 设置,获取otp信息
    router.get('/get_otp_config', controller.serverConfig.otp.config.get);
    router.post('/set_otp_config', controller.serverConfig.otp.config.form);

    // 活跃用户查询
    router.post('/active_user_sift', controller.users.activeUserSift.form);

    // 金币查询
    router.post('/gold_query', controller.users.goldQuery.index);

    // 关键数据
    router.post('/important_data', controller.historyData.importantData.index);

    // 客户系统配置
    router.get('/system_config', controller.serverConfig.customer.systemConfig.index);
    router.post('/system_config', controller.serverConfig.customer.systemConfig.form);

    // 创建订单
    router.post('/create_order', controller.users.createOrder.form);
    // 同意/拒绝订单
    router.post('/order_manage_notify', controller.users.createOrder.operation);

    // 获取显示金额
    router.post('/amount_option', controller.serverConfig.shop.funzoneConfig.index);

    // 对局数据
    router.post('/play_game_data', controller.historyData.playGameData.form);

    // 金币结余
    router.post('/gold_surplus', controller.historyData.goldSurplus.form);

    // 获取限时活动数据
    router.post('/activity_limit_data', controller.serverConfig.activity.activityData.getActivity);

    // 获取破产活动数据
    router.post('/go_broke_data', controller.serverConfig.activity.activityData.getActivity);

    // 获取新用户充值活动数据
    router.post('/new_user_recharge_data', controller.serverConfig.activity.activityData.getNewUserRechargeData);
};
