const guest = {
  guest: (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
      return next();
    }

    return res.redirect("/");
  },
};

module.exports = guest;
