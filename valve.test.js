'use strict';
var valve = require('./valve');

var config = require('common-env')(console).getOrElseAll({
  redis: {
    port: 6379,
    host: '127.0.0.1',
    auth: ''
  }
});


var Redis = require('redis');
var RedisClient = Redis.RedisClient;

var t = require('chai').assert;
var async = require('async');
var net = require('net');

describe('Valve', function () {
  it('should yield a usable read/write stream', function (done) {
    var redisSocket = net.connect(config.redis.port, config.redis.host, function () {
      var throttledSocket = valve(redisSocket);
      var redis = new RedisClient(throttledSocket, {
        enable_offline_queue: false
      });
      redis.auth(config.redis.auth);

      redis.on('ready', function () {
        redis.end();
        done();
      });

      redis.on_connect();
    });
  });

  describe('with a very large read', function () {

    beforeEach(function (done) {
      var redis = Redis.createClient(config.redis.port, config.redis.host);
      redis.auth(config.redis.auth);
      redis.on('ready', function () {
        redis.flushdb(function (err) {
          t.strictEqual(err, null);

          async.forEach(range(0, 3), function (a, f) {
            var keys = range(0, 50000).map(function () {
              return [Math.random() * 10000000000 + '', 1];
            });

            redis.mset(keys, function (err, n) {
              t.strictEqual(err, null);
              f();
            });
          }, done);
        });
      });
    })

    it('should disconnect the socket', function (done) {
      var throttledSocket = valve(net.connect(config.redis.port, config.redis.host, function () {
        var redis = new RedisClient(throttledSocket, {
          enable_offline_queue: false
        });
        redis.auth(config.redis.auth);

        redis.on('error', function (err) {
          t.include(err.message, 'ESOCKETOVERFLOW');
          done();
        });

        redis.on('ready', function () {
          redis.keys('*', function (err, keys) {
            t.include(err.message, 'ESOCKETOVERFLOW');
            t.deepEqual(keys, undefined);
            redis.end();
          });
        });

        redis.on_connect();
      }), 1024 * 1024, 2);
    });
  });
});

function range(s, e) {
  var out = [];
  for (var i = e - 1; i >= s; i--) {
    out.push(1);
  }
  return out;
}
