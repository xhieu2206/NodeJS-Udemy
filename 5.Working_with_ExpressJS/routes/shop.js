const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = require('./../util/path');

/* NOT DOING LIKE THAT ANYMORE
router.get('/', (req, res, next) => {
  res.send(`<h1>Hello from Express.js</h1>`)
});
 */

router.get('/', (req, res, next) => {
  /* Using rootDir for replacement
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
   */
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
