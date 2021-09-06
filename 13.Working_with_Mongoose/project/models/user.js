const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId, // notice với mongoose là field này sẽ store ObjectId vì nó sẽ store một reference ở đây là một product
        ref: 'Product', // sử dụng tên của model mà chúng ta muốn có relationship with, ở đây là model Product
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }]
  }
});

/* methods giúp chúng ta định nghĩa method của riêng chúng ta  */
userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString(); // NOTICED HERE
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  this.cart = {
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
  return this.save();
}

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
}

module.exports = mongoose.model('User', userSchema);
