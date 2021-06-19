'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

class UploadService extends Service {
    async index(filepath) {
        const ctx = this.ctx;
        const stream = await ctx.getFileStream();
        const filename = stream.filename;
        const fields = stream.fields;
        let target = path.join(this.config.baseDir, filepath + filename);
        const result = await new Promise((resolve, reject) => {
            const remoteFileStream = fs.createWriteStream(target);
            stream.pipe(remoteFileStream);
            let errFlag;
            remoteFileStream.on('error', err => {
                errFlag = true;
                sendToWormhole(stream);
                remoteFileStream.destroy();
                reject(err);
            });
            remoteFileStream.on('finish', async () => {
                if (errFlag) return;
                resolve({ filename, fields });
            });
        });
        return result;
    }

    // 保存上传文件数据
    async saveUploadData(createtime, jsontype, jsondata, iswork, filename) {
        const { ctx, app } = this;
        const sql = `insert into ${app.config.TableName.Upload_File_Json} (createtime, jsontype, jsondata, iswork, filename) values (?, ?, ?, ?, ?)`;
        await ctx.mysqlQueryByLocal(sql, [ createtime, jsontype, JSON.stringify(jsondata), iswork, filename ]);
    }

    // 获取上传文件的数据
    async getUploadData(createtime, jsontype, filename) {
        const { ctx, app } = this;
        const sql = `select * from ${app.config.TableName.Upload_File_Json} where createtime = ? and jsontype = ? and filename = ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ createtime, jsontype, filename ]);
        if (result.length === 0) {
            return false;
        }
        return JSON.parse(result[0].jsondata);
    }
    // 获取上传文件的荷官配置和普通配置
    async getConfigData(jsontype) {
        const { ctx, app } = this;
        const sql = `select * from ${app.config.TableName.Upload_File_Json} where jsontype = ? order by createtime desc limit 1`;
        const result = await ctx.mysqlQueryByLocal(sql, [ jsontype ]);
        if (result.length === 0) {
            return false;
        }
        return JSON.parse(result[0].jsondata);
    }
    // 获取对应类型的已生效数据
    async getUploadDataByType(jsontype) {
        const { ctx, app } = this;
        const sql = `select * from ${app.config.TableName.Upload_File_Json} where jsontype = ? and iswork = ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ jsontype, 1 ]);
        if (result.length === 0) {
            return false;
        }
        return JSON.parse(result[0].jsondata);
    }

    // 获取上传文件列表
    async getUploadFileList(jsontype) {
        const { ctx, app } = this;
        const sql = `select date_format(createtime, '%Y-%m-%d %T') as createtime, filename, iswork from ${app.config.TableName.Upload_File_Json} where jsontype = ? order by createtime desc limit 0, 5`;
        return await ctx.mysqlQueryByLocal(sql, [ jsontype ]);
    }

    // 更新是否发送给服务器状态
    async updateUploadData(createtime, jsontype, filename, iswork) {
        const { ctx, app } = this;
        const sql = `update ${app.config.TableName.Upload_File_Json} set iswork = ? where createtime = ? and jsontype = ? and filename = ?`;
        await ctx.mysqlQueryByLocal(sql, [ iswork, createtime, jsontype, filename ]);
    }

    async updateUploadDataByWork(jsontype) {
        const { ctx, app } = this;
        const sql = `select * from ${app.config.TableName.Upload_File_Json} where jsontype = ? and iswork = ?`;
        const result = await ctx.mysqlQueryByLocal(sql, [ jsontype, 1 ]);
        if (result.length > 0) {
            const data = result[0];
            await this.updateUploadData(data.createtime, jsontype, data.filename, 0);
        }
    }

    // 根据类型获取文件模板
    getTemplateFileByType(templateType) {
        const { app } = this;
        if (templateType === app.config.UploadFileType.AiTeenPatti) {
            // TeenPatti 控牌模板文件
            return app.config.TPCCTemplateName;
        } else if (templateType === app.config.UploadFileType.AIAK47) {
            // AK47 场次模板文件
            return app.config.AKCCTemplateName;
        } else if (templateType === app.config.UploadFileType.AILowestJoker) {
            // LowestJoker 场次模板文件
            return app.config.LJCCTemplateName;
        } else if (templateType === app.config.UploadFileType.AIHighestJoker) {
            // hestJoker 场次模板文件
            return app.config.HJCCTemplateName;
        } else if (templateType === app.config.UploadFileType.AiRummy ||
            templateType === app.config.UploadFileType.AiRummyRobot ||
            templateType === app.config.UploadFileType.AIRummy2User ||
            templateType === app.config.UploadFileType.AIRummy2UserRobot) {
            // Rummy 和 Rummy Robot 控牌模板文件
            return app.config.RCCTemplateName;
        } else if (templateType === app.config.UploadFileType.SessionTeenPatti) {
            // TeenPatti 场次模板文件
            return app.config.STPTemplateName;
        } else if (templateType === app.config.UploadFileType.SessionRummy) {
            // Rummy 场次模板文件
            return app.config.SRTemplateName;
        } else if (templateType === app.config.UploadFileType.Turntable) {
            // 活动 转盘模板文件
            return app.config.TurntableTemplateName;
        } else if (templateType === app.config.UploadFileType.TwoPersonsRummy) {
            // 二人rummy场次配置
            return app.config.TPRTemplateName;
        } else if (templateType === app.config.UploadFileType.SessionTeenPattiSpeed) {
            // 快速TP场次配置
            return app.config.TPSCCTemplateName;
        } else if (templateType === app.config.UploadFileType.AK47) {
            // AK47场次配置
            return app.config.AKTemplateName;
        } else if (templateType === app.config.UploadFileType.LowestJoker) {
            // LowestJoker场次配置
            return app.config.LJTemplateName;
        } else if (templateType === app.config.UploadFileType.HighestJoker) {
            // HighestJoker场次配置
            return app.config.HJTemplateName;
        } else if (templateType === app.config.UploadFileType.DragonVSTiger) {
            // DragonVSTiger场次配置
            return app.config.DTTemplateName;
        } else if (templateType === app.config.UploadFileType.ShopBMartConfig) {
            // 商城BMart配置
            return app.config.SCBMartTemplateName;
        } else if (templateType === app.config.UploadFileType.ShopFunzoneConfig) {
            // 商城Funzone配置
            return app.config.SCFunzoneTemplateName;
        } else if (templateType === app.config.UploadFileType.ShopGrepayConfig) {
            // 商城Grepay配置
            return app.config.SCGrepayTemplateName;
        } else if (templateType === app.config.UploadFileType.TriggerConfig) {
            // AI配置 触发配置
            return app.config.TriggerTemplateName;
        } else if (templateType === app.config.UploadFileType.EventConfig) {
            // AI配置 触发配置
            return app.config.EventTemplateName;
        } else if (templateType === app.config.UploadFileType.OperationConfig) {
            // AI配置 操作配置
            return app.config.OperationTemplateName;
        } else if (templateType === app.config.UploadFileType.TPrechargeConfig) {
            return app.config.TPrechargeTemplateName;
        } else if (templateType === app.config.UploadFileType.TriggerConfigR) {
            // AI配置 充值玩家触发配置
            return app.config.TriggerRTemplateName;
        } else if (templateType === app.config.UploadFileType.RechargeCardConfig) {
            // AI配置 充值事件牌型概率
            return app.config.RechargeCardTemplateName;
        }
    }

    // 获取现有的模板列表和选择的模板数据
    // serverData 是否从服务器获取数据
    async getTemplates(jsonToArray, serverData) {
        const { ctx, app } = this;
        const reqBody = ctx.request.body;
        const template_type = reqBody.jsontype;
        const template_index = reqBody.index;
        // 获取已上传过的文件数据列表
        let templatefiles = await this.getUploadFileList(template_type);
        let jsondata = '';
        if (templatefiles.length > 0) {
            // 有列表 根据数据列表读取第一条数据
            if (serverData) {
                templatefiles.unshift({ filename: '服务器数据', iswork: 1 });
                if (template_index === 0) {
                    jsondata = serverData;
                } else {
                    const lastdata = templatefiles[template_index];
                    jsondata = await ctx.service.upload.getUploadData(lastdata.createtime, template_type, lastdata.filename);
                }
            } else {
                const lastdata = templatefiles[template_index];
                jsondata = await ctx.service.upload.getUploadData(lastdata.createtime, template_type, lastdata.filename);
            }
        } else {
            // 无列表 使用服务器数据
            if (serverData) {
                templatefiles.push({ filename: '服务器数据', iswork: 1 });
                jsondata = serverData;
            } else {
                // 无列表 获取模板数据
                // 生成默认文件列表
                const fileJson = await ctx.service.file.index(app.config.TemplatePath + this.getTemplateFileByType(template_type));
                jsondata = jsonToArray(fileJson.json);
                templatefiles.push({ filename: this.getTemplateFileByType(template_type), iswork: 0 });
            }
        }
        return {
            TemplateData: jsondata,
            TemplateFiles: templatefiles,
            TemplateIndex: template_index,
        };
    }

    // 上传配置文件统一处理方法
    async uploadTemplate(jsonToArray, serverData) {
        const { ctx, app } = this;
        // 保存文件
        const upload = await this.index(app.config.TempUploadPath);
        if (!upload.filename) {
            return ctx.getFailedBody();
        }
        const template_type = upload.fields.jsontype;
        let template_index = 0;
        this.logger.info('template_type : ', template_type);
        // 读取文件数据
        const fileJson = await ctx.service.file.index(app.config.TempUploadPath + upload.filename);
        const jsondata = jsonToArray(fileJson.json);
        if (jsondata.code === 500) {
            return jsondata;
        }
        // 删除文件
        ctx.service.file.removeFile(app.config.TempUploadPath + upload.filename);
        // 保存文件数据
        const timeSuffix = ctx.getTimeSymbol();
        await this.saveUploadData(timeSuffix, template_type, jsondata, 0, upload.filename);
        // 获取文件列表
        let templatefiles = await this.getUploadFileList(template_type);
        if (serverData) {
            template_index = 1;
            templatefiles.unshift({ filename: '服务器数据', iswork: 1 });
        }
        let retBody = ctx.getSuccessBody();
        retBody.result = {
            TemplateData: jsondata,
            TemplateFiles: templatefiles,
            TemplateIndex: template_index,
        };
        return retBody;
    }
}

module.exports = UploadService;
