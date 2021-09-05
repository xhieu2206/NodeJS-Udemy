const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});
/* model là một function để connect schema, hay nói cách khác là blueprint vss một tên gọi mà chúng ta sẽ sử dụng */
module.exports = mongoose.model('Product', productSchema);
