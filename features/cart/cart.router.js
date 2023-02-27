const express = require("express");
const Cart = require("./cart.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    try {
      let data = jwt.verify(token, process.env.SECRETKEY);
      if (data.id) {
        req.userId = data.id;
        next();
      }
    } catch (e) {
      res.status(500).send(e.message);
    }
  } else {
    res.status(500).send("Something went wrong");
  }
};

const app = express.Router();
app.use(authMiddleware);

app.get("/", async (req, res) => {
  let items = await Cart.find({ userId: req.userId });
  res.send(items);
});

app.post("/", async (req, res) => {
  try {
    let existingUserItem = await Cart.findOne({
      user: req.userId,
      product: req.body.productId,
    });
    if (existingUserItem) {
      let item = await Cart.findByIdAndUpdate(cartItem.id, {
        quantity: req.body.quantity,
      });
      return res.send(item);
    } else {
      let item = await Cart.create({
        ...req.body,
        user: req.userId,
      });
      res.send(item);
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = app;
