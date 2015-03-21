'use strict';

var _ = require('lodash');

/**
 * Ensure that the stream disconnects if it goes over `maxBytes` `perSeconds`
 * @param  {Stream} stream
 * @param  {Number} maxBytes   number of bytes
 * @param  {Number} perSeconds number of seconds
 * @return {Stream}            [description]
 */
function valve(stream, maxBytes, perSeconds) {
  var lastTime = Date.now();
  var bytesReceived = 0;
  var lastBytesRead = 0;

  stream._read = _.wrap(stream._read, function (_read, n) {
    var now = Date.now();

    var totalMs = now - lastTime;

    if (totalMs / 1000 > perSeconds) {
      bytesReceived = 0;
      lastTime = now;
    }

    bytesReceived += this.bytesRead - lastBytesRead;
    lastBytesRead = this.bytesRead;

    if (bytesReceived > maxBytes) {
      var err = new Error('ESOCKETOVERFLOW');
      this.destroy(err);
      return false;
    }

    return _read.call(this, n);
  });

  return stream;
}

module.exports = valve;
