var _ = require("lodash");

var Controller = {};

Controller.sendResponse = function (res, status) {
    status = status || 200;

    return function (data) {
        res.status(status).json(data);
    };
};

Controller.checkDataReturned = function (data) {
    if (!data) {
        throw null;
    }

    return data;
};

Controller.updateProps = function (req) {
    return function (data) {
        _.forEach(req.body, function (value, prop) {
            data[prop] = value;
        });

        return data;
    };
};

module.exports = Controller;
