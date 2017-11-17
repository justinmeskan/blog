var mongoose        = require('mongoose');
var bcrypt          = require('bcrypt-nodejs');
var userSchema      = mongoose.Schema({
    local            : {
        name         : String,
        password     : String,
    },
    avatar           : String,
    mail             : [String],
    createdOn        : Date,
    modifiedOn       : { type: Date, default: Date.now },
    lastLogin        : Date
});
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);