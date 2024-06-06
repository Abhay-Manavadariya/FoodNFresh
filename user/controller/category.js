const category = require("../../admin/models/category");

exports.category = async (req, res) => {
  try {
    const cookie = req.cookies.jwt;

    const data = await category.find({ status: "active" }).exec();

    res.render("category", { data, cookie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
