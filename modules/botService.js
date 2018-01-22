/*var dbHelper =require("./mongoDbHelper.js");

exports.createBot= function(bot,callback){
	if(bot){
		dbHelper.insert("botConfig",bot,function(error,result){
		callback(error,result);

	});

}
}*/

exports.findBotById = function(botId,callback){
	/*var collectionName="botConfig";
	var query={botId:botId,deleted:false};
	dbHelper.find(collectionName,query,callback);*/
callback(null,{ 
		key: 'f016bfee-c4b5-4180-b972-f982a0037e1e',
		name: 'RepoFinder',
		applicationKey: 'applozic-sample-app',
		accessToken: 'RepoFinder',
		authorization: 'UmVwb0ZpbmRlcjo4ODFiNzkwMi01M2ViLTQ2Y2YtYWI4My04MWE5ZDBkMWUzMGY=',
		brokerUrl: 'https://apps.applozic.com',
		clientToken: 'c010b3045998482aa07f4e19f54d3b8c',
		aiPlatform: 'api.ai',
		welcomeMessage: 'Hey there! Glad to see you here. To get started click the button below...',
		botId: 'RepoFinder',
		deleted: false 
	});

}
/*exports.updateBotConfig= function(bot,callback){
console.log("bot detail",bot);
		dbHelper.update("botConfig",{"key":bot.key},bot,null,function(err,result){
	err?callback(err):callback(null,result);
});

}*/
