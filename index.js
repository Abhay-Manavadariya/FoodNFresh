const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const sessionMiddleware = require("./middleware/session");
const flashMiddleware = require("./middleware/flash");
const momentMiddleware = require("./middleware/moment");
const routes = require("./routes/index");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Database connected....."))
  .catch((err) => console.log(err));

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(flashMiddleware);
app.use(momentMiddleware);

// Allow all origins
const corsConfig = {
  origin: "",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

// Global session middleware
app.use((req, res, next) => {
  // 'res.locals': This is an object that contains response local variables scoped to the request, and it is available only for the lifecycle of the request. It's useful for exposing data to your views/templates.

  // 'req.session': This represents the session object associated with the current request. Sessions allow you to store data across requests, typically using cookies to identify the client.

  // 'res.locals.session = req.session': This line assigns the req.session object to res.locals.session, making the session data accessible in your views/templates.

  // next() : This callback function is used to pass control to the next middleware function in the stack. If omitted, the request will be left hanging, and the response will not be sent.
  res.locals.session = req.session;
  next();
});

// Routes
app.use(routes);

// Static file serving
app.use("/", express.static(path.join(__dirname, "./user/public")));
app.use("/admin", express.static(path.join(__dirname, "./admin/public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "./user/views"),
  path.join(__dirname, "./admin/views/"),
]);

app.listen(port, () => {
  console.log(`service is running at port no ${port}`);
});
