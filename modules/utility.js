var request = require("request");
var dbHelper =require("./mongoDbHelper.js");

exports.replyOptions={

		"getStarted":"[{\"name\":\"Show Me!\",\"hidden\":false}]",
		"showLibrary":"[{\"name\":\"Email Me\",\"hidden\":false},{\"name\":\"Show Me More\",\"hidden\":false}]",
		"showLibrary - more":"[{\"name\":\"Email Me\",\"hidden\":false},{\"name\":\"Show Me More\",\"hidden\":false}]",
		"showLibrary - mailMe":"[{\"name\":\"Yes, Show Me More\",\"hidden\":false},{\"name\":\"No, That should be all for now\",\"hidden\":false}]",
		"showLibrary - mailMe - fetchmore":"[{\"name\":\"Email Me\",\"hidden\":false},{\"name\":\"Show Me More\",\"hidden\":false}]"
	}


exports.createBot= function(botName,botId,plateform,token,devToken,brokerUrl){
	//req.body = botName, botId, plateform, token, devToken broker_url

	var document ={id:botId,name:botName,plateform:plateform,token:token,devToken:devToken, brokerUrl:brokerUrl}

	dbHelper.insert("botConfig",document,function(error,result){
		if(error){
			console.log("error while creating bot : ",error);
		}else{
			console.log("successfully created : ", result);

		}

	});

}

exports.getAllBots = function(callback){

	dbHelper.find("botConfig", undefined, undefined, function(result) {

       callback(result);

    });
}



exports.sendMessageToAPI_AI = function(message,sessionId,botDetails,callback){

	var apiUrl = botPlatform[botDetails.aiPlatform].urls.query.replace(":query",message).replace(":sessionId",sessionId);
	var requestOptions = {
		url: apiUrl,
		headers: {
			'Authorization': 'Bearer '+botDetails.clientToken
		}
	};

	request(requestOptions,callback);
}
