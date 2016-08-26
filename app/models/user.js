var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

db.userSchema.plugin(require('mongoose-lifecycle'));

// var UserBook = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
  // hashPassword: function() {
  //   var cipher = Promise.promisify(bcrypt.hash);
  //   return cipher(this.get('password'), null, null).bind(this)
  //     .then(function(hash) {
  //       this.set('password', hash);
  //     });
  // }
// });

db.userSchema.methods.comparePassword = function (password, cb) {
  console.log(this.password);
  cb(this.password === password);
};

db.linkSchema.pre('save', function(next) {

  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
      next();
    });
});

var UserMon = mongoose.model('User', db.userSchema);

module.exports = UserMon;
