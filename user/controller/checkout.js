const User = require("../models/user");
const jwt = require("jsonwebtoken");
let State = require("country-state-city").State;
const state = State.getStatesOfCountry("IN");

exports.checkout = (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.redirect("/login");
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    User.findById(userId).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user not found",
        });
      }
      //console.log(user);
      res.render("checkout", { user, cookie: "generated", state });
    });
  }
};
