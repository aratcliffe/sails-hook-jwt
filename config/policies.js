module.exports.policies = {
    '*': ['tokenAuth'],
    
    AuthController: {
        'login': true
    }
};
