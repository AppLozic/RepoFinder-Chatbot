var fs = require("fs");
var path = require("path");
var dbHelper = require("./mongoDbHelper.js");
var config = require("../conf/config.js");
var request = require("request");

exports.sendGithubRepoInMail = function(sendMessageOptions,tag,email, name, callback){

var filterOptions={skip:0,
					limit:10,
					sort:[['priority','desc']]
				}
name= name?name:email;

var replyMessage="";
dbHelper.find("repos",{topics:tag},null,function(err, data){
if(err){
	console.log("failed to fetch the data from ", err);
}else{

  data.forEach(function(item, index){
  	console.log("for each");

  		replyMessage = replyMessage+"<tr><td><div style='padding: 6px 0px 6px 2px'>"+(index+1) +" : "+ item.description +"\n <a href ="+item.htmlUrl+">"+item.htmlUrl+"</a>"+"</div></td></tr> \n";

  });

  //console.log("data : ", replyMessage);
  fs.readFile(path.join(__dirname, "../html/emailTemplate.html"), function (err, data) {
   try{
   if (err) {
      console.error("error while reading email template file : ", err);
   }else{
   console.log("Email template fetched successfully....");
   var message = data.toString().replace("[NAME]",name).replace("[more-rows]",replyMessage);

    var mailObject = {

    	tos:[email],
    	subject:" Tools and Libraries",
    	from: "support@applozic.com",
    	fromName: "RepoFinder",
    	body: message
    }

    sendMessageOptions.url=config.get(config.getEnvironmentId()).applozicPlugin.sendMailUrl;
	sendMessageOptions.json=mailObject;
	sendMessageOptions.metadata={};

    request(sendMessageOptions,function(error,resp,respBody){
				if(!error&&resp.code==200){
					console.log(" mail sent at "+sendMessageOptions.json.tos+" successfully");
					//callback(null, respBody)
				}else{
					var statusCode = resp?resp.statusCode:error;
					console.log("error while sending mail: ERROR/ Statuscode : ", statusCode);

					//callback(error);
				}
			});


}
}catch(error){

	console.log(error);
}
});


}

},null,filterOptions);
//

}

