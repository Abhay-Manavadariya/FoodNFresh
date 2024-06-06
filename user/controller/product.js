const Product = require("../../admin/models/product");

exports.product = async (req, res) => {
  try {
    const cookie = req.cookies.jwt;
    const category_name = req.query.category_name;

    const data = await Product.find({
      category: category_name,
      status: "active",
    }).exec();

    res.render("product", { data, cookie, category_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
