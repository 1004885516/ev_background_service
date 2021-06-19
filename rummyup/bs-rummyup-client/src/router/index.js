import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/public/Layout.vue'

//登录
import Login from '@/views/login/Login.vue'
//注册
import Register from '@/views/login/Register.vue'
//实时数据
import RealTimeData from '@/views/today_data/RealTimeData.vue'
import RealTimeSession from '@/views/today_data/RealTimeSessionData.vue'
import RealTimeRoom from '@/views/today_data/RealTimeRoomData.vue'
import EventData from '@/views/today_data/EventData.vue'
//历史数据
import PackageData from '@/views/history_data/PackageData.vue'
import ChannelData from '@/views/history_data/ChannelData.vue'
import UserKeep from '@/views/history_data/UserKeep.vue'
import UserLoseGold from '@/views/history_data/UserLoseGold.vue'
import RechargeData from '@/views/history_data/RechargeData.vue'
import ActiveData from '@/views/history_data/ActiveData.vue'
import UserData from '@/views/history_data/UserData.vue'
import SessionData from '@/views/history_data/SessionData.vue'
import PlayGameData from '@/views/history_data/PlayGameData.vue'
import GoldSurplus from '@/views/history_data/GoldSurplus.vue'
import ImportantData from '@/views/history_data/ImportantData.vue'
//用户管理
import GoldQuery from '@/views/users/GoldQuery.vue'
import RechargeQuery from '@/views/users/RechargeQuery.vue'
import CreateOrder from '@/views/users/CreateOrder.vue'
import RechargeStatistics from '@/views/users/RechargeStatistics.vue'
import WithdrawManage from '@/views/users/WithdrawManage.vue'
import KYCManage from '@/views/users/KYCManage.vue'
import OTPQuery from '@/views/users/OTPQuery.vue'
import InviteQuery from '@/views/users/InviteQuery.vue'
import UserGears from '@/views/users/UserGears.vue'
import GMUserRead from '@/views/users/GMUserRead.vue'
//服务器配置
//--场次配置
import SessionRummy from '@/views/server_config/session/Rummy.vue'
import SessionTeenPatti from '@/views/server_config/session/TeenPatti.vue'
import SessionTwoPersonsRummy from '@/views/server_config/session/TwoPersonsRummy.vue'
import SessionTeenPattiSpeed from '@/views/server_config/session/TeenPattiSpeed.vue'
import SessionPractice from '@/views/server_config/session/Practice.vue'
import SessionAK47 from '@/views/server_config/session/AK47.vue'
import SessionLowestJoker from '@/views/server_config/session/LowestJoker.vue'
import SessionHighestJoker from '@/views/server_config/session/HighestJoker.vue'
import SessionDragonTiger from '@/views/server_config/session/DragonTiger.vue'
//--金币池配置
// import GoldPoolRummy from '@/views/server_config/gold_pool/Rummy.vue'
// import GoldPoolTeenPatti from '@/views/server_config/gold_pool/TeenPatti.vue'
// import GoldPoolGear from '@/views/server_config/gold_pool/Gear.vue'
//--ai控牌配置
import AIRummy from '@/views/server_config/ai/Rummy.vue'
import AIRummyRobot from '@/views/server_config/ai/RummyRobot.vue'

import AIRummy2User from '@/views/server_config/ai/Rummy2User.vue'
import AIRummy2UserRobot from '@/views/server_config/ai/Rummy2UserRobot.vue'

