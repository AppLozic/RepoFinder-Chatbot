
var  config = require("../conf/config.js");
const mongoClient = require("mongodb").MongoClient;
const mongoURL = config.get(process.env.NODE_ENV).mongoDbUrl;

exports.insert = function(collectionName, document,callback){
	//console.log("db",db);
	mongoClient.connect(mongoURL,function(err,db){
		if(err){
			console.log("error while connecting to db: "+mongoURL,err);
			callback(err);
		}else{
			console.log("successfully connected to db : "+mongoURL);
			db.collection(collectionName).insert(document, callback);
		}

	});
		
	}

// find method find excute the given query on the given collection. if no query is passed it will return all documents in the exists in the given collection. 
// it accepts two callback: processRecord - will be called for every document, and callback will be called at the end of cursor with the compelete result set.
exports.find= function(collectionName, query, processDocument,callback, projection,options){

	mongoClient.connect(mongoURL,function(err,db){
	if(err){
		console.log("error while connecting to db: "+mongoURL,err);
		processDocument?processDocument(err,null):callback(err,null);
	}else{
		console.log("successfully connected to db : "+mongoURL);
		//var empty="{};
		query = query?query:{};
		//db.collection(collectionName).find(query,callback(err, item));
		console.log("executing query on collection : ",collectionName,query)
		var stream = db.collection(collectionName).find(query,projection,options).stream();
		var counter =0, result=[];
		stream.on("data", function(item){
			//console.log("proccessing document..", item);
			if(processDocument){
				processDocument(null,item);
			}
				result[counter]=item;
				counter++;
			

		});
		stream.on("end", function() {
			console.log("fetched all data from db..stream empty..");
			if(callback){
			callback(null,result);
		}
		});
	}
});


	
	
}

exports.insertMany= function(collectionName, document,callback){
	//console.log("data to insert: ",document);

	if(!collectionName || !document){
		callback(new Error("collection name or document can't be null"));
	}else{
	mongoClient.connect(mongoURL,function(err,db){
	if(err){
		console.log("error while connecting to db: "+mongoURL,err);
	}else{

	db.collection(collectionName).insertMany(document,callback);
	}
});

}
}

exports.upsert= function(collectionName,criteria,document,callback){

		if(!collectionName ){
		callback(new Error("collection name can't be null"));
	}else{
	mongoClient.connect(mongoURL,function(err,db){
	if(err){
		console.log("error while connecting to db: "+mongoURL,err);
		
		callback(err);
	}else{

	db.collection(collectionName).update(criteria,document,{upsert:true},callback);
	}
});

}

}
exports.update= function(collectionName,selector,update,options,callback){

		if(!collectionName ){
		callback(new Error("collection name can't be null"));
	}else{
	mongoClient.connect(mongoURL,function(err,db){
	if(err){
		console.log("error while connecting to db: "+mongoURL,err);
		
		callback(err);
	}else{

	db.collection(collectionName).update(selector,{$set:update},options,callback);
	}
});

}

}
