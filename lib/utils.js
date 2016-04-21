var fs = require('fs');
var _ = require('lodash');

exports.mkdirPSync = function (path, root) {
  root = root || '';
  path = _.isString(path) ? path.split('/') : path;
  var current = _.first(path);
  if (current) {
    if (!fs.existsSync(root + current)) {
      fs.mkdirSync(root + current);
    }
    exports.mkdirPSync(_.tail(path), root + current + '/');
  }
};