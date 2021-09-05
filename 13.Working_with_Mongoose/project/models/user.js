// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
//
// class User {
//   constructor(name, email, cart, id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart; // { items: [] }
//     this._id = id;
//   }
//
//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }
//
//   addToCart(product) {
//     const db = getDb();
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString(); // NOTICED HERE
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     }
//     return db.collection('users')
//       .updateOne({
//         _id: new mongodb.ObjectId(this._id)
//       }, {
//         $set: {
//           cart: updatedCart
//         }
//       });
//   }
//
//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     })
//     return db.collection('products').find({
//       _id: {
//         $in: productIds,
//       }
//     }).toArray()
//       .then(products => {
//         return products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           }
//         })
//       })
//       .catch(err => console.log(err));
//   }
//
//   deleteItemFromCart(productId) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });
//     return db.collection('users')
//       .updateOne({
//         _id: new mongodb.ObjectId(this._id)
//       }, {
//         $set: {
//           cart: {
//             items: updatedCartItems,
//           }
//         }
//       });
//   }
//
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//           }
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = {
//           items: [],
//         };
//         return db.collection('users').updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         )
//       })
//       .catch(err => console.log(err));
//   }
//
//   getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({
//       'user._id': new mongodb.ObjectId(this._id)
//     }).toArray()
//
//   }
//
//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users')
//       .findOne({ // sử dụng findOne, không cần dùng `next()` nữa
//         _id: new mongodb.ObjectId(userId)
//       })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }
//
// module.exports = User;