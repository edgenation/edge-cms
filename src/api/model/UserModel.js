"use strict";

var mongoose = require("mongoose"),
    bcrypt = require("bcrypt-nodejs"),
    apiSchemaPlugin = require("./apiSchemaPlugin");


var SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;


var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    password: {type: String, required: true},
    email: {
        type: String,
        required: true,
        trim: true,
        index: {unique: true}
    },

    loginAttempts: {type: Number, required: true, default: 0},
    lockUntil: {type: Number}
});

UserSchema.plugin(apiSchemaPlugin, { type: "user" });

// Check for a future lockUntil timestamp
UserSchema.virtual("isLocked").get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});


UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.pre("save", function (next) {
    var user = this;

    // Check to see if the password was modified
    if (!user.isModified("password")) {
        return next();
    }

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }

        // Hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }

            // Override the text password with the hashed one
            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};


UserSchema.methods.incLoginAttempts = function (cb) {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: {loginAttempts: 1},
            $unset: {lockUntil: 1}
        }, cb);
    }

    // Otherwise we're incrementing
    var updates = {$inc: {loginAttempts: 1}};

    // Lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = {lockUntil: Date.now() + LOCK_TIME};
    }

    return this.update(updates, cb);
};


UserSchema.statics.getAuthenticated = function (username, password, cb) {
    this.findOne({username: username}, function (err, user) {
        if (err) {
            return cb(err);
        }

        // Make sure the user exists
        if (!user) {
            return cb(null, null, UserSchema.statics.failedLogin.NOT_FOUND);
        }

        // Check if the account is currently locked
        if (user.isLocked) {
            // Kust increment login attempts if account is already locked
            return user.incLoginAttempts(function (err) {
                if (err) {
                    return cb(err);
                }
                return cb(null, null, UserSchema.statics.failedLogin.MAX_ATTEMPTS);
            });
        }

        // Test for a matching password
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }

            // Check if the password was a match
            if (isMatch) {
                // If there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) {
                    return cb(null, user);
                }

                // Reset attempts and lock info
                var updates = {
                    $set: {loginAttempts: 0},
                    $unset: {lockUntil: 1}
                };

                return user.update(updates, function (err) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null, user);
                });
            }

            // Password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function (err) {
                if (err) {
                    return cb(err);
                }
                return cb(null, null, UserSchema.statics.failedLogin.PASSWORD_INCORRECT);
            });
        });
    });
};


module.exports = mongoose.model("user", UserSchema);
