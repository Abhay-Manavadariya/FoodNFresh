const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const session = require("express-session");
const flash = require("connect-flash");

const port = process.env.PORT || 8000;

//database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("conected....."))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const moment = require("moment");

app.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours valid rese cookie.
  })
);
app.use(flash());

//global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use("/", express.static(path.join(__dirname, "./user/public")));
app.use("/admin", express.static(path.join(__dirname, "./admin/public")));

//middleware
app.use("/", require("./user/route/router"));
app.use("/admin", require("./admin/route/admin_router"));
app.use("/admin", require("./admin/route/admin_router_auth"));

app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "./user/views"),
  path.join(__dirname, "./admin/views/"),
]);

app.listen(port, () => {
  console.log(`service is running at port no ${port}`);
});