import AITeenPatti from '@/views/server_config/ai/TeenPatti.vue'
import AITPRecharge from '@/views/server_config/ai/TPrecharge.vue'
import AIak47 from '@/views/server_config/ai/AK47.vue'
import AILowestJoker from '@/views/server_config/ai/LowestJoker.vue'
import AIHighestJoker from '@/views/server_config/ai/HighestJoker.vue'
import AIDragonTiger from '@/views/server_config/ai/DragonTiger.vue'
import AISwitch from '@/views/server_config/ai/Switch.vue'
import AIFilling from '@/views/server_config/ai/Filling.vue'
import TPAIFilling from '@/views/server_config/ai/TPFilling.vue'
import SessionLimit from '@/views/server_config/ai/SessionLimit.vue'
import AITriggerConfig from '@/views/server_config/ai/TriggerConfig.vue'
import AITriggerConfigR from '@/views/server_config/ai/TriggerConfigR.vue'
import AIIncidentConfig from '@/views/server_config/ai/EventConfig.vue'
import AIOperationConfig from '@/views/server_config/ai/OperationConfig.vue'
import AIRechargeCardConfig from '@/views/server_config/ai/RechargeCardConfig.vue'
//--机器人配置
// import RobotRummy from '@/views/server_config/robot/Rummy.vue'
// import RobotTeenPatti from '@/views/server_config/robot/TeenPatti.vue'
//--活动配置
import ActivityLogin from '@/views/server_config/activity/Login.vue'
import ActivityTurntable from '@/views/server_config/activity/Turntable.vue'
import ActivityInvite from '@/views/server_config/activity/Invite.vue'
import ActivityNewUserGive from '@/views/server_config/activity/NewUserGive.vue'
import ActivityLimit from '@/views/server_config/activity/ActivityLimit.vue'
import ActivityFirst from '@/views/server_config/activity/ActivityFirst.vue'
import BulletinBoard from '@/views/server_config/activity/BulletinBoard.vue'
import ActivityShow from '@/views/server_config/activity/ActivityShow.vue'
import WeeksCard from '@/views/server_config/activity/WeeksCard.vue'
import BalancePopUp from '@/views/server_config/activity/BalancePopUp.vue'
import NewUserRecharge from '@/views/server_config/activity/NewUserRecharge.vue'
import ActivityLimitData from '@/views/server_config/activity/ActivityLimitData.vue'
import GoBrokeData from '@/views/server_config/activity/GoBrokeData.vue'
import NewUserRechargeData from '@/views/server_config/activity/NewUserRechargeData.vue'
//--商城配置
import ShopBMartConfig from '@/views/server_config/shop/BMartConfig.vue'
import ShopFunzoneConfig from '@/views/server_config/shop/FunzoneConfig.vue'
import ShopSerPayConfig from '@/views/server_config/shop/SerPayConfig.vue'
import ShopPaywayConfig from '@/views/server_config/shop/PaywayConfig.vue'
import ShopOtherConfig from '@/views/server_config/shop/OtherConfig.vue'
//--提现配置
import WithdrawGame from '@/views/server_config/withdraw/Game.vue'
import WithdrawPayout from '@/views/server_config/withdraw/Payout.vue'
// 客服配置
import SystemConfig from '@/views/server_config/customer/SystemConfig.vue'
//--定义配置
import GamePlayer from '@/views/server_config/definition/GamePlayer.vue'
import CardType from '@/views/server_config/definition/CardType.vue'
import RechargeAndRank from '@/views/server_config/definition/RechargeAndRank.vue'
import GoldPoolConfig from '@/views/server_config/definition/GoldPoolConfig.vue'
import GoldPoolAdd from '@/views/server_config/definition/GoldPoolAdd.vue'
//--邮件系统
import MailSystem from '@/views/server_config/mail/System.vue'
import MailUser from '@/views/server_config/mail/User.vue'
import MailCancel from '@/views/server_config/mail/Cancel.vue'
import MailRechargeSuccess from '@/views/server_config/mail/RechargeSuccess.vue'
import MailRechargeFail from '@/views/server_config/mail/RechargeFail.vue'
//--GM
import GMUser from '@/views/server_config/gm/User.vue'
import GMUpdate from '@/views/server_config/gm/Update.vue'
import GMMarquee from '@/views/server_config/gm/Marquee.vue'
import GMMarqueeGame from '@/views/server_config/gm/MarqueeGame.vue'
import GMRecharge from '@/views/server_config/gm/Recharge.vue'
import GMPayOut from '@/views/server_config/gm/Payout.vue'
//--渠道配置
import ChannelPackage from '@/views/server_config/channel/Package.vue'
//日志
import LogOperation from '@/views/log/Operation.vue'

// 在线和充值图表
import OnlineRechargeCharts from '@/views/today_data/OnlineRechargeCharts.vue'
// 用户金币图表
import UserGoldCharts from '@/views/history_data/UserGoldCharts.vue'
// 性能监控图表
import PCInfoCharts from '@/views/today_data/PCInfoCharts.vue'
// 场次统计图表
import SessionCharts from '@/views/history_data/SessionCharts.vue'

// 活跃用户查询
import ActiveUserSift from '@/views/users/ActiveUserSift.vue'

// 打点数据
import DotData from '@/views/today_data/DotData.vue'

//token验证异常
import TokenError from '@/views/login/TokenError.vue'

// otp渠道切换
import OTPConfig from '@/views/server_config/otp/Config.vue'

// 上传文件基础类
// import BaseUpload from '@/views/public/BaseUpload.vue'


