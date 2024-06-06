const User = require("../models/user");
const jwt = require("jsonwebtoken");
let State = require("country-state-city").State;
const state = State.getStatesOfCountry("IN");

exports.checkout = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.render("checkout", { user, cookie: "generated", state });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
