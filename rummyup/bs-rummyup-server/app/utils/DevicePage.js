'use strict';
/**
 * 分页器
 * @param {Number} page 当前页
 * @param {Number} pageMax 每页显示最大条数
 * @param {Array} dataList 分页目标数据
 * @returns {Array}
 */

 exports.doPage = (page, pageMax, tablesData) => {
    if (tablesData.length <= pageMax) {
        return tablesData;
    }
    let newTablesData = [];
    for (let i = 0; i < pageMax; i++) {
        let index = (page - 1) * pageMax + i;
        let data = tablesData[index];
        if (data != null) {
            newTablesData[i] = data;
        }
    }
    return newTablesData;
};
