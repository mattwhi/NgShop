const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");

//Get all products
router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

//Get products by ID
//.populate returns the details of category
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

//Update product by ID
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("invalid product");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      countInStock: req.body.countInStock,
      images: req.body.images,
      dateCreated: req.body.dateCreated,
      richDescription: req.body.richDescription,
    },
    { new: true }
  );
  if (!product) {
    res
      .status(500)
      .json({ message: "the category with the given ID was not found" });
  }
  res.status(200).send(product);
});

//Create new product
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");

  let product = await new Product({
    name: req.body.name,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
    countInStock: req.body.countInStock,
    images: req.body.images,
    dateCreated: req.body.dateCreated,
    richDescription: req.body.richDescription,
    category: req.body.category,
    description: req.body.description,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

//Delete Product
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The product was not found." });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments({});

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

module.exports = router;
