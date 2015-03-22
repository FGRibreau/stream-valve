'use strict';

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

  stream._read = _wrap(stream._read, function (_read, n) {
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

function _wrap(f, wrapper) {
  return function wrappedFunc() {
    return wrapper.apply(this, [f].concat(Array.prototype.slice(arguments)));
  };
}

module.exports = valve;
