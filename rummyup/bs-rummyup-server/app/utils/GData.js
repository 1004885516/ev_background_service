'use strict';

module.exports = {
    SqlType: {
        get: 0,
        select: 1,
        update: 2,
        insert: 3,
        delete: 4,
    },

    // 上传文件类型
    UploadFileType: {
        Practice: 0, // 练习场
        AiTeenPatti: 1, // ai配置 tp
        AiRummy: 2, // ai配置 rummy
        AiRummyRobot: 3, // ai配置 rummy机器人
        SessionTeenPatti: 4, // 场次配置 tp
        SessionRummy: 5, // 场次配置 rummy
        Turntable: 6, // 活动 转盘
        TwoPersonsRummy: 7, // 二人rummy场次配置
        SessionTeenPattiSpeed: 8, // 快速TP配置
        AK47: 9, // AK47场次配置
        LowestJoker: 10, // LowestJoker 场次配置
        HighestJoker: 11, // HighestJoker 场次配置
        DragonVSTiger: 12, // 龙虎斗场次配置
        AIAK47: 13, // ai配置 AK47配置
        AILowestJoker: 14, // ai配置 LowestJoker配置
        AIHighestJoker: 15, // ai配置 HighestJoker配置
        TriggerConfig: 16, // 触发配置
        TriggerConfigR: 25, // 充值玩家触发配置
        EventConfig: 17, // 事件配置
        OperationConfig: 18, // 操作配置
        TPrechargeConfig: 19, // TP充值玩家控牌
        RechargeCardConfig: 26, // 充值事件牌型概率

        ShopBMartConfig: 20, // 商城配置BMart
        ShopFunzoneConfig: 21, // 商城配置Funzone
        ShopGrepayConfig: 22, // 商城配置Funzone
        AIRummy2User: 23, // 二人rummy控牌配置
        AIRummy2UserRobot: 24, // 二人rummy机器人控牌配置
    },

    JsonDataType: {
        Switch: 0,
        Filling: 1,
        NewUserGive: 2,
    },
    // OnlineRechargeChartsType
    ORCJsonType: {
        Online: 0,
        Recharge: 1,
        FreeMem: 3,
        MemUsage: 4,
        CpuUsage: 5,
    },

    // 充值曲线图3行数据类型
    RechargeDataType: {
        Users: 0, // 充值人数
        Orders: 1, // 订单数
        Amount: 2, // 充值金额
    },

    // 用户金币图表
    ChartsType: {
        TotalGold: 0, // 总金币
        RobotGold: 1, // 机器人金币
        TeenPattiSession: 3, // 场次图表统计
        QuickTPSession: 4,
        Ak47Session: 5,
        RummySession: 6,
        Rummy2UserSession: 7,
        LowJokerSession: 8,
        HighJokerSession: 9,
    },

    TableName: {
        Json: 'config_json',
        Upload_File_Json: 'upload_file_json',
        Online_Recharge_Charts: 'online_recharge_charts',
        Keep_Statistics: 'keep_statistics',
        Keep_Active_Statistics: 'keep_active_statistics',
        Keep_Pay_Statistics: 'keep_pay_statistics',
        User_Game: 'User',
        Login_log: 'Login_log',
        User_Gold_Charts: 'user_gold_charts',
        PlayerRecord: 'PlayerRankRecord_',
    },

    ActiveUserType: {
        RecentActive: 0, // 最近活跃
        TotalGoldMax: 1, // 总金币最多
        GearGoldMax: 2, // 档位金币最多
        WinGoldMax: 3, // 可提现最多
        GoldMax: 4, // 不可提现最多
        PayInMax: 5, // 充值最多
        PayOutMax: 6, // 提现最多
        TeenPattiSessionMax: 7, // TeenPatti场次最多
        RummySessionMax: 8, // Rummy场次最多
        Rummy2UserSessionMax: 9, // 2人Rummy场次最多
        QuickTPSessionMax: 10, // 快速TP场次最多
        Ak47SessionMax: 11, // AK47场次最多
        LowestJokerSessionMax: 12, // LowTP场次最多
        HighestJokerSessionMax: 13, // High场次最多
    },

    isSyncOld: true, // 是否同步旧后台

    CpuUsage: 0, // CPU占用率
    PCInfoInterval: 15, // 性能监控间隔15分钟一次

    FAIL: 0,
    SUCCESS: 1,

    All: 'All',

    ChannelId: 'aurora', // 渠道ID

    PageSize: 10, // 每页显示数量

    Ratio: 10000, // 与服务器通信统一倍率

    xlsx: '.xlsx',

    // Rummy 场次模板文件
    SRTemplateName: 'sr_template.xlsx',
    // TeenPatti 场次模板文件
    STPTemplateName: 'stp_template.xlsx',
    // 二人rummy 场次模板
    TPRTemplateName: 'tpr_template.xlsx',
    // Rummy 和 Rummy Robot 控牌模板文件
    RCCTemplateName: 'rcc_template.xlsx',
    // TeenPatti 控牌模板文件
    TPCCTemplateName: 'tpcc_template.xlsx',
    AKCCTemplateName: 'akcc_template.xlsx',
    LJCCTemplateName: 'ljcc_template.xlsx',
    HJCCTemplateName: 'hjcc_template.xlsx',
    // TeenPattiSpeed 控牌模板文件
    TPSCCTemplateName: 'tpcc_template_speed.xlsx',
    // AK47 控牌模板文件
    AKTemplateName: 'tpcc_template_ak47.xlsx',
    // lowestloker 控牌模板文件
    LJTemplateName: 'tpcc_template_lowest_joker.xlsx',
    // highestjoker 控牌模板文件
    HJTemplateName: 'tpcc_template_highest_joker.xlsx',
    // dragon vs tiger 控牌模板文件
    DTTemplateName: 'tpcc_template_dragon_tiger.xlsx',
    // 活动 转盘模板文件
    TurntableTemplateName: 'turntable_template.xlsx',
    // 上传Rummy文件路径
    RFilePath: 'app/public/rummy/',
    // 上传2人Rummy文件路径
    TwoPerFilePath: 'app/public/twopersonrummy/',
    // 上传TeenPatti文件路径
    TPFilePath: 'app/public/teenpatti/',
    // 活动配置文件路径
    ACFilePath: 'app/public/activity/',
    // 模板路径
    TemplatePath: 'app/public/template/',
    // 临时上传文件目录
    TempUploadPath: 'app/public/tempupload/',
    // 商城BMart配置模板
    SCBMartTemplateName: 'shop_config_bmart_template.xlsx',
    // 商城Funzone配置模板
    SCFunzoneTemplateName: 'shop_config_funzone_template.xlsx',
    // 商城Funzone配置模板
    SCGrepayTemplateName: 'shop_config_grepay_template.xlsx',

    // AI触发配置模板
    TriggerTemplateName: 'trigger_config_template.xlsx',
    // AI充值玩家触发配置模板
    TriggerRTemplateName: 'trigger_r_config_template.xlsx',
    // AI事件配置模板
    EventTemplateName: 'event_config_template.xlsx',
    // AI操作配置模板
    OperationTemplateName: 'operation_config_template.xlsx',
    // TP充值玩家控牌模板
    TPrechargeTemplateName: 'tp_recharge_template.xlsx',
    // AI充值事件牌型概率模板
    RechargeCardTemplateName: 'recharge_card_config_template.xlsx',


    // 设置金币
    ChangeGold: '/chggold',
    // 设置挡位值
    ChangeGears: '/setrobotgold',
    // 配牌设置
    ChangeCards: '/setcard',
    // 查询在线
    OnlineUrl: '/online',
    // 打点数据
    MarkLogUrl: '/getmarklog',
    // 查询房间数
    RoomUrl: '/roomcount',
    // 设置跑马灯配置
    ConfigMarquee: '/setlamp2',
    // 获取跑马灯配置
    GetLamp: '/getlamp',
    // 设置跑马灯配置(游戏)
    SetGameLamp: '/setgamelamp',
    // 获取跑马灯配置(游戏)
    GetGameLamp: '/getgamelamp',
    // 房间配置
    RoomConfig: '/setroomconfig',
    // 在线配置
    OnlineConfig: '/onlineconfig',
    // 商城配置
    RechargeConfig: '/shopconfig',
    // 兑换配置
    ExchangeConfig: '/exchangeconfig',
    // 提现配置
    WithdrawConfig: '/withdrawalconfig',
    // 配置金币池比例
    GoldPoolConfig: '/setcapital',
    // payout平台提现参数
    PayOutConfig: '/payoutconfig',
    // 查询指定手机号码的验证码
    QueryVerCode: '/getsms',
    // 配置对应资金池档位机器人选牌的概率
    RobotRate: '/setrobotrate',
    // 获取金币池总金币
    GoldPoolInfo: '/capital',
    // 新用户赠送金币
    NewUserGive: '/setregreward',
    // 邀请活动配置参数发送游戏服务器
    ActivityInvite: '/setcashbackconfig',
    // 设置服务器状态
    SetServerStutas: '/setserverstatus',
    // 获取服务器状态
    GetServerStutas: '/getserverstatus',
    // 获取档位值修正
    GetGoldPoolCorrect: '/getextra',
    // 设置档位值修正
    SetGoldPoolCorrect: '/setextra',
    // 用户KYC审核,通知服务器
    KYCReview: '/kycreview',
    // 提审审核不通过,通知服务器
    PayoutRefuse: '/payoutverify',
    // 发送系统邮件
    SendSystemMail: '/sendsysmail',
    // 发送用户邮件
    SendUserMail: '/sendusermail',
    // 取消系统邮件
    CancelSystemMail: '/withdrasyswmail',
    // 取消用户邮件
    CancelUserMail: '/withdrauserwmail',
    // 设置充值邮件
    SetMailTemplate: '/setmailtemplate',
    // 获取充值邮件
    GetMailTemplate: '/getmailtemplate',
    // payu提现
    PayuPayout: '/payupayout',
    // TP控牌配置
    TPControlCard: '/tpdealcardpolicy',
    // Rummy控牌配置
    RControlCard: '/rummydealcardpolicy',
    // 控牌开关
    AISwitch: '/dealcardpolicyonoff',
    // 机器人补位配置
    AIFilling: '/setsupplyrate',
    // 机器人补位配置
    GetTPAIFilling: '/gettpsupplyrate',
    SetTPAIFilling: '/settpsupplyrate',
    // 活动 转盘配置
    TurntableConfig: '/setrouletteconfig',
    // 活动 获取转盘配置
    GetTurntable: '/getrouletteconfig',
    // 获取签到配置
    GetLoginConfig: '/getsignconfig',
    // 保存签到配置
    SetLoginConfig: '/setsignconfig',
    // 获取限时活动配置
    Getlimitshopconfig: '/getlimitshopconfig',
    // 设置限时活动配置
    Setlimitshopconfig: '/setlimitshopconfig',
    // 获取首冲活动配置
    Getfirstbuyconfig: '/getfirstbuyconfig',
    // 设置首冲活动配置
    Setfirstbuyconfig: '/setfirstbuyconfig',
    // 获取宣传栏配置
    Getflyerconfig: '/getflyerconfig',
    // 设置宣传栏配置
    Setflyerconfig: '/setflyerconfig',
    // 设置活动显示配置
    Setfuncconfig: '/setfuncconfig',
    // 获取活动显示配置
    Getfuncconfig: '/getfuncconfig',
    // 获取新手相关配置
    GetNewPlayerConfig: '/getnewplayerconfig',
    // 设置新手相关配置
    SetNewPlayerConfig: '/setnewplayerconfig',
    // 获取新用户充值配置
    GetNewUserActivity: '/getnewuseractivity',
    // 设置新用户充值配置
    NewUserActivity: '/newuseractivity',
    // 获取周卡配置
    Getweekvipconfig: '/getweekvipconfig',
    // 设置周卡配置
    Setweekvipconfig: '/setweekvipconfig',
    // 获取余额弹窗配置
    Getgoldremind: '/getgoldremind',
    // 设置余额弹窗配置
    Setgoldremind: '/setgoldremind',
    // 获取场次额度配置
    Getinningrank: '/getinningrank',
    // 设置场次额度配置
    Setinningrank: '/setinningrank',
    // 获取服务器更新配置
    GetServerStatus: '/getserverstatus',
    // 设置服务器更新配置
    SetServerStatus: '/setserverstatus',
    // 获取禁止相同IP，设备ID的玩家进入同一桌配置
    GetCheckipDevice: '/getcheckipdevice',
    // 设置禁止相同IP，设备ID的玩家进入同一桌配置
    SetCheckipDevice: '/setcheckipdevice',
    // 获取商城BMart配置
    GetShopBMartConfig: '/getbmartpayconfig',
    // 设置商城BMart配置
    SetShopBMartConfig: '/bmartpayconfig',
    // 设置商城Funzone配置
    SetShopFunConfig: '/funpayconfig',
    // 获取payway配置
    Getpayway: '/getpayway',
    // 设置payway配置
    Setpayway: '/setpayway',
    // 获取商城Funzone配置
    GetShopFunConfig: '/getfunpayconfig',
    // 获取商城Grepay配置
    GetSerpayConfig: '/getserpayconfig',
    // 设置商城Grepay配置
    SetSerpayConfig: '/setserpayconfig',
    // 设置OTP
    SetOTPConfig: '/setsmschannel',
    // 获得OTP
    GetOTPConfig: '/getsmschannel',
    // 获取ai服务器数据配置
    GetPolicy: '/getpolicy',
    // 获取场次服务器数据配置
    GetRoomConfig: '/getroomconfig',
    // 获取开关服务器数据配置
    Getpolicyonoff: '/getpolicyonoff',
    // 获取参数配置
    GetServerParam: '/getserverparam',
    // 设置参数配置
    SetServerParam: '/setserverparam',
    // 获取牌型配置
    GetSepline: '/getsepline',
    // 设置牌型配置
    SetSepline: '/setsepline',
    // 获取触发配置
    GetTrigger: '/gettrigger',
    // 获取充值玩家触发配置
    GetPayinTrigger: '/getpayintrigger',
    // 设置充值玩家触发配置
    SetPayinTrigger: '/setpayintrigger',
    // 设置触发配置
    SetTrigger: '/settrigger',
    // 获取事件配置
    GetOperEvent: '/getoperevent',
    // 设置事件配置
    SetOperEvent: '/setoperevent',
    // 获取当天金币查询数据
    GetGoldStat: '/getgoldstat',
    // 获取用户类型
    GetUserType: '/getusertype',
    // 获取TP充值玩家控牌配置
    GetTPrecharge: '/getuserpayindealcard',
    // 设置TP充值玩家控牌配置
    SetTPrecharge: '/setuserpayindealcard',
    // 获取提充及充值档位定义
    GetPayinRank: '/getpayinrank',
    // 设置提充及充值档位定义
    SetPayinRank: '/setpayinrank',
    // 设置充值事件牌型概率
    GetPayinHaveRobotDealCard: '/getpayinhaverobotdealcard',
    // 设置充值事件牌型概率
    SetPayinHaveRobotDealCard: '/setpayinhaverobotdealcard',
    // 获取金币池配置
    GetJackpot: '/getjackpot',
    // 设置金币池配置
    SetJackpot: '/setjackpot',
    // 获取金币池增加概率
    GetJackpotConvert: '/getjackpotconvert',
    // 设置金币池增加概率
    SetJackpotConvert: '/setjackpotconvert',
    // 创建订单
    PlayerOrder: '/playerorder',
    // 同意或者拒绝订单
    OperPlayerOrder: '/operplayerorder',
};

