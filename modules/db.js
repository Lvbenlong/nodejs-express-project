const MongoClient =  require('mongodb').MongoClient
const DataUrl = 'mongodb://127.0.0.1:27017'
var ObjectID = require('mongodb').ObjectID;

// 数据库中的id格式和我们表单中的id格式不用，这里做处理
exports.ObjectID=ObjectID;

function __connect(callback) {
  MongoClient.connect(DataUrl, function(err, database) {
    if (err) {
      console.log('error...')
      return
    }
    // var odb = database.db('productmanage')
    callback(database)
  })
}


exports.find = function(collectionName, json, callback){
  __connect(function(database){
    var db = database.db('productmanage')
    const result = db.collection(collectionName).find(json)
    result.toArray((err, data) => {
      database.close()
      callback(err, data)
    })
  })
}


exports.insert = function(collectionName, json, callback){
  __connect(function(database){
    var db = database.db('productmanage')
    db.collection(collectionName).insertOne(json, (err, data) => {
      database.close()
      callback(err, data)
    })
  })
}

exports.update = function(collectionName, json1, json2, callback){
  __connect(function(database){
    var db = database.db('productmanage')
    db.collection(collectionName).updateOne(json1, {$set: json2}, (err, data) => {
      database.close()
      callback(err, data)
    })
  })
}

exports.deleteOne = function(collectionName,  json, callback){
  __connect(function(database){
    var db = database.db('productmanage')
    db.collection(collectionName).deleteOne(json, (err, data) => {
      database.close()
      callback(err, data)
    })
  })
}



