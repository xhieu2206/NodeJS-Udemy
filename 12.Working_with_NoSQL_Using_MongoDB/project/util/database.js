const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db; // the under_score để cho biết rằng biến này sẽ chỉ được dùng ở trong file này thôi

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://xhieu2206:XNZEtGgJ$v6V7n2@nodejs-course.h1piu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(client => {
      console.log('Connected');
      _db = client.db()
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database Found!!!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
