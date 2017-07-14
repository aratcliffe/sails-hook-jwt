/**
 * User.js
 *
 * The user model.
 */

var bcrypt = require('bcrypt');

module.exports = {

    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        isValidPassword: function (password) {
            return bcrypt.compare(password, this.password);
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

