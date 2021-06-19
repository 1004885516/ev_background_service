import request from '@/utils/Request'
// import Vue from 'vue'

// const crypto = require('crypto');
// const basemd5 = '072eaebf67e2866803d83eef06e7c4b4';

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export default {
    ApkId: 'noinit',
    PackageIds: [],//每个ApkId对应的PackageId

    httpGet(url, params) {
        return request({
            url,
            method: 'get',
            params,
        });
    },

    httpPost(url, data) {
        return request({
            url,
            method: 'post',
            data,
        });
    },

    /**
     * 根据增减的天数获得年月日
     * @param addDay 增减的天数
     */
    getDateByAdd(addDay) {
        let date = new Date();
        date.setDate(date.getDate() + addDay);
        return date.Format('yyyy-MM-dd');
    },

    getTodaySymbol() {
        return new Date().Format('yyyy-MM-dd');
    },
    
    /**
     * 根据增减的天数获得当月第一天日期
     * @param addDay 增减的天数
     */
    getMonthBeginByAdd(addDay) {
        let date = new Date();
        date.setDate(date.getDate() + addDay);
        return date.Format('yyyy-MM') + '-01';
    },

    getTimeSymbol() {
        return new Date().Format('yyyy-MM-dd hh:mm:ss');
    },

    /**
     * 根据数据库日期转换为实际日期
     * @param srcDate 需要转换的日期字符串
     */
    transferDate(srcDate) {
        return new Date(srcDate).Format('yyyy-MM-dd');
    },

    /**
     * 根据数据库日期时间转换为实际日期时间
     * @param srcDate 需要转换的日期时间字符串
     */
    transferDateTime(srcDate) {
        return new Date(srcDate).Format('yyyy-MM-dd hh:mm:ss');
    },

    transferDateByEnd(srcDate) {
        let date = new Date(srcDate);
        date.setDate(date.getDate() + 1);
        return date.Format('yyyy-MM-dd');
    },

    setApkId(apkId) {
        this.ApkId = apkId;
    },

    getApkId() {
        return this.ApkId;
    },

    clearPackageIds() {
        this.PackageIds = {};
    },

    setPackageIds(apkId, packageIds) {
        this.PackageIds[apkId] = packageIds;
    },

    addPackageId(apkId, packageId) {
        if (!this.PackageIds[apkId]) {
            this.PackageIds[apkId] = [];
        }
        this.PackageIds[apkId].push(packageId);
    },

    getPackageIds() {
        return this.PackageIds[this.getApkId()];
    },

    getPackageIdsByApk(apkId) {
        return this.PackageIds[apkId];
    },

    getPackageIdsByAll() {
        return this.PackageIds;
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
}
