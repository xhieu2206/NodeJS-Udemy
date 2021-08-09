const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const path = require('path');

const adminData = require('./routes/admin');
const shopRouters = require('./routes/shop');
const PORT = 4000;
const app = express();

/* Using Pug view engine
  app.set('view engine', 'pug');
 */

/* Using Handlebars view engine
  app.engine('handlebars', expressHbs({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout'
  }));
  app.set('view engine', 'handlebars')
 */
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // express sẽ take any request trued to find some file (static file), đây là những file mà chúng ta muốn được serverd một cách no permission, những public file, kiểu như những file styling trong folder public. Chúng ta có thể truy cập file css này từ "http://localhost:3000/css/main.css"

app.use('/admin', adminData.routes);
app.use(shopRouters);

app.use((req, res, next) => {
  /*
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
   */
  res.render('404', { pageTitle: 'Not Found Page', path: '/404' }); // same as all view engine
});
console.log(`Listening at port ${PORT}`);
app.listen(PORT);
