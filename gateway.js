'use strict';

var request = require('superagent');
var websocket = require('ws');
var msgpack = require('msgpack5')();
var Q = require('q');
Q.longStackSupport = true;

var auth = require('./auth');

function gatewayClient(host, keypair) {

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
            .set('Connection','keep-alive')
            .send(auth.signParams(keypair, image))
            //.set('Authorization',keypair.token)
            .end(done(resolve, reject));
        });
    }

    function searchWithFile(imagePath, params) {
        return Q.promise(function(resolve, reject) {
            var req = request.post(host + '/v2/search')
            .attach('image', imagePath);
            genRequest(req, auth.signParams(keypair, params))
            .end(done(resolve, reject));
        });
    }

    function createTunnel() {
        return Q.promise(function(resolve, reject) {
            request.post(host + '/tunnels/')
            .send(auth.signParams(keypair))
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

    function genRequest(req, param) {
        Object.keys(param).forEach(key => {
            req.field(key, param[key])
          });
        return req;
    }

    return {
        ping: ping,
        search: search,
        createTunnel: createTunnel,
        searchViaTunnelOnHost: searchViaTunnelOnHost,
        searchViaTunnel: searchViaTunnel,
        searchWithFile: searchWithFile
    };

}

module.exports = gatewayClient;
