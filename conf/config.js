var config = {
  development: {
   brokerUrl:["https://apps.applozic.com"],
    mongoDbUrl:"mongodb://admin:admin@localhost:27017/ApplozicBot?authSource=admin",
     applozicPlugin:{
      sendMessageUrl:"https://apps.applozic.com/rest/ws/message/v2/send",
      sendMailUrl:"https://apps.applozic.com/rest/ws/mail/send"
    },
    port:4000
  }
}

exports.get = function get(env) {
  return config[env] || config.development;
}
exports.getEnvironmentId = function(){
return process.env.NODE_ENV;
}
