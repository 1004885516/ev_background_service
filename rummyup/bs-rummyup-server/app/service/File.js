'use strict';
const Service = require('egg').Service;
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
class FileService extends Service {
    async index(filename) {
        this.logger.info(`read file filename = ${filename}`);
        let target = path.join(this.config.baseDir, filename);
        const result = await new Promise((resolve, reject) => {
            const list = new Array(0);
            const workbook = xlsx.readFile(target);
            if (workbook) {
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        list.push(xlsx.utils.sheet_to_json(workbook.Sheets[sheet]));
                    }
                }
                resolve({ json: list });
            } else {
                reject(new Error('no file'));
            }
        });
        return result;
    }

    async isExsit(filename) {
        return await fs.existsSync(filename);
    }

    async removeFile(filename) {
        const isExsit = await this.isExsit(filename);
        if (isExsit) {
            fs.unlinkSync(filename);
        }
    }
}

module.exports = FileService;
