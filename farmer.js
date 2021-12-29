'use strict';

var request = require('superagent');
var auth = require('./auth');

function farmerClient(host, keypair) {

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
        });
    }

    function getTargetsCount() {
        return new Promise(function(resolve, reject) {
            request.get(host + '/targets/count')
            .query(auth.signParams(keypair))
            .end(done(resolve, reject));
        });
    }

    function getTargetsByPage(pageNum,pageSize) {
        return new Promise(function(resolve, reject) {
            request.get(host + '/targets/infos?pageNum=' + pageNum + '&pageSize=' + pageSize)
            .query(auth.signParams(keypair, {
                "pageNum":pageNum,
                "pageSize":pageSize
            }))
            .end(done(resolve, reject));
        });
    }

    function  createTarget(target) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/targets/')
            .send(auth.signParams(keypair, target))
            .end(done(resolve, reject));
        });
    }

    function getTarget(targetId) {
        return new Promise(function(resolve, reject) {
            request.get(host + '/target/' + targetId)
            .query(auth.signParams(keypair))
            .end(done(resolve, reject));
        });
    }

    function updateTarget(targetId, data) {
        return new Promise(function(resolve, reject) {
            request.put(host + '/target/' + targetId)
            .send(auth.signParams(keypair, data))
            .end(done(resolve, reject));
        });
    }

    function deleteTarget(targetId) {
        return new Promise(function(resolve, reject) {
            request.del(host + '/target/' + targetId)
            .query(auth.signParams(keypair))
            .end(done(resolve, reject));
        });
    }

    function similar(image) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/similar/')
            .send(auth.signParams(keypair, image))
            .end(done(resolve, reject));
        });
    }

    function getDetectionGrade(image) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/grade/detection/')
            .send(auth.signParams(keypair, image))
            .end(done(resolve, reject));
        });
    }

    function getTrackingGrade(image) {
        return new Promise(function(resolve, reject) {
            request.post(host + '/grade/tracking/')
            .send(auth.signParams(keypair, image))
            .end(done(resolve, reject));
        });
    }

    return {
        ping: ping,
        getTargetsCount: getTargetsCount,
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
