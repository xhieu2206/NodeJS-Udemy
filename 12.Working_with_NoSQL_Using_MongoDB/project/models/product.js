const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // update the product
      dbOp = db.collection('products').updateOne({ _id: this._id }, {
        $set: this
      })
    } else {
      dbOp = db.collection('products').insert(this);
    }
    return dbOp.then(result => {
        console.log(result)
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      })
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products')
      .find({
        _id: new mongodb.ObjectId(prodId)
      }) // find sẽ vẫn trả ra một array, do đó chúng ta sẽ chain thêm `next()` để return last document được returned ở đây
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err)
      })
  }

  static deletebyId(prodId) {
    const db = getDb();
    return db.collection('products')
      .deleteOne({
        _id: new mongodb.ObjectId((prodId))
      })
      .then(() => {
        console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      })
  }
}

module.exports = Product;
