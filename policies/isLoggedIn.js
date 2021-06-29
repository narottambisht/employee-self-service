isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    console.log('user is logged in');
    next();
  } else {
    console.log('user is not logged in');
    req.flash('notLoggedIn', 'You are currently not logged in.');
    res.redirect('/login');
  }
}

module.exports = isLoggedIn;