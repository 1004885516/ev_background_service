'use strict';

async function errorHandler(ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.setErrBody(err);
    }

}
module.exports = () => {
    return errorHandler;
};
