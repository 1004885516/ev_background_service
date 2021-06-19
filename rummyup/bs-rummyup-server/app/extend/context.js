'use strict';

const crypto = require('crypto');
const random = require('random');
let base_md5_str = 'c843ed2b09a46ffe94ed2a614fd8df13';
let bmartpay_md5_key = 'EQ7VEBV6KH5BCT5N';

Date.prototype.Format = function(fmt) {
    let o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S+': this.getMilliseconds(),
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
    return fmt;
};

module.exports = {
    getLastHoursByIntTest(src) {
        let date = new Date(src);
        date.setHours(date.getHours() - 1);
        return { date: date.Format('yyyy-MM-dd'), hours: Number.parseInt(date.Format('hh')) };
    },

    getLastHoursTest(src) {
        let date = new Date(src);
        date.setHours(date.getHours() - 1);
        return date.Format('yyyy-MM-dd hh:00:00');
    },

    getCurrentHoursTest(src) {
        return new Date(src).Format('yyyy-MM-dd hh:00:00');
    },

    getHoursAndMin(interval) {
        const time = new Date();
        return Number.parseInt(time.getHours() * (60 / interval)) + Number.parseInt(time.getMinutes() / interval);
    },

    getHoursAndMinByInt(src) {
        let date = new Date(`${this.getTodaySymbol()} 00:00:00`);
        date.setMinutes(src);
        return date.Format('hh:mm');
    },

    getHoursByInt() {
        return Number.parseInt(new Date().Format('hh'));
    },

    getLastHoursByInt() {
        let date = new Date();
        date.setHours(date.getHours() - 1);
        return { date: date.Format('yyyy-MM-dd'), hours: Number.parseInt(date.Format('hh')) };
    },

    getMonthNoSymbol() {
        return new Date().Format('yyyyMM');
    },

    getTodaySymbol() {
        return new Date().Format('yyyy-MM-dd');
    },

    getTimeSymbol() {
        return new Date().Format('yyyy-MM-dd hh:mm:ss');
    },

    getLastHours() {
        let date = new Date();
        date.setHours(date.getHours() - 1);
        return date.Format('yyyy-MM-dd hh:00:00');
    },

    getCurrentHours() {
        return new Date().Format('yyyy-MM-dd hh:00:00');
    },

    transferDateTime(srcDate) {
        return new Date(srcDate).Format('yyyy-MM-dd hh:mm:ss');
    },

    transferDate(srcDate) {
        return new Date(srcDate).Format('yyyy-MM-dd');
    },

    transferMonth(srcDate) {
        return new Date(srcDate).Format('yyyyMM');
    },

    getDateByAdd(addDay) {
        let date = new Date();
        date.setDate(date.getDate() + addDay);
        return date.Format('yyyy-MM-dd');
    },

    getAfterDate(day) {
        let date = new Date(day);
        date.setDate(date.getDate() + 1);
        return date.Format('yyyy-MM-dd');
    },

    getDateByCustomAndAdd(src, add) {
        let date = new Date(src);
        date.setDate(date.getDate() + add);
        return date.Format('yyyy-MM-dd');
    },

    getDateByStartAndEnd(start, end) {
        let result = [];
        const starts = start.split('-');
        const ends = end.split('-');
        const endYear = parseInt(ends[0]);
        const endMon = parseInt(ends[1]);
        let staYear = parseInt(starts[0]);
        let staMon = parseInt(starts[1]);
        while (staYear <= endYear) {
            if (staYear === endYear) {
                while (staMon <= endMon) {
                    let str = staYear + '' + (staMon >= 10 ? staMon : '0' + staMon);
                    staMon++;
                    result.push(str);
                }
                staYear++;
            } else {
                if (staMon > 12) {
                    staMon = 1;
                    staYear++;
                }
                let str = staYear + '' + (staMon >= 10 ? staMon : '0' + staMon);
                staMon++;
                result.push(str);
            }
        }
        return result;
    },

    getGameMysql() {
        const { app } = this;
        return app.mysql.get('game');
    },

    getLocalMysql() {
        const { app } = this;
        return app.mysql.get('local');
    },

    getOldLocalMysql() {
        const { app } = this;
        return app.mysql.get('oldLocal');
    },

    getSuccessBody() {
        return { status: 200, msg: '成功' };
    },

    getFailedBody() {
        return { status: 500, msg: '失败' };
    },

    async httpGet(urlField, params) {
        const { app } = this;
        const time = Date.parse(new Date()) / 1000;
        let url = '';
        if (params) {
            url = `${urlField}?${params}&time=${time}`;
        } else {
            url = `${urlField}?time=${time}`;
        }
        let sign = this.genMD5(`${url}${base_md5_str}`);
        let fullUrl = `${app.config.GameURL}${url}&sign=${sign}`;
        // this.logger.info('httpGet url : ', fullUrl);
        const result = await app.curl(fullUrl, {
            dataType: 'json',
            timeout: 15000,
        });
        return result.data;
    },

    async httpPost(urlField, data, params = '') {
        const { app } = this;
        const time = Date.parse(new Date()) / 1000;
        let signUrl = `${urlField}?${params}time=${time}${base_md5_str}`;
        let postSign = this.genMD5(signUrl);
        let fullUrl = app.config.GameURL + urlField + `?${params}time=${time}&sign=${postSign}`;
        this.logger.info('httpPost url : ', fullUrl);
        const result = await app.curl(fullUrl, {
            dataType: 'json',
            contentType: 'json',
            timeout: 15000,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
        });
        return result.data;
    },

    randomInt(min = 100000, max = 999999) {
        return random.int(min, max);
    },

    genMD5(text) {
        const md5 = crypto.createHash('md5');
        return md5.update(text).digest('hex');
    },

    changeServerRatio(num) {
        const { app } = this;
        if (Number.parseInt(num) === -1) {
            return -1;
        }
        return Number.parseInt(Number.parseFloat(num) * app.config.Ratio);
    },

    // 不对-1做处理
    changeServerRatio2(num) {
        const { app } = this;
        return Number.parseInt(Number.parseFloat(num) * app.config.Ratio);
    },

    changeClientRatio(num) {
        const { app } = this;
        if (Number.parseInt(num) === -1) {
            return -1;
        }
        return (Number.parseFloat(num) / app.config.Ratio).toFixed(2);
    },

    changeServerRatioBy100(num) {
        return Number.parseInt(Number.parseFloat(num) * 100);
    },

    sortByASCII(str) {
        const strArr = str.split(/\s+/gi);
        const s1 = Array.prototype.sort.call(strArr, function(a, b) {
            for (let i = 0; i < a.length; i++) {
                if (a.charCodeAt(i) === b.charCodeAt(i)) continue;
                return a.charCodeAt(i) - b.charCodeAt(i);
            }
        });
        return s1;
    },

    genBMartPayRechargeMD5(channelCode, outUserId, outOrderNo, commodityAmount) {
        const data = `channelCode=${channelCode}&commodityAmount=${commodityAmount}&outOrderNo=${outOrderNo}&outUserId=${outUserId}&key=${bmartpay_md5_key}`;
        const md5 = crypto.createHash('md5');
        return md5.update(data).digest('hex').toLowerCase();
    },

    genBMartPayRechargeNotifyMD5(dataMap) {
        const str = 'amount appId code merchantId orderId outUserId currency passageTradeNo successTime';
        const result = this.sortByASCII(str);
        console.log('result : ', JSON.stringify(result));
        console.log('dataMap : ', dataMap);
        let data = '';
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            console.log('item = ', item);
            console.log('dataMap[item] = ', dataMap[item]);
            data += `${item}=${dataMap[item]}`;
            if (i < result.length - 1) {
                data += '&';
            } else {
                data += `&key=${bmartpay_md5_key}`;
            }
        }
        console.log('data = ', data);
        const md5 = crypto.createHash('md5');
        return md5.update(data).digest('hex').toLowerCase();
    },

    genBMartPayPayoutNotifyMD5(dataMap) {
        const str = 'code amount realAmount currency outUserId payAccount outOrderNo orderId merchantId appId successTime';
        const result = this.sortByASCII(str);
        console.log('result : ', JSON.stringify(result));
        console.log('dataMap : ', dataMap);
        let data = '';
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            console.log('item = ', item);
            console.log('dataMap[item] = ', dataMap[item]);
            data += `${item}=${dataMap[item]}`;
            if (i < result.length - 1) {
                data += '&';
            } else {
                data += `&key=${bmartpay_md5_key}`;
            }
        }
        console.log('data = ', data);
        const md5 = crypto.createHash('md5');
        return md5.update(data).digest('hex').toLowerCase();
    },

    genBMartPayWidthdrawMD5(channelCode, outUserId, outOrderNo, payType, payAccount, payAmount) {
        const data = `channelCode=${channelCode}&outOrderNo=${outOrderNo}&outUserId=${outUserId}&payAccount=${payAccount}&payAmount=${payAmount}&payType=${payType}&key=${bmartpay_md5_key}`;
        const md5 = crypto.createHash('md5');
        return md5.update(data).digest('hex').toLowerCase();
    },

    genBMartPayWithdrawNotify(amount, appId, code, currency, merchantId, orderId, outOrderNo, outUserId, payAccount, realAmount, successTime) {
        const data = `amount=${amount}&appId=${appId}&code=${code}&merchantId=${merchantId}&orderId=${orderId}&outOrderNo=${outOrderNo}&outUserId=${outUserId}&payAccount=${payAccount}&realAmount=${realAmount}&successTime=${successTime}&key=${bmartpay_md5_key}`;
        const md5 = crypto.createHash('md5');
        return md5.update(data).digest('hex').toLowerCase();
    },

    genBMartPayOrderNo() {
        return `${new Date().getTime()}${this.randomInt()}`;
    },

    genRandomArray(a, b, c, d, e, f) {
        let rArr = [];
        for (let i = 0; i < a; i++) {
            rArr.push(0);
        }
        for (let i = 0; i < b; i++) {
            rArr.push(1);
        }
        for (let i = 0; i < c; i++) {
            rArr.push(2);
        }
        for (let i = 0; i < d; i++) {
            rArr.push(3);
        }
        for (let i = 0; i < e; i++) {
            rArr.push(4);
        }
        for (let i = 0; i < f; i++) {
            rArr.push(5);
        }
        const len = rArr.length;
        for (let i = len - 1; i > 0; i--) {
            const ran = this.randomInt(0, i);
            const temp = rArr[i];
            rArr[i] = rArr[ran];
            rArr[ran] = temp;
        }
        return rArr;
    },

    getRandomCard() {
        let rArr = [];
        for (let i = 0; i < 52; i++) {
            rArr.push(i);
        }
        const len = rArr.length;
        for (let i = len - 1; i > 0; i--) {
            const ran = this.randomInt(0, i);
            const temp = rArr[i];
            rArr[i] = rArr[ran];
            rArr[ran] = temp;
        }
        let player = [];
        for (let i = 0; i < 3; i++) {
            const card = rArr[i];
            player.push(this.changeCardNum(card));
        }
        let robot = [];
        for (let i = 3; i < 6; i++) {
            const card = rArr[i];
            robot.push(this.changeCardNum(card));
        }
        return { player, robot };
    },

    changeCardNum(cardNum) {
        return { num: cardNum % 13, color: Math.floor(cardNum / 13) };
    },

    MysqlType: {
        Select: 0,
        Insert: 1,
        Update: 2,
        Delete: 3,
        Error: 4,
    },

    async mysqlQueryByGame(sql, data) {
        const mysql = this.getGameMysql();
        const result = await mysql.query(sql, data);
        return result;
    },

    async mysqlQueryByLocal(sql, data) {
        const mysql = this.getLocalMysql();
        const result = await mysql.query(sql, data);
        return result;
    },

    async mysqlQueryByOldLocal(sql, data) {
        const mysql = this.getOldLocalMysql();
        const result = await mysql.query(sql, data);
        return result;
    },

    async mysqlByGame(execType, tablename, data) {
        return await this.execMysql(this.getGameMysql(), execType, tablename, data);
    },

    async mysqlByLocal(execType, tablename, data) {
        return await this.execMysql(this.getLocalMysql(), execType, tablename, data);
    },

    async execMysql(mysql, execType, tablename, data) {
        let result = this.MysqlType.Error;
        if (execType === this.MysqlType.Select) {
            result = await mysql.select(tablename, data);
        } else if (execType === this.MysqlType.Insert) {
            result = await mysql.insert(tablename, data);
        } else if (execType === this.MysqlType.Update) {
            result = await mysql.update(tablename, data);
        } else if (execType === this.MysqlType.Delete) {
            result = await mysql.delete(tablename, data);
        }
        return result;
    },

    setErrBody(err) {
        let errCode;
        let msg;
        const body = {};

        this.app.emit('error', err, this);
        msg = err.message;
        errCode = err.errCode;

        body.code = errCode;
        body.msg = msg;

        this.body = body;
    },

    signFigures(num, rank = 6) {
        if (!num) return (0);
        const sign = num / Math.abs(num);
        const number = num * sign;
        const temp = rank - 1 - Math.floor(Math.log10(number));
        let ans;
        if (temp > 0) {
            ans = parseFloat(number.toFixed(temp));
        } else if (temp < 0) {
            const ntemp = Math.pow(10, temp);
            ans = Math.round(number / ntemp) * ntemp;
        } else {
            ans = Math.round(number);
        }
        return (ans * sign);
    },
    // 将分钟转换成秒
    changeServerTime(num) {
        return Number(num) * 60;
    },

    changeClientTime(num) {
        return Number(num) / 60;
    },
    getEveryDay(start, end) {
        let dateList = [];
        let startTime = this.getDate(start);
        let endTime = this.getDate(end);
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
            let year = startTime.getFullYear();
            let month = startTime.getMonth() + 1 < 10 ? '0' + (startTime.getMonth() + 1) : startTime.getMonth() + 1;
            let day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate();
            dateList.push(year + '-' + month + '-' + day);
            startTime.setDate(startTime.getDate() + 1);
        }
        return dateList;
    },
    getDate(datestr) {
        let temp = datestr.split('-');
        let date = new Date(temp[0], temp[1] - 1, temp[2]);
        return date;
    },
};
