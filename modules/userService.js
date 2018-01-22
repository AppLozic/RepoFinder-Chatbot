var dbHelper = require("./mongoDbHelper.js");
exports.createUser = function(user, callback){

if(!user){
	callback(new Error("Empty user received. "));
}else{

	if(user.id){

		dbHelper.find("users",{"id":user.id},null,function(error,result){
			//todo need unique index on user id
			if(result.length==0){

				db.insert("user",user,callback);
			}else{
				callback(new Error("user already exist"));

			}
		});

	}
}

}
exports.upsertUser = function(user,callback){
	
	if(!user){
		callback(new Error("Empty user received. "));
	}else{

		if(user.id){
			console.log("upserting User",user );
			dbHelper.upsert("users",{"id":user.id}, user,callback);
		}

	}
}

exports.findUserDetailsbyId = function(userId){
	var userDetail= null;
	dbHelper.find("users",{"id":userId},null,function(error,result){
		//todo need unique index on user id
		if(result.length>0){

			db.insert("user",user,callback);
		}else{
			callback(new Error("user already exist"));

		}
	});

}
