const path = require('path');

module.exports = path.dirname(process.mainModule.filename); // Trả về directorry name của path, cái này sẽ giúp refer đến app.js file, root file run the app, có thể hiểu như index file, entry point của app