// import ChildData from '@/views/history_data/ChildData.vue'

import TestCard from '@/views/test/Card.vue'

Vue.use(Router)

import gd from '../utils/GlobalData'
let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/Register',
            name: 'Register',
            component: Register
        },
        {
            path: '/token_error',
            name: 'TokenError',
            component: TokenError
        },
        {
            path: '/layout',
            name: 'Layout',
            component: Layout,
            redirect: 'realtime_data',
            children: [
                { path: gd.RoutePath.RealTime_Data,           name: 'RealTimeData',           component: RealTimeData },
                { path: gd.RoutePath.Realtime_Session,        name: 'RealtimeSession',        component: RealTimeSession },
                { path: gd.RoutePath.Realtime_Room,           name: 'RealtimeRoom',           component: RealTimeRoom },
                { path: gd.RoutePath.Event_Data,              name: 'EventData',              component: EventData },
                { path: gd.RoutePath.Package_Data,            name: 'PackageData',            component: PackageData },
                { path: gd.RoutePath.Channel_Data,            name: 'ChannelData',            component: ChannelData },
                { path: gd.RoutePath.User_Keep,               name: 'UserKeep',               component: UserKeep },
                { path: gd.RoutePath.User_Lose_Gold,          name: 'UserLoseGold',           component: UserLoseGold },
                { path: gd.RoutePath.Recharge_Data,           name: 'RechargeData',           component: RechargeData },
                { path: gd.RoutePath.Active_Data,             name: 'ActiveData',             component: ActiveData },
                { path: gd.RoutePath.User_Data,               name: 'UserData',               component: UserData },
                { path: gd.RoutePath.Session_Data,            name: 'SessionData',            component: SessionData },
                { path: gd.RoutePath.Play_Game_Data,          name: 'PlayGameData',           component: PlayGameData },
                { path: gd.RoutePath.Gold_Surplus,            name: 'GoldSurplus',            component: GoldSurplus },
                { path: gd.RoutePath.Important_Data,          name: 'ImportantData',          component: ImportantData },
                { path: gd.RoutePath.Gold_Query,              name: 'GoldQuery',              component: GoldQuery },
                { path: gd.RoutePath.Recharge_Query,          name: 'RechargeQuery',          component: RechargeQuery },
                { path: gd.RoutePath.Create_Order,            name: 'CreateOrder',            component: CreateOrder },
                { path: gd.RoutePath.Recharge_Statistics,     name: 'RechargeStatistics',     component: RechargeStatistics },
                { path: gd.RoutePath.Withdraw_Manage,         name: 'WithdrawManage',         component: WithdrawManage },
                { path: gd.RoutePath.KYC_Manage,              name: 'KYCManage',              component: KYCManage },
                { path: gd.RoutePath.OTP_Query,               name: 'OTPQuery',               component: OTPQuery },
                { path: gd.RoutePath.Invite_Query,            name: 'InviteQuery',            component: InviteQuery },
                { path: gd.RoutePath.User_Gears,              name: 'UserGears',              component: UserGears },
                { path: gd.RoutePath.GM_User_Read,            name: 'GMUserRead',             component: GMUserRead },
                { path: gd.RoutePath.Session_Rummy,           name: 'SessionRummy',           component: SessionRummy },
                { path: gd.RoutePath.Session_TeenPatti,       name: 'SessionTeenPatti',       component: SessionTeenPatti },
                { path: gd.RoutePath.Session_TwoPersons_Rummy,name: 'SessionTwoPersonsRummy', component: SessionTwoPersonsRummy },
                { path: gd.RoutePath.Session_TeenPatti_Speed, name: 'SessionTeenPattiSpeed',  component: SessionTeenPattiSpeed },
                { path: gd.RoutePath.Session_Practice,        name: 'SessionPractice',        component: SessionPractice },
                { path: gd.RoutePath.Session_AK47,            name: 'SessionAK47',            component: SessionAK47 },
                { path: gd.RoutePath.Session_Lowest_Joker,    name: 'SessionLowestJoker',     component: SessionLowestJoker },
                { path: gd.RoutePath.Session_Highest_Joker,   name: 'SessionHighestJoker',    component: SessionHighestJoker },
                { path: gd.RoutePath.Session_Dragon_Tiger,    name: 'SessionDragonTiger',     component: SessionDragonTiger },
                // { path: gd.RoutePath.GoldPool_Rummy,          name: 'GoldPoolRummy',          component: GoldPoolRummy },
                // { path: gd.RoutePath.GoldPool_TeenPatti,      name: 'GoldPoolTeenPatti',      component: GoldPoolTeenPatti },
                // { path: gd.RoutePath.GoldPool_gear,           name: 'GoldPoolGear',           component: GoldPoolGear },
                { path: gd.RoutePath.AI_Rummy,                name: 'AIRummy',                component: AIRummy },
                { path: gd.RoutePath.AI_Rummy_robot,          name: 'AIRummyRobot',           component: AIRummyRobot },
                { path: gd.RoutePath.AI_Rummy2User,           name: 'AIRummy2User',           component: AIRummy2User },
                { path: gd.RoutePath.AI_Rummy2User_Robot,     name: 'AIRummy2UserRobot',      component: AIRummy2UserRobot },
                { path: gd.RoutePath.AI_Teenpatti,            name: 'AITeenPatti',            component: AITeenPatti },
                { path: gd.RoutePath.AI_TPRecharge,           name: 'AITPRecharge',           component: AITPRecharge },
                { path: gd.RoutePath.AI_AK47,                 name: 'AIAK47',                 component: AIak47 },
                { path: gd.RoutePath.AI_Lowest_Joker,         name: 'AILowestJoker',          component: AILowestJoker },
                { path: gd.RoutePath.AI_Highest_Joker,        name: 'AIHighestJoker',         component: AIHighestJoker },
                { path: gd.RoutePath.AI_Dragon_Tiger,         name: 'AIDragonTiger',          component: AIDragonTiger },
                { path: gd.RoutePath.AI_Switch,               name: 'AISwitch',               component: AISwitch },
                { path: gd.RoutePath.AI_Filling,              name: 'AIFilling',              component: AIFilling },
                { path: gd.RoutePath.AI_Filling_TP,           name: 'TPAIFilling',            component: TPAIFilling },
                { path: gd.RoutePath.AI_Session_Limit,        name: 'AISessionLimit',         component: SessionLimit },
                { path: gd.RoutePath.AI_Trigger_Config,       name: 'AITriggerConfig',        component: AITriggerConfig },
                { path: gd.RoutePath.AI_Trigger_Config_R,     name: 'AITriggerConfigR',       component: AITriggerConfigR },
                { path: gd.RoutePath.AI_Event_Config,         name: 'AIIncidentConfig',       component: AIIncidentConfig },
                { path: gd.RoutePath.AI_Operation_Config,     name: 'AIOperationConfig',      component: AIOperationConfig },
                { path: gd.RoutePath.AI_Recharge_Card_Config, name: 'AIRechargeCardConfig',   component: AIRechargeCardConfig },
                // { path: gd.RoutePath.Robot_Rummy,             name: 'RobotRummy',             component: RobotRummy },
                // { path: gd.RoutePath.Robot_Teenpatti,         name: 'RobotTeenPatti',         component: RobotTeenPatti },
                { path: gd.RoutePath.Activity_Login,          name: 'ActivityLogin',          component: ActivityLogin },
                { path: gd.RoutePath.Activity_Turntable,      name: 'ActivityTurntable',      component: ActivityTurntable },
                { path: gd.RoutePath.Activity_Invite,         name: 'ActivityInvite',         component: ActivityInvite },
                { path: gd.RoutePath.Activity_NewUserGive,    name: 'ActivityNewUserGive',    component: ActivityNewUserGive },
                { path: gd.RoutePath.Activity_Limit,          name: 'ActivityLimit',          component: ActivityLimit },
                { path: gd.RoutePath.Activity_First,          name: 'ActivityFirst',          component: ActivityFirst },
                { path: gd.RoutePath.Bulletin_Board,          name: 'BulletinBoard',          component: BulletinBoard },
                { path: gd.RoutePath.Activity_Show,           name: 'ActivityShow',           component: ActivityShow },
                { path: gd.RoutePath.Weeks_Card,              name: 'WeeksCard',              component: WeeksCard },
                { path: gd.RoutePath.Balance_Pop_Up,          name: 'BalancePopUp',           component: BalancePopUp },
                { path: gd.RoutePath.New_User_Recharge,       name: 'NewUserRecharge',        component: NewUserRecharge },
                { path: gd.RoutePath.Shop_BMart_Config,       name: 'ShopBMartConfig',        component: ShopBMartConfig },
                { path: gd.RoutePath.Shop_Funzone_Config,     name: 'ShopFunzoneConfig',      component: ShopFunzoneConfig },
                { path: gd.RoutePath.Shop_SerPay_Config,      name: 'ShopSerPayConfig',       component: ShopSerPayConfig },
                { path: gd.RoutePath.Shop_Payway_Config,      name: 'ShopPaywayConfig',       component: ShopPaywayConfig },
                { path: gd.RoutePath.Shop_Other_Config,       name: 'ShopOtherConfig',        component: ShopOtherConfig },
                { path: gd.RoutePath.Withdraw_Game,           name: 'WithdrawGame',           component: WithdrawGame },
                { path: gd.RoutePath.Withdraw_Payout,         name: 'WithdrawPayout',         component: WithdrawPayout },
                { path: gd.RoutePath.System_Config,           name: 'SystemConfig',           component: SystemConfig },
                { path: gd.RoutePath.Game_Player,             name: 'GamePlayer',             component: GamePlayer },
                { path: gd.RoutePath.Card_Type,               name: 'CardType',               component: CardType },
                { path: gd.RoutePath.Recharge_And_Rank,       name: 'RechargeAndRank',        component: RechargeAndRank },
                { path: gd.RoutePath.Gold_Pool_Config,        name: 'GoldPoolConfig',         component: GoldPoolConfig },
                { path: gd.RoutePath.Gold_Pool_Add,           name: 'GoldPoolAdd',            component: GoldPoolAdd },
                { path: gd.RoutePath.Mail_System,             name: 'MailSystem',             component: MailSystem },
                { path: gd.RoutePath.Mail_User,               name: 'MailUser',               component: MailUser },
                { path: gd.RoutePath.Mail_Cancel,             name: 'MailCancel',             component: MailCancel },
                { path: gd.RoutePath.Mail_Recharge_Success,   name: 'MailRechargeSuccess',    component: MailRechargeSuccess },
                { path: gd.RoutePath.Mail_Recharge_Fail,      name: 'MailRechargeFail',       component: MailRechargeFail },
                { path: gd.RoutePath.GM_User,                 name: 'GMUser',                 component: GMUser },
                { path: gd.RoutePath.GM_Update,               name: 'GMUpdate',               component: GMUpdate },
                { path: gd.RoutePath.GM_Marquee,              name: 'GMMarquee',              component: GMMarquee },
                { path: gd.RoutePath.GM_Marquee_Game,         name: 'GMMarqueeGame',          component: GMMarqueeGame },
                { path: gd.RoutePath.GM_Recharge,             name: 'GMRecharge',             component: GMRecharge },
                { path: gd.RoutePath.GM_PayOut,               name: 'GMPayOut',               component: GMPayOut },
                { path: gd.RoutePath.Channel_Package,         name: 'ChannelPackage',         component: ChannelPackage },
                { path: gd.RoutePath.Log_Operation,           name: 'LogOperation',           component: LogOperation },

                { path: gd.RoutePath.Online_Recharge_Charts,  name: 'OnlineRechargeCharts',   component: OnlineRechargeCharts },
                { path: gd.RoutePath.User_Gold_Charts,        name: 'UserGoldCharts',         component: UserGoldCharts },
                { path: gd.RoutePath.PC_Info_Charts,          name: 'PCInfoCharts',           component: PCInfoCharts },
                { path: gd.RoutePath.Session_Charts,          name: 'SessionCharts',          component: SessionCharts },
                

                
                { path: gd.RoutePath.Active_User_Sift,        name: 'ActiveUserSift',         component: ActiveUserSift },

                { path: gd.RoutePath.Dot_Data,                name: 'DotData',                component: DotData },

                { path: gd.RoutePath.OTP_Config,              name: 'OTPConfig',              component: OTPConfig },
                
                { path: gd.RoutePath.Activity_Limit_Data,     name: 'ActivityLimitData',      component: ActivityLimitData },
                { path: gd.RoutePath.Go_Broke_Data,           name: 'GoBrokeData',            component: GoBrokeData },
                { path: gd.RoutePath.New_User_Recharge_Data,  name: 'NewUserRechargeData',    component: NewUserRechargeData },

                { path: '/test_card',           name: 'TestCard',               component: TestCard },

                // {
                //     path: '/base_upload',
                //     name: 'BaseUpload',
                //     component: BaseUpload,
                //     children: [
                //         { path: gd.RoutePath.AI_Rummy,          name: 'AIRummy',        component: AIRummy },
                //     ]
                // }
                
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    // document.title = to.matched[0].meta.title;
    // console.log('to : ', to);
    // console.log('from : ', from);
    next();
})

export default router;