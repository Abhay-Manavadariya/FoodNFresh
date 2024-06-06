exports.homePage = (req, res) => {
  try {
    // Check if a JWT token exists in cookies
    const token = req.cookies.jwt;

    // Render the "index" view with or without the "cookie" variable based on token existence
    if (token) {
      res.render("index", { cookie: "generated" });
    } else {
      res.render("index");
    }
  } catch (error) {
    // Handle any errors that may occur during rendering or cookie retrieval
    console.error("Error in homepage:", error);
    res.status(500).send("Internal Server Error");
  }
};
