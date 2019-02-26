'use strict';

var request = require('superagent');

var auth = require('./auth');

function farmerClient(host, appKey, appSecret) {

    function signParams(params) {
        params = params || {};
        return auth.signParams(params,
            new Date().getTime(),
            appKey,
            appSecret
        );
    }

    function errorJson(json) {
        return new Error(JSON.stringify(json, null, 2));
    }

    function done(resolve, reject) {
        return function(err, res) {
            if (err) {
                reject(err);
            } else {
                var body = res.body;
                if (body.statusCode) reject(errorJson(body));
                else resolve(body);
            }
        };
    }

    function ping() {
        return new Promise(function(resolve, reject) {
            request.get(host + '/ping')
            .end(done(resolve, reject));
        })
    }

    function getTargetsCount() {
        return new Promise(function(resolve, reject) {
            request.get(host + '/targets/count')
            .query(signParams())
            .end(done(resolve, reject));
        });
    }

    function getTargets(limit,last) {
        return new Promise(function(resolve, reject) {
            request.get(host + '/targets/?last=' + last + '&limit=' + limit)
            .query(signParams({
                "last":last,
                "limit":limit
            }))
            .end(done(resolve, reject));
        });
    }

    function getTargetsByPage(pageNum,pageSize) {
        return new Promise(function(resolve, reject) {
            request.get(host + '/targets/infos?pageNum=' + pageNum + '&pageSize=' + pageSize)
            .query(signParams({
                "pageNum":pageNum,
                "pageSize":pageSize
            }))
            .end(done(resolve, reject));
        });
    }

    function createTarget(target) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/targets/')
            .send(signParams(target))
            .end(done(resolve, reject));
        });
    }

    function getTarget(targetId) {
        return new Promise(function(resolve, reject) {
            request.get(host + '/target/' + targetId)
            .query(signParams())
            .end(done(resolve, reject));
        });
    }

    function updateTarget(targetId, data) {
        return new Promise(function(resolve, reject) {
            request.put(host + '/target/' + targetId)
            .send(signParams(data))
            .end(done(resolve, reject));
        });
    }

    function deleteTarget(targetId) {
        return new Promise(function(resolve, reject) {
            request.del(host + '/target/' + targetId)
            .query(signParams())
            .end(done(resolve, reject));
        });
    }

    function similar(image) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/similar/')
            .send(signParams(image))
            .end(done(resolve, reject));
        });
    }

    function getDetectionGrade(image) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/grade/detection/')
            .send(signParams(image))
            .end(done(resolve, reject));
        });
    }

    function getTrackingGrade(image) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/grade/tracking/')
            .send(signParams(image))
            .end(done(resolve, reject));
        });
    }

    return {
        ping: ping,
        getTargetsCount: getTargetsCount,
        getTargets: getTargets,
        createTarget: createTarget,
        getTarget: getTarget,
        getTargetsByPage:getTargetsByPage,
        updateTarget: updateTarget,
        deleteTarget: deleteTarget,
        similar: similar,
        getDetectionGrade: getDetectionGrade,
        getTrackingGrade: getTrackingGrade
    };

}

module.exports = farmerClient;
