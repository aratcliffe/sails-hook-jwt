/**
 * User.js
 *
 * The user model.
 */

var bcrypt = require('bcrypt');

module.exports = {

    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true,
            primaryKey: true
        },        
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string'
        },
        isValidPassword: function (password) {
            return bcrypt.compare(password, this.password);
        },
        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },
    
    beforeCreate: function (values, next) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                sails.log.error(err);
                return next();
            }

            bcrypt.hash(values.password, salt, function (err, hash) {
                if (err) {
                    sails.log.error(err);
                    return next();
                }
                values.password = hash;
                return next();
            });
        });
    }
};

