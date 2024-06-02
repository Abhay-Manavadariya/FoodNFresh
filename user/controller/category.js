const category = require("../../admin/models/category");

exports.category = (req, res) => {
  const cookie = req.cookies.jwt;

  category.find({ status: "active" }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("category", { data, cookie });
    }
  });
};
