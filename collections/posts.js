Posts = new Meteor.Collection('posts');

Meteor.methods({
	post: function(postAttributes) {
		var user = Meteor.user(),
		postWithSameLink = Posts.findOne({url: postAttributes.url});
		
///var b = Meteor.user().emails;
///var c= b.shift();
// ensure the user is logged in
if (!user)
	throw new Meteor.Error(401, "You need to login to post new stories");
// ensure the post has a title
if (!postAttributes.title)
	throw new Meteor.Error(422, 'Please fill in a headline');
// check that there are no previous posts with the same link
if (postAttributes.url && postWithSameLink) {
	throw new Meteor.Error(302,
		'This link has already been posted',
		postWithSameLink._id);
}
// pick out the whitelisted keys
var post = _.extend(_.pick(postAttributes, 'title','url','status', 'logo','desc'), {
	userId: user._id,
	author: user.profile.name,
	submitted: new Date().getTime(),
	commentsCount: 0
});

var postId = Posts.insert(post);
return postId;
},
remove:function(currentPostId){
	Posts.remove(currentPostId);
},
upvote: function(postId) {
	var user = Meteor.user();
// ensure the user is logged in
if (!user)
	throw new Meteor.Error(401, "You need to login to upvote");
Posts.update({
	_id: postId,
	upvoters: {$ne: user._id}
}, {
	$addToSet: {upvoters: user._id},
	$inc: {votes: 1}
});
}
});