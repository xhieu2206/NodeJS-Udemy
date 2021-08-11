const products = [];
const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = cb => {
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
      [...products].push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
      fn();
    });
  }

  static fetchAll(fn) {
    getProductsFromFile(cb);
  }
}
