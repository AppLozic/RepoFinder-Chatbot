var mqtt = require('mqtt');
var dbHelper = require("./mongoDbHelper.js");
var messageProcessor = require("./messageProcessor.js");
var config = require("../conf/config.js");
const userName = require('username');
// consumerPool stores one consumer per brokerUrl { "brokerUrl 1 ": ["topic 1","topic 2",......, "topic n"],.....,"brokerUrl n": ["topic 1","topic 2",......, "topic n"]}
var consumerPool = {};
var brokerTopicsMap = {};
var loginUserName;
const brokerUrl="https://apps.applozic.com";

var subscribeTopicsOnBroker = function(processMessage) {
  var clientId = "Client-"+Math.random();
    
  console.log("clientId : ",clientId);
  var consumer = mqtt.connect(brokerUrl, { clientId: clientId, clean: false });
  console.log("connected with message broker", brokerUrl);

  if (consumer) {
    consumer.on("connect", function(connack) {
      //console.log("this",this);
      console.log("subscribing topics on broker ");
    
      //When clean connection option is false and server has a previous session for clientId connection option, then connack.sessionPresent flag is true. When that is the case, you may rely on stored session and prefer not to send subscribe commands for the client.
      consumer.subscribe("f016bfee-c4b5-4180-b972-f982a0037e1e", function(err, granted) {
        if (err) {
          console.log(
            "error while subscribing topic List ");
        } else {
          console.log("subscription granted on message broker ",granted);
        }
      });
    });
    consumer.on("message", function(topic, message) {
      //console.log('received message on topic : ' + topic, message.toString());
      console.log("message Received",message);
      processMessage(message, topic);
    });

    consumer.on("error", function(error) {
      console.log("error ", error.toString());
    });

    consumer.on("reconnect", function() {
      console.log("reconnecting..... ", this.options.host);
    });
  } else {
    console.log(
      "WARNING : a bot want to connect to broker url which is not initilized :  " +
        key +
        "  please add this url in config.js"
    );
  }
};

var initialize = function(processMessage) {
    var brokerUrlList = config.get(process.env.NODE_ENV).brokerUrl;
    console.log("broker urls has been loaded from config.js", brokerUrlList);
    var topicCounter = 0;
    subscribeTopicsOnBroker(processMessage);

}


module.exports={
initialize:initialize,
subscribeTopicsOnBroker:subscribeTopicsOnBroker
};
