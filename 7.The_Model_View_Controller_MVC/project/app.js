const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRouters = require('./routes/shop');
const errorController = require('./controllers/error');
const PORT = 4000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRouters);
app.use('/admin', adminRoutes);

app.use(errorController.get404);
console.log(`Listening at port ${PORT}`);
app.listen(PORT);
