var router = require("../main.js"), utility  = require("./utility.js"), validate = require('express-validation');

var path= require("path");
var bodyParser = require('body-parser');
var request = require("request");
var botService = require("./botService.js");
var validation=require("./validation.js");
var consumers = require("./messageConsumers.js");
var messageProcessor = require("./messageProcessor.js");


router.post('/',validate(validation.bot), function (req, res) {
	console.log(" request received to create bot....");
   var botName = req.body.name, botId=req.body.key, platform=req.body.aiPlatform, token=req.body.clientToken, devToken=req.body.devToken, brokerUrl=req.body.brokerUrl, type=req.body.type;

   var bot = {key:req.body.key,name:req.body.name,applicationKey:req.body.applicationKey,accessToken:req.body.accessToken,authorization:req.body.authorization,brokerUrl:req.body.brokerUrl,type:req.body.type}
   botService.createBot(bot,function(err,result){

   	if(!err){
			//consumers.initialize(messageProcessor.processMessage);
			//var consumerPool = consumers.consumerPool;
			try{
			consumers.subscribeTioic(bot.brokerUrl,bot.key);
		}catch(err){
			console.log("ERROR",err);
			res.status(500).json({"code":"500","message":"not able to subscribe broker"}).end();
		}
   		res.status(201).json(result).end();

   	}else{
   		res.status(500).json(err).end();
   	}

   });
});


router.post('/:key/configure',validate(validation.botConfig), function (req, res) {

	var bot = {key:req.params.key,token:req.body.clientToken,devToken:req.body.devToken,aiPlatform:req.body.aiPlatform};
	botService.updateBotConfig(bot,function callback(err,result){
		if(!err){
			res.status(200).json(result).end();
		}else{
			console.log(err);
			res.status(500).json(result).end();
		}

	})
});



router.post('/message', function (req, res) {

	console,log("message received from webhook! depricated...");
});




router.post('/abc',function(req,res){

	console.log("request received to create a bot with body",req.body);
	if(req.body){

		var botName = req.body.name, botId=req.body.key, platform=req.body.aiPlatform, token=req.body.clientToken, devToken=req.body.devToken, brokerUrl=req.body.brokerUrl;
		if(botName&&botId&&plateform&&token&&brokerUrl){
			utility.createBot(botName,botId,platform,token,devToken,brokerUrl);
			res.status(200).send('{"code":"Success", "message":"created"}');

		}else{
			res.status(400).send('{"code":"Bad Request","message":"some fields are missing from body"}');
		}
	}


	//utility.configerBot(req,res)
});

module.exports=router;
