/**
 * Sails hook providing JSON Web Token authentication.
 */
module.exports = function (sails) {
    var loader;
    
    return {
        defaults: {
            jwt: {
                tokenCookieName: 'token', // The name to use for the JWT cookie
                algorithm: 'RS256', // Algorithm to use for signing the token
                httpOnly: true, // Cookie will not be accessible through the browser
                maxAge: 'P1D', // How long the token is valid for. Expressed as a moment duration (https://momentjs.com/docs/#/durations)
                loginUrl: '/login' // If the client is not expecting a JSON response redirect to this URL when token authentication fails
            }
        },
        configure: function () {
            loader = require('sails-util-mvcsloader')(sails, sails.config[this.configKey].orm);
            loader.configure({
                policies: __dirname + '/api/policies',
                config: __dirname + '/config'
            });            
        },
        initialize: function (next) {
            loader.inject({
                controllers: __dirname + '/api/controllers',
                models: __dirname + '/api/models',
                services: __dirname + '/api/services'
            }, function (err) {
                return next(err);
            });
        }
    };
};
