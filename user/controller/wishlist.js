exports.wishlist_page = (req, res) => {
  const cookie = req.cookies.jwt;

  if (cookie) {
    res.render("wishlist", { cookie });
  } else {
    res.redirect("/login");
  }
};
