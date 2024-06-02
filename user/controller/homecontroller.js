exports.homepage = (req, res) => {
  const token = req.cookies.jwt;
  //console.log(req.params['id']);

  if (token) {
    res.render("index", { cookie: "generated" });
  } else {
    res.render("index");
  }
};
