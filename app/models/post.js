var mongoose 	= require('mongoose');
var postSchema 	= new mongoose.Schema({
	createdOn	:String,
	avatar		:String,
	name		:String,
	post  		:[String],
	comments	:[String]
});

module.exports 	= mongoose.model('Post', postSchema);
