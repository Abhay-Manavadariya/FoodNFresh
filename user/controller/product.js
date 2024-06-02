const Product = require("../../admin/models/product");

exports.product = (req, res) => {
  const cookie = req.cookies.jwt;

  //console.log(req.query.category_name);

  const category_name = req.query.category_name;

  Product.find(
    { category: category_name, status: "active" },
    function (err, data) {
      res.render("product", { data, cookie, category_name });
    }
  );
};
