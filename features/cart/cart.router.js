const express = require("express");
const Cart = require("./cart.model");
const Products = require("../products/products.model");
const jwt = require("jsonwebtoken");

// const authMiddleware = async (req, res, next) => {
//   let token = req.headers.token;
//   if (token) {
//     try {
//       let data = jwt.verify(token, process.env.SECRETKEY);
//       if (data.id) {
//         req.userId = data.id;
//         next();
//       }
//     } catch (e) {
//       res.status(500).send(e.message);
//     }
//   } else {
//     res.status(500).send("Something went wrong");
//   }
// };

const app = express.Router();
// app.use(authMiddleware);

app.get("/", async (req, res) => {
  let token = req.headers.token;
  if (token) {
    try {
      let data = jwt.verify(token, process.env.SECRETKEY);
      if (data.id) {
        let items = await Cart.find({ userId: data.id });
        let cartitems = [];
        for (var i = 0; i < items.length; i++) {
          cartitems.push({
            product: await Products.findById(items[i].product),
            quantity: items[i].quantity,
          });
        }
        res.send(cartitems);
      }
    } catch (e) {
      res.status(500).send(e.message);
    }
  } else {
    res.status(500).send("Something went wrong");
  }
});

app.post("/", async (req, res) => {
  let token = req.headers.token;
  if (token) {
    try {
      let data = jwt.verify(token, process.env.SECRETKEY);
      if (data.id) {
        let existingUserItem = await Cart.findOne({
          user: data.id,
          product: req.body.product,
        });
        if (existingUserItem) {
          let item = await Cart.findByIdAndUpdate(existingUserItem._id, {
            quantity: req.body.quantity,
          });
          return res.send("Product Updated");
        } else {
          let item = await Cart.create({
            ...req.body,
            user: data.id,
          });
          res.send(item);
        }
      }
    } catch (e) {
      res.status(500).send(e.message);
    }
  } else {
    res.status(500).send("Something went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  let token = req.headers.token;
  if (token) {
    try {
      let data = jwt.verify(token, process.env.SECRETKEY);
      if (data.id) {
        let existingProduct = await Cart.findOneAndDelete({
          user: data.id,
          product: req.body.product,
        });
        res.send("Product removed sucessfully");
      }
    } catch (e) {
      res.status(500).send(e.message);
    }
  } else {
    res.status(500).send("Something went wrong");
  }
});

module.exports = app;
