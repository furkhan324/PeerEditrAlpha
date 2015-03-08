Comments = new Meteor.Collection('comments');
Meteor.methods({
	comment: function(commentAttributes) {
		var user = Meteor.user();
//var b = Meteor.user().emails;
//var c= b.shift();

var post = Posts.findOne(commentAttributes.postId);
// ensure the user is logged in
if (!user)
	throw new Meteor.Error(401, "You need to login to make comments");
if (!commentAttributes.body)
	throw new Meteor.Error(422, 'Please write some content');
if (!commentAttributes.postId)
	throw new Meteor.Error(422, 'You must comment on a post');
comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
	userId: user._id,
	author: user.profile.name,
	submitted: new Date().getTime()
});
    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});

// create the comment, save the id
comment._id = Comments.insert(comment);
// now create a notification, informing the user that there's been a comment

createCommentNotification(comment);
return comment._id;
},
    upvotec: function(commentId) {
	var user = Meteor.user();
// ensure the user is logged in
if (!user)
	throw new Meteor.Error(401, "You need to login to upvote");
Comments.update({
	_id: commentId,
	upvoters: {$ne: user._id}
}, {
	$addToSet: {upvoters: user._id},
	$inc: {votes: 1}
});
}
});