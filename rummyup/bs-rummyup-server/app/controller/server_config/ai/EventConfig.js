'use strict';
const Controller = require('egg').Controller;

class EventConfigController extends Controller {
    async index() {
        const { ctx } = this;
        const serverData = await ctx.service.ai.getEventConfig();
        let result = await ctx.service.upload.getTemplates(this.jsonToArray, serverData);
        result.TemplateData = await this.getclientData(result.TemplateData);
        if (result.TemplateData) {
            let retBody = ctx.getSuccessBody();
            retBody.result = result;
            ctx.body = retBody;
        } else {
            ctx.body = ctx.getFailedBody();
        }
    }

    async uploadFileEvent() {
        const { ctx } = this;
        ctx.body = await ctx.service.upload.uploadTemplate(this.jsonToArray, 'serverData');
    }

    async form() {
        const { ctx } = this;
        const reqBody = ctx.request.body;
        const filename = reqBody.filename;
        const jsontype = reqBody.jsontype;
        const createtime = reqBody.createtime;
        const index = reqBody.index;
        const eventData = await ctx.service.upload.getUploadData(createtime, jsontype, filename);
        const operationData = await ctx.service.upload.getConfigData(18);
        if (!operationData) {
            ctx.throw('请先上传机操作配置');
        }
        const uploadData = await this.dataFormat(eventData, operationData);
        if (eventData && uploadData) {
            let result = await ctx.service.ai.setEventConfig(uploadData);
            this.logger.info('result : ', result);
            if (result.code === 200) {
                await ctx.service.upload.updateUploadDataByWork(jsontype);
                await ctx.service.upload.updateUploadData(createtime, jsontype, filename, 1);

                let templatefiles = await ctx.service.upload.getUploadFileList(jsontype);

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
        let list = [];
        if (!fileJson || !fileJson.length === 0) {
            return list;
        }
        for (let i = 0; i < fileJson[0].length; i++) {
            const item = fileJson[0][i];
            let data = {};
            data.event_id = item.ID;
            data.ai_num = item.AiNum;
            data.player_cards = item.PlayerCards;
            data.player_percent = item.PlayerPercent;
            data.office_cards = item.OfficeCards;
            data.office_percent = item.OfficePercent;
            data.other_cards = item.GeneralCards;
            data.other_percent = item.GeneralPercent;

            data.office_is_big = item.OfficeIsBig;
            data.office_ids = item.OfficeIds;
            data.office_after_dul = item.OfficeAfterDul;
            // 普通1 2 3 id
            data.other_ids1 = item.OtherIds1;
            data.other_ids2 = item.OtherIds2;
            data.other_ids3 = item.OtherIds3;
            // 普通1 2 3 行为概率
            data.other_after_dul1 = item.OtherAfterDul1;
            data.other_after_dul2 = item.OtherAfterDul2;
            data.other_after_dul3 = item.OtherAfterDul3;
            list.push(data);
        }
        return list;
    }

    async dataFormat(eventData, operationData) {
        const list = [];
        for (let i = 0; i < eventData.length; i++) {
            const item = eventData[i];
            const obj = {
                Player: {},
                Office: {},
                Other: {},
            };

            obj.EventID = item.event_id;
            obj.AiNum = item.ai_num;
            obj.OfficeIsBig = item.office_is_big;
            obj.Player.Cards = Number.isFinite(item.player_cards) ? [ item.player_cards ] : item.player_cards.split(',').map(item => {
                return Number(item);
            });
            obj.Player.Percent = Number.isFinite(item.player_percent) ? [ item.player_percent ] : item.player_percent.split(',').map(item => {
                return Number(item);
            });

            obj.Office.Cards = Number.isFinite(item.office_cards) ? [ item.office_cards ] : item.office_cards.split(',').map(item => {
                return Number(item);
            });
            obj.Office.Percent = Number.isFinite(item.office_percent) ? [ item.office_percent ] : item.office_percent.split(',').map(item => {
                return Number(item);
            });
            obj.Office.AfterDul = item.office_after_dul.split(',').map(item => {
                return Number(item);
            });
            obj.Office.RobotOper = [];
            obj.Office.RejectCompare = [];

            obj.Other.Cards = Number.isFinite(item.other_cards) ? [ item.other_cards ] : item.other_cards.split(',').map(item => {
                return Number(item);
            });
            obj.Other.Percent = Number.isFinite(item.other_percent) ? [ item.other_percent ] : item.other_percent.split(',').map(item => {
                return Number(item);
            });

            const officeIds = Number.isFinite(item.office_ids) ? [ item.office_ids ] : item.office_ids.split(',');
            let otherIds1 = [];
            let otherIds2 = [];
            let otherIds3 = [];
            if (item.other_ids1) {
                otherIds1 = Number.isFinite(item.other_ids1) ? [ item.other_ids1 ] : item.other_ids1.split(',');
            }
            if (item.other_ids2) {
                otherIds2 = Number.isFinite(item.other_ids2) ? [ item.other_ids2 ] : item.other_ids2.split(',');
            }
            if (item.other_ids3) {
                otherIds3 = Number.isFinite(item.other_ids3) ? [ item.other_ids3 ] : item.other_ids3.split(',');
            }

            for (let j = 0; j < officeIds.length; j++) {
                const id = Number(officeIds[j]);
                const robot_oper = operationData.find(item => {
                    return item.id === id;
                });
                if (!robot_oper) {
                    return this.ctx.throw('请先上传荷官操作ID对应的配置');
                }

                const oper = Number(robot_oper.robot_oper);
                const robot_oper_time = robot_oper.robot_oper_time.split(',').map(item => {
                    return Number(item);
                });
                const seen_card_type = Number(robot_oper.seen_card_type);
                const seen_card_time = robot_oper.seen_card_time ? robot_oper.seen_card_time.split(',').map(item => {
                    return Number(item);
                }) : [];
                const robotOper = [ oper, ...robot_oper_time, seen_card_type, ...seen_card_time ];
                obj.Office.RobotOper.push(robotOper);
                obj.Office.RejectCompare.push(robot_oper.reject_compare);
            }
            // 普通1
            const Oper1 = {
                RobotOper: [],
                AfterDul: item.other_after_dul1 ? item.other_after_dul1.split(',').map(item => {
                    return Number(item);
                }) : [],
                RejectCompare: [],
            };
            for (let j = 0; j < otherIds1.length; j++) {
                const id = Number(otherIds1[j]);
                const robot_oper = operationData.find(item => {
                    return item.id === id;
                });
                if (!robot_oper) {
                    return this.ctx.throw('请先上传普通1操作ID对应的配置');
                }
                const oper = Number(robot_oper.robot_oper);
                const robot_oper_time = robot_oper.robot_oper_time.split(',').map(item => {
                    return Number(item);
                });
                const seen_card_type = Number(robot_oper.seen_card_type);
                const seen_card_time = robot_oper.seen_card_time ? robot_oper.seen_card_time.split(',').map(item => {
                    return Number(item);
                }) : [];
                const robotOper = [ oper, ...robot_oper_time, seen_card_type, ...seen_card_time ];
                Oper1.RobotOper.push(robotOper);

                Oper1.RejectCompare.push(robot_oper.reject_compare);
            }
            // 普通2
            const Oper2 = {
                RobotOper: [],
                AfterDul: item.other_after_dul2 ? item.other_after_dul2.split(',').map(item => {
                    return Number(item);
                }) : [],
                RejectCompare: [],
            };
            for (let j = 0; j < otherIds2.length; j++) {
                const id = Number(otherIds2[j]);
                const robot_oper = operationData.find(item => {
                    return item.id === id;
                });
                if (!robot_oper) {
                    return this.ctx.throw('请先上传普通1操作ID对应的配置');
                }
                const oper = Number(robot_oper.robot_oper);
                const robot_oper_time = robot_oper.robot_oper_time.split(',').map(item => {
                    return Number(item);
                });
                const seen_card_type = Number(robot_oper.seen_card_type);
                const seen_card_time = robot_oper.seen_card_time ? robot_oper.seen_card_time.split(',').map(item => {
                    return Number(item);
                }) : [];
                const robotOper = [ oper, ...robot_oper_time, seen_card_type, ...seen_card_time ];
                Oper2.RobotOper.push(robotOper);
                Oper2.RejectCompare.push(robot_oper.reject_compare);
            }
            // 普通3
            const Oper3 = {
                RobotOper: [],
                AfterDul: item.other_after_dul3 ? item.other_after_dul3.split(',').map(item => {
                    return Number(item);
                }) : [],
                RejectCompare: [],
            };
            for (let j = 0; j < otherIds3.length; j++) {
                const id = Number(otherIds3[j]);
                const robot_oper = operationData.find(item => {
                    return item.id === id;
                });
                if (!robot_oper) {
                    return this.ctx.throw('请先上传普通1操作ID对应的配置');
                }
                const oper = Number(robot_oper.robot_oper);
                const robot_oper_time = robot_oper.robot_oper_time.split(',').map(item => {
                    return Number(item);
                });
                const seen_card_type = Number(robot_oper.seen_card_type);
                const seen_card_time = robot_oper.seen_card_time ? robot_oper.seen_card_time.split(',').map(item => {
                    return Number(item);
                }) : [];
                const robotOper = [ oper, ...robot_oper_time, seen_card_type, ...seen_card_time ];
                Oper3.RobotOper.push(robotOper);
                Oper3.RejectCompare.push(robot_oper.reject_compare);
            }
            obj.Other.Oper = [ Oper1, Oper2, Oper3 ];
            list.push(obj);
        }
        return list;
    }

    async getclientData(fileJson) {
        let list = [];
        if (!fileJson || !fileJson.length === 0) {
            return list;
        }
        for (let i = 0; i < fileJson.length; i++) {
            const item = fileJson[i];
            if (item.event_id) {
                const data = {};
                data.event_id = item.event_id;
                data.ai_num = item.ai_num;
                data.player_cards = item.player_cards;
                data.player_percent = item.player_percent;
                data.office_cards = item.office_cards;
                data.office_percent = item.office_percent;
                data.other_cards = item.other_cards;
                data.other_percent = item.other_percent;
                data.office_is_big = item.office_is_big;
                data.office_after_dul = item.office_after_dul;
                data.other_after_dul1 = item.other_after_dul1;
                data.other_after_dul2 = item.other_after_dul2;
                data.other_after_dul3 = item.other_after_dul3;
                data.office_ids = item.office_ids;
                // 普通 1 2 3
                data.other_ids1 = item.other_ids1;
                data.other_ids2 = item.other_ids2;
                data.other_ids3 = item.other_ids3;
                list.push(data);
            } else {
                let data = {
                    office: {},
                    other: [],
                };
                data.event_id = item.EventID;
                data.ai_num = item.AiNum;
                data.player_cards = item.Player.Cards.toString();
                data.player_percent = item.Player.Percent.toString();
                data.office_cards = item.Office.Cards.toString();
                data.office_percent = item.Office.Percent.toString();
                data.other_cards = item.Other.Cards.toString();
                data.other_percent = item.Other.Percent.toString();
                data.office_is_big = item.OfficeIsBig;
                data.office_after_dul = item.Office.AfterDul.toString();

                data.office.RobotOper = item.Office.RobotOper;
                data.office.RejectCompare = item.Office.RejectCompare;

                data.other = item.Other.Oper;
                data.other_after_dul1 = item.Other.Oper[0].AfterDul.toString();
                data.other_after_dul2 = item.Other.Oper[1].AfterDul.toString();
                data.other_after_dul3 = item.Other.Oper[2].AfterDul.toString();

                list.push(data);
            }
        }
        return list;
    }

}

module.exports = EventConfigController;
