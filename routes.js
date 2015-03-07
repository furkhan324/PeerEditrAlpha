Router.route('/', function () {
  this.render('hello');
});

Router.route('/posts/:_id', function (id) {
  
  this.render('postPage');
    var params = this.params; // { _id: "5" }
  var id = params._id; // "5"
  Session.set('currentPostId', id); 
});

Router.route('/postSubmit', function () {
  this.render('postSubmit');
});

Router.route('/posts/:_id/postEdit', function (id) {
  
  this.render('postEdit');
    var params = this.params; // { _id: "5" }
  var id = params._id; // "5"
  Session.set('currentPostId', id); 
});