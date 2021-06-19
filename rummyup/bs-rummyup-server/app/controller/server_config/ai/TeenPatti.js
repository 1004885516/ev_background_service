'use strict';
const Controller = require('egg').Controller;
const CardTypeArr = {
    HighCard: 0,
    Pair: 1,
    Color: 2,
    Sequenece: 3,
    PureSequence: 4,
    TrailOrSet: 5,
};

const optTypeArr = {
    GenZhu: 0,
    JiaBei: 1,
    BiPai: 2,
    QiPai: 3,
};

class TeenPattiController extends Controller {
    async index() {
        const { ctx } = this;
        const serverType = ctx.request.body.serverType;
        const serverData = await ctx.service.ai.getPolicyByServerConfig(serverType);
        let result = await ctx.service.upload.getTemplates(this.jsonToArray, serverData);
        if (result.TemplateData) {
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async uploadFileTPCC() {
        const { ctx } = this;
        ctx.body = await ctx.service.upload.uploadTemplate(this.jsonToArray, 'serverData');
    }

    async saveByOldLocal(params, createtime) {
        const { ctx } = this;
        const db_name = 'control_Card';
        const sql = `INSERT INTO ${db_name} (CreateTime, cardType, ControlCardJson) VALUES (?,?,?);`;
        const sqlParams = JSON.stringify(params);
        await ctx.mysqlQueryByOldLocal(sql, [ createtime, 2, sqlParams ]);
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const isAll = reqBody.isAll;
        const page = reqBody.page;
        const filename = reqBody.filename;
        const jsontype = reqBody.jsontype;
        const createtime = reqBody.createtime;
        const index = reqBody.index;
        const uploadData = await ctx.service.upload.getUploadData(createtime, jsontype, filename);
        if (uploadData) {
            let result;
            if (isAll) {
                if (uploadData) {
                    // if (uploadData[3] && uploadData[3].OfficeIsBig !== 1) {
                    //     let retbody = ctx.getFailedBody();
                    //     retbody.msg = '档位: 3, 荷官牌大于真人不为1';
                    //     ctx.body = retbody;
                    //     return;
                    // }
                    if (uploadData[4] && uploadData[4].OfficeIsBig !== 1) {
                        let retbody = ctx.getFailedBody();
                        retbody.msg = '档位: 4, 荷官牌大于真人不为1';
                        ctx.body = retbody;
                        return;
                    }
                }
                for (let i = 0; i < uploadData.length; i++) {
                    const data = uploadData[i];
                    result = await ctx.service.ai.notifyGameServerByTPCC(data);
                }
            } else {
                const data = uploadData.find(item => {
                    return item.Page === page;
                });
                if ((page === 3 || page === 4) && data && data.OfficeIsBig !== 1) {
                    let retbody = ctx.getFailedBody();
                    retbody.msg = `档位: ${page}, 荷官牌大于真人不为1`;
                    ctx.body = retbody;
                    return;
                }
                result = await ctx.service.ai.notifyGameServerByTPCC(data);
            }
            if (result.success) {
                await ctx.service.upload.updateUploadDataByWork(jsontype);
                await ctx.service.upload.updateUploadData(createtime, jsontype, filename, 1);

                let templatefiles = await ctx.service.upload.getUploadFileList(jsontype);

                await this.saveByOldLocal(uploadData, ctx.getTimeSymbol());
                let retBody = ctx.getSuccessBody();
                retBody.result = {
                    GameSeverResult: result,
                    TemplateFiles: templatefiles,
                    TemplateIndex: index,
                };
                ctx.body = retBody;
                return;
            }
        }
        ctx.body = ctx.getFailedBody();
    }

    jsonToArray(fileJson) {
        let PolicyRankList = [];
        for (let i = 0; i < fileJson.length; i++) {
            const item = fileJson[i];
            let gearItem = {};
            gearItem.Page = i;
            gearItem.OfficeRobot = [];
            gearItem.OtherRobot = [];
            for (let j = 0; j < item.length; j++) {
                const sub = item[j];
                if (sub.CardType === 'OfficePolicy') {
                    gearItem.OfficePolicy = [ sub.HighCard, sub.Pair, sub.Color, sub.Sequenece, sub.PureSequence, sub.TrailOrSet ];
                } else if (sub.CardType === 'PlayerPolicy') {
                    gearItem.PlayerPolicy = [ sub.HighCard, sub.Pair, sub.Color, sub.Sequenece, sub.PureSequence, sub.TrailOrSet ];
                } else if (sub.CardType === 'OfficeRejectCompare') {
                    gearItem.OfficeRejectCompare = [ sub.HighCard, sub.Pair, sub.Color, sub.Sequenece, sub.PureSequence, sub.TrailOrSet ];
                } else if (sub.CardType === 'OtherRejectCompare') {
                    gearItem.OtherRejectCompare = [ sub.HighCard, sub.Pair, sub.Color, sub.Sequenece, sub.PureSequence, sub.TrailOrSet ];
                }
                if (sub.OfficeIsBig !== undefined) {
                    gearItem.OfficeIsBig = sub.OfficeIsBig;
                }
                if (sub.PolicyRank !== undefined) {
                    gearItem.PolicyRank = sub.PolicyRank;
                }
                let ctIndex = CardTypeArr[sub.CardType_1] !== undefined ? CardTypeArr[sub.CardType_1] : -1;
                if (ctIndex !== -1) {
                    if (!gearItem.OfficeRobot[ctIndex]) {
                        gearItem.OfficeRobot[ctIndex] = {};
                    }
                    gearItem.OfficeRobot[ctIndex].CardType = ctIndex;

                    if (!gearItem.OtherRobot[ctIndex]) {
                        gearItem.OtherRobot[ctIndex] = {};
                    }
                    gearItem.OtherRobot[ctIndex].CardType = ctIndex;

                    if (sub.OfficeRobot === 'KanPai') {
                        gearItem.OfficeRobot[ctIndex].SeenCard = [];
                        for (let k = 1; k < 11; k++) {
                            const data = sub[`${k}`];
                            gearItem.OfficeRobot[ctIndex].SeenCard.push(data);
                        }
                    } else {
                        let optIndex = optTypeArr[sub.OfficeRobot] !== undefined ? optTypeArr[sub.OfficeRobot] : -1;
                        if (optIndex !== -1) {
                            if (!gearItem.OfficeRobot[ctIndex].RobotOper) {
                                gearItem.OfficeRobot[ctIndex].RobotOper = [];
                            }
                            for (let k = 1; k < 11; k++) {
                                const data = sub[`${k}`];
                                if (!gearItem.OfficeRobot[ctIndex].RobotOper[k - 1]) {
                                    gearItem.OfficeRobot[ctIndex].RobotOper[k - 1] = [];
                                }
                                gearItem.OfficeRobot[ctIndex].RobotOper[k - 1][optIndex] = data;
                            }
                        }
                    }
                    if (sub.OtherRobot === 'KanPai') {
                        gearItem.OtherRobot[ctIndex].SeenCard = [];
                        for (let k = 1; k < 11; k++) {
                            const data = sub[`${k}_1`];
                            gearItem.OtherRobot[ctIndex].SeenCard.push(data);
                        }
                    } else {
                        let optIndex = optTypeArr[sub.OtherRobot] !== undefined ? optTypeArr[sub.OtherRobot] : -1;
                        if (optIndex !== -1) {
                            if (!gearItem.OtherRobot[ctIndex].RobotOper) {
                                gearItem.OtherRobot[ctIndex].RobotOper = [];
                            }
                            for (let k = 1; k < 11; k++) {
                                const data = sub[`${k}_1`];
                                if (!gearItem.OtherRobot[ctIndex].RobotOper[k - 1]) {
                                    gearItem.OtherRobot[ctIndex].RobotOper[k - 1] = [];
                                }
                                gearItem.OtherRobot[ctIndex].RobotOper[k - 1][optIndex] = data;
                            }
                        }
                    }
                }
            }
            PolicyRankList.push(gearItem);
        }
        return PolicyRankList;
    }
}

module.exports = TeenPattiController;
