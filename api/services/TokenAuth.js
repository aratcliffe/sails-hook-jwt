/**
 * TokenAuth
 *
 * @module      :: Service
 * @description :: Issues and verifies JSON Web Tokens.
 */

var Promise = require('bluebird');
var jwt = require('jsonwebtoken');
var fs = require('fs-extra');

var keys = {};

module.exports = {

    issueToken: function (payload, options) {
        return this.getKey('private').then(function (key) {
            return jwt.sign(payload, key, options);    
        });
    },

    verifyToken: function (token, options) {
        return this.getKey('public').then(function (key) {        
            return jwt.verify(token, key, options);
        });
    },

    getKey: function (type) {
        return new Promise(function (resolve, reject) {
            if (keys[type]) {
                resolve(keys[type]);
            } else {
                fs.readFile('auth/' + type + '_key', 'utf8')
                    .then(function (key) {
                        keys[type] = key;
                        resolve(key);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            }
        });                
    }    
};
