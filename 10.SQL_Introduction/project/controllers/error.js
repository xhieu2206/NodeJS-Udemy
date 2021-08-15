exports.get404 = (req, res, next) => {
  res.render('404', { pageTitle: 'Not Found Page', path: '/404' });
}
