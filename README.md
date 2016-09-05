# stream-valve [![Deps](https://img.shields.io/david/FGRibreau/stream-valve.svg)](https://david-dm.org/FGRibreau/stream-valve) [![Version](https://img.shields.io/npm/v/stream-valve.svg)](https://david-dm.org/FGRibreau/stream-valve)  [![CI](https://img.shields.io/travis/FGRibreau/stream-valve/master.svg)](https://travis-ci.org/FGRibreau/stream-valve) [![Twitter Follow](https://img.shields.io/twitter/follow/fgribreau.svg?style=flat)](https://twitter.com/FGRibreau) [![available-for-advisory](https://img.shields.io/badge/available%20for%20consulting%20advisory-yes-ff69b4.svg?)](http://bit.ly/2c7uFJq)



Ensure that a stream disconnects if it goes over `maxBytes` `perSeconds`

### Sponsored by

<p align="center">
<strong>Stream-valve</strong> development was sponsored by <strong><a href="https://redsmin.com">Redsmin</a>, a fully loaded administration service for Redis</strong>.<br/><br/>
<a href="https://redsmin.com"><img src="https://www.redsmin.com/im/logo/rect-large-color-transparent@256.png"></a>
</p>

# Setup

```
npm install stream-valve
```

# Usage

```javascript
var valve = require('stream-valve');

socket = net.connect(6379, '127.0.0.1');

socket.on('error', function(err){
    // if valve maximum is reached a ESOCKETOVERFLOW error
    // will be emitted and the socket will be destroyed.
});

// disconnect the socket if it receive more than 1MB per 2 seconds
valve(socket, 1024 * 1024, 2);

socket.on('data', function(){
    // ...
});
```

<p align="center">
<a target="_blank" href="https://play.spotify.com/track/58iP9J86ksOPwbo0pWOafk"><img style="width:100%" src="https://cloud.githubusercontent.com/assets/138050/6766986/282bf3e4-d01d-11e4-9d2f-05cb55d3bdc1.gif"></a>
</p>

# [Changelog](/CHANGELOG.md)

# Donate

I maintain this project in my free time, if it helped you please support my work via [paypal](https://paypal.me/fgribreau) or [bitcoins](https://www.coinbase.com/fgribreau), thanks a lot!
