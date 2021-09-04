const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items: [] }
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const db = getDb();
    // const cartProduct = this.cart.items.findIndex(cp => {
    //   return cp._id === product._id;
    // });
    const updatedCart = {
      items: [{
        ...product,
        quantity: 1
      }]
    }
    return db.collection('users')
      .updateOne({
        _id: new mongodb.ObjectId(this._id)
      }, {
        $set: {
          cart: updatedCart
        }
      });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({ // sử dụng findOne, không cần dùng `next()` nữa
        _id: new mongodb.ObjectId(userId)
      })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = User;
