const session = require("express-session");

module.exports = session({
  secret: process.env.COOKIE_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // cookie valid for 7 days
});
