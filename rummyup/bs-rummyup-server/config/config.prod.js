/* eslint valid-jsdoc: "off" */
/* 正式服运行模式 */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1608101568200_3417';

    // add your middleware config here
    config.middleware = [ 'tokenAuth', 'log', 'errorHandler' ];

    config.env = 'prod';

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
        GameURL: 'http://127.0.0.1:18800',
        KYCURL: 'http://online.xyzg.top:19900',
    };

    config.routerAuth = [ '/login', '/register', '/dotdata' ];

    config.jwt = {
        secret: 'e103e106cd7b2c48',
    };

    const gd = require(path.join(appInfo.baseDir, 'app/utils/GData'));

    config.cluster = {
        listen: {
            path: '',
            hostname: '0.0.0.0',
            port: 3003,
        },
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
    };

    config.security = {
        csrf: {
            // headerName: 'x-csrf-token',
            enable: false,
        },
        domainWhiteList: [ '*' ],
    };
    config.multipart = { mode: 'stream', fileSize: '10mb', whitelist: [ '.xlsx' ] };

    config.mysql = {
        clients: {
            game: {
                host: '127.0.0.1',
                port: '3306',
                user: 'root',
                password: 'amz-mb26-cx006game-8-8',
                database: 'Yeahmobi_rummyup',
            },
            local: {
                host: '127.0.0.1',
                port: '3306',
                user: 'root',
                password: 'amz-mb26-cx006game-8-8',
                database: 'ev_bs_rummyup',
            },
            oldLocal: {
                host: '127.0.0.1',
                port: '3306',
                user: 'root',
                password: 'amz-mb26-cx006game-8-8',
                database: 'background_service_rummyup',
            },
        },
        app: true,
        agent: false,
    };

    return {
        ...config,
        ...userConfig,
        ...gd,
    };
};
