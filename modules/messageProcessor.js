var request = require("request");
var dbHelper =require("./mongoDbHelper.js");
var config = require("../conf/config.js");
var panda = require("./developerPanda.js");
var utils = require("./utility.js");
var botService = require("./botService");
var botPlatform =utils.botPlatform;
exports.processMessage = function(messageStr,recipient){
	if(messageStr){
		try{
		var message = JSON.parse(messageStr);
	}catch(err){
		console.log("invalid JSON received", messageStr);
		//throw new Error("invalid JSON received");
		return;
	}

		if(message.type==="APPLOZIC_01"){
			console.log("processing message: " + message.message.message);

			botService.findBotById("RepoFinder",function(err,botDetail){


				console.log("bot detail loaded from db: ", botDetail);
				var token = botDetail.clientToken, aiPlatform = botDetail.aiPlatform, accessToken = botDetail.accessToken, applicationKey = botDetail.applicationKey, authorization = botDetail.authorization;
			
				if(!aiPlatform){
					console.log("not able to process the message. aiPlatform is missing for the botId: ", recipient );
					return;
				}

   			var apiUrl ="https://api.api.ai/api/query?query=:query&lang=en&sessionId=:sessionId".replace(":query",message.message.message).replace(":sessionId",message.message.to);
   			
  			var senMessageUrl=config.get(process.env.NODE_ENV).applozicPlugin.sendMessageUrl;
   			var options = {
  				url: apiUrl,
  				headers: {
    				'Authorization': 'Bearer '+token
  				}
	  		};
			// calling api.ai to get the response
			request(options,function(err,response,body){
				if(response.statusCode==200){
					//console.log(response);
					var data = JSON.parse(body);
					var result=data.result;
					console.log("response received from API.AI params= ",result.parameters);

					//console.log("response received from API.AI "+result.fulfillment.speech);
						panda.processMessage(data,message.message.to,botDetail);
   			}
			});
		});
	}
}
}
