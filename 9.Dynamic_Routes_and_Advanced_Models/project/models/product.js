const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = fn => {
  fs.readFile(p, (err, fileContent) => {
    if (!err) {
      fn(JSON.parse(fileContent));
    } else {
      fn([]);
    }
  });
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save(fn) {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
        fn();
      } else {
        const newProducts = [...products];
        this.id = Math.random().toString();
        newProducts.push(this);
        fs.writeFile(p, JSON.stringify(newProducts), (err) => {
          if (err) {
            console.log(err);
          } else {
            fn();
          }
        });
      }
    });
  }

  static fetchAll(fn) {
    getProductsFromFile(fn);
  }

  static findById(id, fn) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id.toString());
      fn(product);
    });
  }

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      console.log(`CLOG deleteById "product": `, product);
      const newProducts = products.filter(p => p.id !== id);
      fs.writeFile(p, JSON.stringify(newProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        } else {
          console.log(err);
        }
      });
    });
  }
}
