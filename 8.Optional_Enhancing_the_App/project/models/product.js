const products = [];
const fs = require('fs');
const path = require('path');
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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save(fn) {
    getProductsFromFile((products) => {
      const newProducts = [...products];
      console.log('new product: ', this);
      newProducts.push(this);
      fs.writeFile(p, JSON.stringify(newProducts), (err) => {
        console.log(err);
      });
      fn();
    });
  }

  static fetchAll(fn) {
    getProductsFromFile(fn);
  }
}
