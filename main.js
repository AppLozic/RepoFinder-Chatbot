console.log(" Bot Interface started....");

var http = require("http");

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var request = require("request");

var app = express();

var router = express.Router();
var homeroute = express.Router();
const cors = require("cors");

module.exports = router;
app.use(cors());

// static resources
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.use("/images", express.static("images"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./modules/routers.js");
app.use("/bot", routes);
app.use("/", homeroute);

var consumers = require("./modules/messageConsumers.js");
var messageProcessor = require("./modules/messageProcessor.js");
var botService = require("./modules/botService.js");
var config = require("./conf/config.js");
var userService = require("./modules/userService.js");
var server = app.listen(config.get(process.env.NODE_ENV).port);

// initialize consumers to consume messages from broker
consumers.initialize(messageProcessor.processMessage);

// custom routes
homeroute.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/html/fullview.html"));
});

var sendMessageUrl = config.get(process.env.NODE_ENV).applozicPlugin
  .sendMessageUrl;
console.log("send Message url : ", sendMessageUrl);

router.get("/welcomeMessage", function(req, res) {
  var userId = req.query.userId;

  console.log("userId: ", userId);
  var botId = req.query.botId;
  var response = {};

  userService.upsertUser({ id: userId }, function(error, result) {
    if (error) {
      console.log("ERROR : ", error);
    } else {
      console.log("SUCCESS: user created/updated successfully");
    }
  });
  botService.findBotById(botId, function(error, result) {
    if (error) {
      console.log("error while fetching bot details from db", error);
      response.status = 500;
      response.description = "Internal server error";
    } else {
      console.log("botdetail from db: ", result);

      var sendMessageOptions = {
        url: sendMessageUrl,
        method: "POST",
        json: {
          to: userId,
          message: result.welcomeMessage,
          metadata: {
            actions: '[{"name":"lets get started","hidden":false}]',
            messageType: "APPLOZIC_BOT"
          }
        },
        headers: {
          "Access-Token": result.accessToken,
          "Application-Key": result.applicationKey,
          //"Authorization":"Basic Ym90QGFwcGxvemljLmNvbToxOGU3NWZiNS1kZjFhLTQ4ZGMtODNjZC1iYTIwNzRjNDRjZTg="
          Authorization: "Basic " + result.authorization
        }
      };
      console.log("send message option : ", sendMessageOptions);
      request(sendMessageOptions, function(error, resp, respBody) {
        console.log("inside send message callback", respBody);
        if (!error && resp.statusCode == 200) {
          console.log(" message sent to " + userId);
          response.status = 200;
          response.description = "success";
          res.send(response);
        } else {
          console.log(
            "not able to send the message.  server has  returned status code: " +
              resp.statusCode
          );
          response.status = 500;
          response.description = "internal server error";
          res.send(response);
        }
      });
    }
  });
});
