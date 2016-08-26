var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
db.linkSchema.plugin(require('mongoose-lifecycle'));

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

db.linkSchema.pre('save', function(next) {

  console.log('We are in the beforeSave event');
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
  next();
});

var LinkMon = mongoose.model('Link', db.linkSchema);

module.exports = LinkMon;
