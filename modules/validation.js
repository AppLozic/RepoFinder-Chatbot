var Joi= require("joi");

module.exports.bot={
	body:{
		name:Joi.string().required(),
		key:Joi.string().required(),
		brokerUrl:Joi.string(),
		accessToken:Joi.string().required(),
		applicationKey:Joi.string().required(),
		authorization: Joi.string().base64().required()

	}
}
module.exports.botConfig={
	body:{

		aiPlatform: Joi.string().required(),
		clientToken: Joi.string().required(),
		devToken: Joi.string().required()

	},param:{
		key:Joi.string().required()
	}
}
