/**
 * Token Auth Policy
 */

module.exports = function (req, res, next) {
    var tokenCookieName = sails.config.jwt.tokenCookieName,
        token;

    if (req.param('token')) {
        token = req.param('token')
        delete req.query.token;
    } else if (req.headers && req.headers.authorization) {
        token = extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            return deny(req, res, 'Format is Authorization: Bearer [token]');
        }
    } else if (req.cookies && req.cookies[tokenCookieName]) {
        token = req.cookies[tokenCookieName];
    } else {
        return deny(req, res, 'No token provided');
    }

    TokenAuth.verifyToken(token)
        .then(function (decodedToken) {
            sails.log.verbose('Decoded auth token: ', decodedToken);

            User.findOne({email: decodedToken.sub})
                .populateAll()
                .then(function (user) {
                    if (!user) {
                        return deny(req, res, 'User not found');
                    }                    
                    req.user = user;
                    next();
                });
        })
        .catch(function (err) {
            return deny(req, res, 'Invalid token');
        });
};

function extractTokenFromHeader (header) {
    var parts = header.split(' '),
        scheme, credentials, token;
    
    if (parts.length === 2) {
        scheme = parts[0];
        credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
            token = credentials;
        }
    }

    return token;
}

function deny (req, res, message) {
    if (req.wantsJSON) {
        res.json(401, {err: {message: message}});
    } else {
        res.redirect(sails.config.jwt.loginUrl);
    }
}
