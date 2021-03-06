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
  constructor(title) {
    this.title = title;
  }

  save(fn) {
    getProductsFromFile((products) => {
      console.log(`this: ${this.title}`);
      const newProducts = [...products];
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
