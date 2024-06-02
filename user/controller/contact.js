exports.contact = (req, res) => {
  const cookie = req.cookies.jwt;
  res.render("contact", { cookie });
};
