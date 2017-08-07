'use strict';

var request = require('superagent');
var websocket = require('ws');
var msgpack = require('msgpack5')();
var Q = require('q');
Q.longStackSupport = true;

var auth = require('./auth');

function gatewayClient(host, appKey, appSecret) {

    function signParams(params) {
        params = params || {};
        return auth.signParams(params,
            new Date().toISOString(),
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
        return Q.promise(function(resolve, reject) {
            request.get(host + '/ping')
            .end(done(resolve, reject));
        });
    }

    function search(image) {
        return Q.promise(function(resolve, reject) {
            request.post(host + '/search')
            .send(signParams(image))
            .end(done(resolve, reject));
        });
    }

    function createTunnel() {
        return Q.promise(function(resolve, reject) {
            request.post(host + '/tunnels/')
            .send(signParams())
            .end(done(resolve, reject));
        });
    }

    function searchViaTunnelOnHost(host, tunnel, image) {
        return Q.promise(function(resolve, reject) {
            var searchTunnel = 'ws://' + host + '/services/recognize/' + tunnel;
            var ws = new websocket(searchTunnel);
            ws.on('open', function() {
                ws.send(msgpack.encode(image), function(err) {
                    if (err) reject(err);
                });
            });
            ws.on('message', function(data) {
                var res = JSON.parse(data);
                if (res.statusCode) reject(errorJson(res));
                else resolve(res);
                ws.close();
            });
            ws.on('error', function(err) {
                reject(err);
            });
        });
    }

    function searchViaTunnel(tunnel, image) {
        return searchViaTunnelOnHost(host.substr(host.indexOf('://') + 3), tunnel, image);
    }

    return {
        ping: ping,
        search: search,
        createTunnel: createTunnel,
        searchViaTunnelOnHost: searchViaTunnelOnHost,
        searchViaTunnel: searchViaTunnel
    };

}

module.exports = gatewayClient;
