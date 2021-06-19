'use strict';

const jwt = require('jsonwebtoken');

function createTokenUser(app, user) {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            username: user.username,
            password: user.password,
        },
        app.config.jwt.secret,
        // { expiresIn: 5 }
        { expiresIn: 60 * 60 * 12 }
    );

}
module.exports = {
    createTokenUser,
};
