exports.shopping_cart_page = (req, res) => {
  const cookie = req.cookies.jwt;
  res.render("shopping_cart", { cookie });
};

exports.updateCart = (req, res) => {
  // let cart = {
  //     items : {
  //         productid : { product : productObject, qty : 0}
  //     },
  //     totalqty : 0,
  //     totalprice : 0
  // }

  //for the first time creating cart and adding basic object structure.
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalqty: 0,
      totalprice: 0,
    };
  }

  let cart = req.session.cart;

  //check if item does exist or not in cart
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      items: req.body,
      qty: 1,
    };
    (cart.totalqty = cart.totalqty + 1),
      (cart.totalprice = cart.totalprice + req.body.MRP);
  } else {
    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
    cart.totalqty = cart.totalqty + 1;
    cart.totalprice = cart.totalprice + req.body.MRP;
  }

  res.json({ totalqty: req.session.cart.totalqty });
};
