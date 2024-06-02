const Admin = require("../models/admin");
const Order = require("../../user/models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_pending_order_list_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    Order.find({ status: "Order_Pending" }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        Admin.findById(adminId).exec((err, admin) => {
          if (err || !admin) {
            return res.status(400).json({
              error: "admin not found",
            });
          }

          res.render("admin_pending_order_list", { admin, data });
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_processing_order_list_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    if (order_id) {
      Order.findOneAndUpdate(
        { _id: order_id },
        {
          $set: {
            status: "Order_Packing",
          },
        },
        (err, doc) => {
          if (!err) {
            //  console.log("done!!!!");
          } else {
            console.log("Error during record update : " + err);
          }
        }
      );
    }

    Order.find({ status: "Order_Packing" }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        //console.log(data);

        Admin.findById(adminId).exec((err, admin) => {
          if (err || !admin) {
            return res.status(400).json({
              error: "admin not found",
            });
          }

          //console.log(data);

          res.render("admin_processing_order_list", { admin, data });
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_shipped_order_list_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    if (order_id) {
      Order.findOneAndUpdate(
        { _id: order_id },
        {
          $set: {
            status: "Order_Shipping",
          },
        },
        (err, doc) => {
          if (!err) {
            //  console.log("done!!!!");
          } else {
            console.log("Error during record update : " + err);
          }
        }
      );
    }

    Order.find({ status: "Order_Shipping" }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        //console.log(data);

        Admin.findById(adminId).exec((err, admin) => {
          if (err || !admin) {
            return res.status(400).json({
              error: "admin not found",
            });
          }

          //console.log(data);

          res.render("admin_shipped_order_list", { admin, data });
        });
      }
    });

    //getpage(req,res,"admin_shipped_order_list",cookie);
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_completed_order_list_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    if (order_id) {
      Order.findOneAndUpdate(
        { _id: order_id },
        {
          $set: {
            status: "Order_Delivered",
          },
        },
        (err, doc) => {
          if (!err) {
            // console.log("done!!!!");
          } else {
            console.log("Error during record update : " + err);
          }
        }
      );
    }

    Order.find({ status: "Order_Delivered" }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        //console.log(data);

        Admin.findById(adminId).exec((err, admin) => {
          if (err || !admin) {
            return res.status(400).json({
              error: "admin not found",
            });
          }

          //console.log(data);

          res.render("admin_completed_order_list", { admin, data });
        });
      }
    });
    //getpage(req,res,"admin_completed_order_list",cookie);
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_reject_order_list_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    if (order_id) {
      Order.findOneAndUpdate(
        { _id: order_id },
        {
          $set: {
            status: "Order_Rejected",
          },
        },
        (err, doc) => {
          if (!err) {
            // console.log("done!!!!");
          } else {
            console.log("Error during record update : " + err);
          }
        }
      );
    }

    Order.find({ status: "Order_Rejected" }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        //console.log(data);

        Admin.findById(adminId).exec((err, admin) => {
          if (err || !admin) {
            return res.status(400).json({
              error: "admin not found",
            });
          }

          //console.log(data);

          res.render("admin_reject_order_list", { admin, data });
        });
      }
    });
    //getpage(req,res,"admin_reject_order_list",cookie);
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_order_details_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;

  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;
    //console.log(order_id);

    //const orderinfo = await Order.find({});

    Order.find({ _id: order_id }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        //console.log(data);

        Admin.findById(adminId).exec((err, admin) => {
          if (err || !admin) {
            return res.status(400).json({
              error: "admin not found",
            });
          }

          //console.log(data);

          res.render("admin_order_details", { admin, data });
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};
