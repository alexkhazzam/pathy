'use strict';
exports.__esModule = true;
var child_process_1 = require('child_process');
var fs_1 = require('fs');
var isFile = function (current, target) {
  return fs_1.statSync(current + '/' + target).isFile();
};
var errorHandler = function (err) {
  throw err;
};
var ls = function (p, results) {
  child_process_1.exec('ls ' + p, function (error, stdout, stderr) {
    error || stderr
      ? errorHandler(error || stderr)
      : results(stdout.split('\n'));
  });
};
var deleteFileExtension = function (fileNames, extension, p) {
  fileNames.forEach(function (route) {
    var isDir = !isFile(p, route);
    if (route.endsWith('.' + extension) && !isDir) {
      fs_1.unlink(p + '/' + route, function (err) {
        return err ? errorHandler(err.message) : null;
      });
    } else if (isDir && route) {
      ls(p + '/' + route, function (results) {
        results.pop();
        results.length > 0
          ? deleteFileExtension(results, extension, p + '/' + route)
          : null;
      });
    }
  });
};
module.exports.deepExtensionRemoval = function (extension, p) {
  return ls(p, function (results) {
    return deleteFileExtension(results, extension, p);
  });
};
