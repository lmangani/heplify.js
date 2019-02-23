const uWS = require('uWebSockets.js');
const hepjs = require('hep-js');
const fs = require('fs');
const dgram = require('dgram');
const net = require('net');
const log = require('./logger');
const config = require('./config').getConfig();
const getFuncs = function(){
  const jsoncore = require('./jsoncore');
  return {
	config: config,
	processJson: jsoncore.processJson
  };
};

var self = module.exports = {
	getConfig: require('./config').getConfig,
	getFuncs: getFuncs,
	headerFormat: function(headers) {
	  return Object.keys(headers).map(() => '%s:cyan: %s:yellow').join(' ');
	},
	select: function(config){
		self[config.socket](config);
	},
        http: function({ port = undefined, address = '127.0.0.1' } = { address: '127.0.0.1' }) {
		const app = uWS.App({
		  key_file_name: 'misc/key.pem',
		  cert_file_name: 'misc/cert.pem',
		  // passphrase: '1234'
		}).ws('/*', {
		  /* Options */
		  compression: 0,
		  maxPayloadLength: 16 * 1024 * 1024,
		  idleTimeout: 10,
		  /* Handlers */
		  open: (ws, req) => {
			 log('%error:green %s', 'A WebSocket connected via URL: ' + req.getUrl() + '!');
		  },
		  message: (ws, message, isBinary) => {
		    /* Ok is false if backpressure was built up, wait for drain */
		    let ok = ws.send(message, isBinary);
		  },
		  drain: (ws) => {
			 log('%error:orange %s', 'WebSocket backpressure: ' + ws.getBufferedAmount());
		  },
		  close: (ws, code, message) => {
			 log('%error:red %s', 'websocket closed');
		  }
		}).any('/*', (res, req) => {
		  /* Read the body until done or error */
		  let url = req.getUrl();
		  readJson(res, (obj) => {
			if (data instanceof Array) {
	        	        data.forEach(function(subdata){
			            funcs.processJson(subdata,request.socket);
	        	        });
		        } else {
		            funcs.processJson(data,request.socket);
			}
		        res.end(204);
		  }, () => {
		    log('%error:red %s', 'Error processing JSON');
		  });

		}).listen(port, (token) => {
		  if (token) {
		    log('%error:green %s', 'Websocket listening on port '+port);
		  } else {
		    log('%error:red %s', 'Websocket failed on '+port);
		  }
		});
	},
};


/* Helper function for reading a posted JSON body */
function readJson(res, cb, err) {
  let buffer;
  /* Register data cb */
  res.onData((ab, isLast) => {
    let chunk = Buffer.from(ab);
    if (isLast) {
      let json;
      if (buffer) {
        try {
          json = JSON.parse(Buffer.concat([buffer, chunk]));
        } catch (e) {
          /* res.close calls onAborted */
          res.close();
          return;
        }
        cb(json);
      } else {
        try {
          json = JSON.parse(chunk);
        } catch (e) {
          /* res.close calls onAborted */
          res.close();
          return;
        }
        cb(json);
      }
    } else {
      if (buffer) {
        buffer = Buffer.concat([buffer, chunk]);
      } else {
        buffer = Buffer.concat([chunk]);
      }
    }
  });
}
