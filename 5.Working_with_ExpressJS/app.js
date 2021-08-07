const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRouters = require('./routes/admin');
const shopRouters = require('./routes/shop');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // express sẽ take any request trued to find some file (static file), đây là những file mà chúng ta muốn được serverd một cách no permission, những public file, kiểu như những file styling trong folder public. Chúng ta có thể truy cập file css này từ "http://localhost:3000/css/main.css"

app.use('/admin', adminRouters);
app.use(shopRouters);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
