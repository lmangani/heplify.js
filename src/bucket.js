/*
 * Bulk Bucket Emitters
 * bucket.push(object);
 */

var config = require('./config').getConfig();
const log = require('./logger');
const bucket_emitter = require('./bulk-emitter')
const stringify = require('safe-stable-stringify');
var l_bucket;

// Loki
if (config.db.loki){
 try {
  var loki = require('./loki');
  log('%start:green Initialize Loki driver' );
  log('%start:green Initializing Bulk bucket...');
  l_bucket = bucket_emitter.create(config.queue);
  l_bucket.set_id = function(id){ return; }
  l_bucket.on('data', function(data) {
    // Bulk ready to emit!
    if (config.debug) log('%data:cyan Loki BULK Out %s:blue', stringify(data) );
		loki.insert(data);
  }).on('error', function(err) {
    log('%error:red %s', err.toString() )
  });

 } catch(e){ log('%stop:red Failed to Initialize Loki driver/queue',e); return; }
}

exports.l_bucket = l_bucket;


process.on('beforeExit', function() {
  bucket.close(function(leftData) {
    if (config.debug) log('%data:red BULK Leftover [%s:blue]', stringify(leftData) );
    if (r) r.db(config.dbName).table(config.tableName).insert(leftData).run(durability="soft", noreply=True);
  });
});

