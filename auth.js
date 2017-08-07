'use strict';

var crypto = require('crypto');

function genSign(params, appSecret) {
    var paramsStr = Object.keys(params).sort().map(function(key) {
        return key+params[key];
    }).join('') + appSecret;

    return crypto.createHash('sha1').update(paramsStr).digest('hex');
}

exports.signParams = function(params, date, appKey, appSecret) {
    params.date = date;
    params.appKey = appKey;
    params.signature = genSign(params, appSecret);

    return params;
};
