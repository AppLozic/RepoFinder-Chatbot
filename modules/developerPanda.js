var config = require("../conf/config.js");
var request = require("request");
var utility = require("./utility.js");
var dbHelper = require("./mongoDbHelper.js");
var mailSender = require("./mailSender.js");
var userService = require("./userService.js");


function processMessage(data, to, botDetail) {
  var senMessageUrl = config.get(process.env.NODE_ENV).applozicPlugin.sendMessageUrl;
  var intent = data.result.metadata.intentName;

  var replyMessage = data.result.speech
  var replyOptions = utility.replyOptions[intent];

  var sendMessageOptions = {
    url: senMessageUrl,
    method: 'POST',
    json: {
      "to": to,
      "message": replyMessage,
      "metadata": {
        actions: replyOptions,
        messageType: "APPLOZIC_BOT"
      }

    },
    headers: {

      "Access-Token": botDetail.accessToken,
      "Application-Key": botDetail.applicationKey,
      "Authorization": "Basic " + botDetail.authorization

    }

  };
  console.log("webhook called for developer panda... processing Intent :", intent);
  switch (intent) {

    case "showLibrary":
    case "showLibrary - more":
    case "showLibrary - mailMe - fetchmore":
      processIntentShowLibrary(function(error, result) {});
      break;

    case "processName-askLibrary":
      console.log("processing Name.....");
      storeUserName(data);
      sendAwkToUser(sendMessageOptions, function(error, result) {});
      break;

    case "showLibrary - mailMe":
      processEmailRepoIntent(sendMessageOptions, data, function(error, result) {});
      break;
    default:
      sendAwkToUser(sendMessageOptions, function(error, result) {});
      break;


  }

  function processIntentShowLibrary(callback) {
    var counter = 1;
    var filterOptions = {};
    if (intent == "showLibrary - more") {
      filterOptions.skip = Math.floor(Math.random() * 10) + 1;
      filterOptions.limit = Math.floor(Math.random() * 5) + 1;

    } else {
      filterOptions.skip = 0;
      filterOptions.limit = 2;
      filterOptions.sort = [
        ['priority', 'desc']
      ]
    }

    console.log("filter options : ", filterOptions);
    if (data.result.parameters.library) {
      var findbyDescriptionAnTagQuery = {
        $and: [{
          description: {
            $regex: new RegExp(data.result.parameters.library, "i")
          }
        }, {
          topics: data.result.parameters.library
        }]
      };
      console.log("find by query : ", findbyDescriptionAnTagQuery);
      dbHelper.find("repos", findbyDescriptionAnTagQuery, function(error, item) {

        replyMessage = replyMessage + "\n " + counter++ + " : " + item.description + "\n" + item.htmlUrl;

      }, function(error, result) {
        if (!error && result.length > 0) {
          console.log("#####----got library with matching discription : ", replyMessage);
          sendMessageOptions.json.message = replyMessage;

          request(sendMessageOptions, function(error, resp, respBody) {
            if (!error && respBody.status == 'success') {
              console.log(" message sent to " + sendMessageOptions.json.to);
              callback(undefined, "success");
            } else {
              console.log("error while sending message to user. received code : " + respBody.status);
              callback("error");
            }
          });
        } else {
          console.log("#####---- couldn't find library with matching descritption... searching by tags..");
          dbHelper.find("repos", {
            topics: data.result.parameters.library
          }, function(error, item) {

            replyMessage = replyMessage + "\n " + counter++ + " : " + item.description + "\n" + item.htmlUrl;

          }, function(error, result) {
            if (!error && result.length > 0) {
              console.log("####----got library by tags : ", replyMessage);
              sendMessageOptions.json.message = replyMessage;

            } else {
              console.log("library not found in db.. ");
              replyMessage = "Pardon me! Right now I cant find any more information about " + data.result.parameters.library + ". \nAfter all I am made up of human written code under my fur..\n Contact my master at: support@applozic.com"

              sendMessageOptions.json.message = replyMessage;
              sendMessageOptions.json.metadata.actions = null;
            }
            request(sendMessageOptions, function(error, resp, respBody) {
              if (!error && respBody.status == 'success') {
                console.log(" message sent to " + sendMessageOptions.json.to);
                callback(undefined, "success");
              } else {
                console.log("error while sending message to user. received code : " + respBody.status);
                callback("error");
              }
            });
          }, {}, filterOptions);
        }
        1
      }, {}, filterOptions);
    }else{
      if (intent=="showLibrary - mailMe - fetchmore"){
        sendMessageOptions.json.metadata.actions="[{\"name\":\"Email Me\",\"hidden\":true},{\"name\":\"Show Me More\",\"hidden\":true}]";
      }
      sendAwkToUser(sendMessageOptions, function(error, result) {});
    }



  };

  function processEmailRepoIntent(callback) {

    console.log("proccessing intent showLibrary - mailMe ");
    //var defaultTag = "chat";
    var tag = data.result.parameters.library,
      email = data.result.parameters.email,
      sessionId = data.sessionId,name="";
    if (!email) {
      dbHelper.find('users', {
        id: sessionId
      }, null, function(error, result) {

        if (!error && result.length > 0&&result[0].email) {
          // got email from db
          email = result[0].email;

          console.log("got emailId from db.. sending response to API.AI for sessionId : ", sessionId, " emailId: ", email);
          //mailSender.sendGithubRepoInMail(sendMessageOptions, tag, email, function(error, result) {});
					utility.sendMessageToAPI_AI(email,sessionId,botDetail,function(err,resp,respBody){
							if(!err && resp.statusCode==200){
								//process email message
								var data = JSON.parse(respBody);
								console.log("response received from API.AI params= ",data.result.parameters);
								processMessage(data,to,botDetail);

							}
					});
        } else {
          //ask email id from user
          console.log("emailId not exist in db for userId : " + sessionId + " asking user for email");
          sendMessageOptions.json.metadata.actions= "[{\"name\":\"Yes, Show Me More\",\"hidden\":true},{\"name\":\"No, That should be all for now\",\"hidden\":true}]";
					sendAwkToUser(sendMessageOptions, function(error, result) {});
        }
      });
    } else {
      //got email from user send mail ;
      console.log("got emailId from user... initiating send mail..");
			try {
        var emailId = processEmail(email);
        dbHelper.update("users", {
          id: sessionId
        }, {
          email: emailId
        }, null, function(err, res) {})
        mailSender.sendGithubRepoInMail(sendMessageOptions, tag, emailId, name, function(error, result) {});

      } catch (error) {

        console.log(" error: invalid Email : ", email);
      }
			sendAwkToUser(sendMessageOptions, function(error, result) {});
    }
  }

  function processEmail(email) {
    if (email) {
      var posssibleIds = email.split(' ');
      console.log("possible Ids: ", posssibleIds);
      var mailId = null;
      var counter = 0;
      posssibleIds.some(function(item, index, array) {
        if (item.indexOf('@') > -1) {
          mailId = item;
          counter = array.length
          console.log(" found @ in item. counter =" + counter + " item : " + item);
          //return false to break the loop
          return true;
        }
        counter++;

      });
      console.log("possibleIds length : ", posssibleIds.length);
      while (posssibleIds.length == counter) {
        console.log("email extracted : ", mailId);
        return mailId;

      }
    } else {
      throw new Error("Empty Email");
    }
  }

  function sendAwkToUser(sendMessageOptions, callback) {

    request(sendMessageOptions, function(error, resp, respBody) {
      if (!error && resp.statusCode == 200) {
        console.log(" message sent to user " + sendMessageOptions.json.to + " successfully");
        //callback(null, respBody)
      } else {
        console.log("error while sending message to user. received code : " + resp.statusCode);
        //callback(error);
      }
    });
  }

  function storeUserName(data) {

    var sessionId = data.sessionId;
    var userName = data.result.parameters.name
    console.log("storing user  id and Name: ", sessionId, userName);
    if (userName && sessionId) {

      userService.upsertUser({
        id: sessionId,
        name: userName
      }, function(error, result) {
        if (error) {
          console.log("ERROR : not able to update user name for session Id", error);

        } else {
          console.log("SUCCESS: user name updated successfully for session Id:  ", userName, sessionId);
        }
      })

    }
  }

}
exports.processMessage=processMessage;
