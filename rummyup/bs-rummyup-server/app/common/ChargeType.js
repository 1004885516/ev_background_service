'use strict';


// type值和中文描述映射关系， 玩家金币改变原因，100以上 都是 增加, 100以下是 扣除
const ChargeType = {
    1: '扣除底注',
    2: 'TP下注',
    3: 'TP发起比牌',
    4: 'rummy 弃牌',
    5: 'rummy 输了',
    6: 'GM扣除',
    7: '兑换筹码扣除',
    8: '玩家提现扣除',
    9: '提现手续费',
    100: '扣除增加分界线',
    101: '新用户注册赠送rummy金币',
    102: 'TP获胜',
    103: 'rummy 获胜',
    104: 'GM添加',
    105: '金币兑换增加筹码',
    106: '从商店中购买rummy金币',
    107: '提现失败返还',
    108: '游客绑定fb增加的TP金币',
    109: '游客绑定fb增加的rummy金币',
    110: '被邀请的玩家获胜抽水返金币',
    111: '新用户注册赠送TP金币',
    112: 'mobb 提现失败，归还金币',
    113: '签到获取的金币',
    114: '邮件领取',
    115: '转盘获得',
    116: '周卡中领取',
    117: '限时活动中购买',
    118: '首充活动中购买',
    119: '购买黄金周卡',
    120: '购买白金周卡',
    121: '系统充值',
};

module.exports = ChargeType;
