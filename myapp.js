if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    },
    
    userr: function () {
     var user = Meteor.user();

     


     return Meteor.user().profile.name;
   }
 });
  
  postsHandle=Meteor.subscribeWithPagination('posts', 4);
  Meteor.autorun(function() {
    Meteor.subscribe('comments', Session.get('currentPostId'));
  })
  Meteor.subscribe('notifications');
  
  Template.postsList.helpers({
    posts: function() {
      return Posts.find({}, {sort: {submitted: -1}, limit: postsHandle.limit()}
        )
    },
    postsReady: function() {
      return ! postsHandle.loading();
    },
    allPostsLoaded: function() {
      return ! postsHandle.loading() &&
      Posts.find().count() < postsHandle.loaded();
    }
  });
  
  Template.hello.rendered = function() {
   $('a[rel=tooltip]').tooltip(); //initialize all tooltips in this template
   $('li[rel=dropdown]').dropdown();
 };
 Template.postsList.events({
  'submit form': function(event) {
    console.log("this was clicked");
    event.preventDefault();
    postsHandle.loadNextPage();
  }
});    
 

 Template.postPage.helpers({
  currentPost: function() {
    return Posts.findOne(Session.get('currentPostId'));
  },    submittedText: function() {
    return new Date(this.submitted).toString();
  },
  comments: function() {
    return Comments.find({postId: this._id});
  }
});


 Template.hello.events({
  'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
 
 Template.comment.helpers({
  submittedText: function() {
    return new Date(this.submitted).toString();
  }
});
 
 
 
 
 
 
 
 
 Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function(){
    return Notifications.find({userId: Meteor.userId(), read: false}).count()
    ;
  }
});
 Template.notification.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});
 
 
 
 
 
 
 
 
 
 
 Template.commentSubmit.events({
  'submit form': function(event, template) {
    event.preventDefault();
    console.log("this was clicked");
    var comment = {
      body: $(event.target).find('[name=body]').val(),
      postId: template.data._id
    };
    Meteor.call('comment', comment, function(error, commentId) {
      error && throwError(error.reason);
    });
  }
});    
 
 
 
 Template.postEdit.helpers({
  post: function() {
    
    return Posts.findOne(Session.get('currentPostId'));
  }
});
 Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});
 Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    var currentPostId = Session.get('currentPostId');
    var postProperties = {
      title: $(e.target).find('[name=title]').val(),
      status: $(e.target).find('[name=status]').val(),
      logo: $(e.target).find('[name=logo]').val(),  
      desc: $(e.target).find('[name=desc]').val(),   
    }
    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
// display the error to the user
alert(error.reason);
} else {

}
});
  },
  'click .delete': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      Meteor.call('remove', Session.get('currentPostId'), function(error, id) {
        if (error){
          return alert(error.reason);}
          else{window.location = "/";}
        });

    }
  }
});
 
 
 
 
 
 
 Template.postSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var post = {
      title: $(event.target).find('[name=title]').val(),
      url: $(event.target).find('[name=url]').val(),
      status: $(event.target).find('[name=status]').val(),
      logo: $(event.target).find('[name=logo]').val(),
      desc: $(event.target).find('[name=desc]').val()
    }
    Meteor.call('post', post, function(error, id) {
      if (error)
        return alert(error.reason);

    }  );
    
    window.location = "/";
    
    
    
    
    
    
  }
});
 
 
 
 
 Template.upvote.events({
  'submit form': function(event) {
    event.preventDefault();
    Meteor.call('upvote', this._id);
  }
});
 
 
 Template.upvote.helpers({


  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'upvotable';
    } else {
      return 'disabled';
    }
  }        
});  
 
 
 Template.postItem.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  commentsCount: function() {
    return Comments.find({postId: this._id}).count();
  },
  submittedText: function() {
    return new Date(this.submitted).toString();
  }
});
 
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
