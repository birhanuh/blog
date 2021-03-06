// Require express module
var express = require('express');

// Require body-parser module
var bodyParser = require('body-parser');

// Create a varibale that we can run express from
var app = express();

// Points to where our static files going to be
app.use(express.static(__dirname + '/public'));

var port = 3001;

app.listen(port);

console.log('server on port: ' + port);

// Setup body-parser 
app.use(bodyParser.json());

// Setup mongoose (Normally in diffirent setup fiels)
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');

var Schema = mongoose.Schema
var BlogSchema = new Schema({
  author: String,
  title: String,
  url: String
});

mongoose.model('Blog', BlogSchema);
var Blog = mongoose.model('Blog');

/*var blog = new Blog({
  author: 'Michael',
  title: 'Michael\'s Blog',
  url: 'http://michaelsblog.com'
});
blog.save();*/

// Routes 
app.get('/api/blogs', function(req ,res) {
  Blog.find(function(err, docs) {
    docs.forEach(function(item) {
      console.log('Received a GET request for _id: ' +item);
    });
    res.send(docs);
  });
});

app.post('/api/blogs', function(req, res) {
  console.log('Received a POST request');
  for (key in req.body) {
    console.log(key+ ': ' +req.body[key]);
  }
  var blog = new Blog(req.body);
  blog.save(function(err, doc) {
    res.send(doc);
  });
});

app.delete('/api/blogs/:id', function(req, res) {
  console.log('Received a DELETE request for _id: ' +req.params.id);
  Blog.remove({_id: req.params.id}, function(err) {
    res.send({_id: req.params.id});
  });
});

app.put('/api/blogs/:id', function(req, res) {
  console.log('Received an UPDATE request for _id: ' +req.params.id);
  Blog.update({_id: req.params.id}, req.body, function(err) {
    res.send({_id: req.params.id})
  });
});
