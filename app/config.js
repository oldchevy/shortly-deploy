var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.mongodb')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017');
var db2 = mongoose.connection;
db2.on('error', console.error.bind(console, 'connection error:'));
db2.once('open', function() {
  console.log('Weve connected to our DB!!');


  //Define scheme HERE
  var linkSchema = mongoose.Schema({
    id: {type: Number,
         index: true},
    url: String,
    baseUrl: String,
    code: String,
    title: String,
    visits: Number,
    timestamps: {
      type: Date,
      default: Date.now
    }
  });

  var userSchema = mongoose.Schema({
    id: {type: Number,
         index: true },
    username: String,
    password: String,
    timestamps: {
      type: Date,
      default: Date.now
    }
  });



});




db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});


//Some comment we want to find on the server!
//Let's see.....
module.exports = db;
