/**
 * Sails hook providing JSON Web Token authentication.
 */
module.exports = function (sails) {
    var loader = require('sails-util-mvcsloader')(sails);

    loader.configure();

    return {
        defaults: {
            jwt: {
                tokenCookieName: 'token', // The name to use for the JWT cookie
                algorithm: 'RS256', // Algorithm to use for signing the token
                httpOnly: true, // Cookie will not be accessible through the browser
                maxAge: 'P1D', // How long the token is valid for. Expressed as a moment duration (https://momentjs.com/docs/#/durations)
                authCookieName: 'authenticated', // Accessible through the browser. Used to determine if user is logged in if token cookie is httpOnly
                loginUrl: '/login' // If the client is not expecting a JSON response redirect to this URL when token authentication fails
            }
        },
        initialize: function (next) {
            loader.adapt(function (err) {
                return next(err);
            });
        }
    };
};
