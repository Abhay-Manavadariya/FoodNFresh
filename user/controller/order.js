const Order = require("../models/order");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.order = async (req, res) => {
  // console.log(req.body.totalprice);

  //   const x = req.session.cart.items;

  //     for (var key in x){
  //         console.log( key + ": " + x[key].items);
  //     }

  const order = await new Order({
    name: req.body.fullname,
    address: req.body.address,
    city: req.body.cityname,
    state: req.body.states,
    coutry: req.body.country,
    zipcode: req.body.zipcode,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    items: req.session.cart.items,
    totalprice: req.body.totalprice,
    qty: req.session.cart.totalqty,
  });

  await order
    .save()
    .then((result) => {
      req.flash("success", "Order Request Sent Successfully.");

      delete req.session.cart;

      res.redirect("/order_history");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", "Order Does not Placed Successfully");
      res.redirect("/checkout");
    });
};

exports.order_details_page = async (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    const order_id = req.query.order_id;

    const data = await Order.find({ _id: order_id });
    //console.log(data);
    res.render("order_details", { cookie: "generated", data });
  } else {
    res.redirect("/login");
  }
};

exports.order_history_page = (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    const success = req.flash("success");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    User.findById(userId).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user not found",
        });
      }
      //console.log(user);

      const x = user.email;

      Order.find({ email: x }, function (err, orderlist) {
        // console.log(orderlist);
        res.render("order_history", {
          cookie: "generated",
          orderlist,
          success,
        });
      });
    });
  } else {
    res.redirect("/login");
  }
};
