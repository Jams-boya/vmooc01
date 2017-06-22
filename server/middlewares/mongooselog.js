var mongoose  = require('mongoose');
var mylog     = require('../middlewares/mylog');
var config    = require('../config');

if (config.debug) {
  var traceMQuery = function (method, info, query) {
    return function (err, result, millis) {
      if (err) {
        logger.log('error', 'traceMQuery error:' + err)
      }
      var infos = [];
      infos.push(query._collection.collection.name + "." + method.blue);
      infos.push(JSON.stringify(info));
      infos.push((millis + 'ms').green);

      mylog.log("debug", infos.join(' '));
    };
  };

  mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery);
}
