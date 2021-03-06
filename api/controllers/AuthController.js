/**
 * AuthController
 */
var moment = require('moment');

module.exports = {

    login: function (req, res) {
        var email = req.param('email'),
            password = req.param('password'),
            tokenCookieName = sails.config.jwt.tokenCookieName,
            algorithm = sails.config.jwt.algorithm,
            httpOnly = sails.config.jwt.httpOnly,
            maxAge = moment.duration(sails.config.jwt.maxAge).asMilliseconds(),
            user;

        User.findOne({email: email})
            .then(function (rec) {
                user = rec;
                return user.isValidPassword(password);
            })
            .then(function (valid) {  
                if (valid) {
                    return TokenAuth.issueToken({sub: email, iat: +new Date()}, {algorithm: algorithm})
                        .then(function (token) {
                            res.cookie(tokenCookieName, token, {httpOnly: httpOnly, maxAge: maxAge});                    
                            delete user.password;
                            res.json({user: user, token: token});
                        });
                } else {
                    res.json(401, {err: {message: 'Invalid password'}});
                }
            })
            .catch(function (err) {
                res.json(401, {err: {message: 'Invalid email address'}});
            });        
    },

    logout: function (req, res) {
        var tokenCookieName = sails.config.jwt.tokenCookieName;

        res.clearCookie(tokenCookieName);
        
        res.ok();
    }
};

