const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "../public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//Get all products
router.get(`/`, async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category");

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
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("invalid product");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");

  const product = await Product.findById(req.body.product);
  if (!product) return res.status(400).send("invalid product");

  const file = req.file;
  let imagepath;

  if(file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    imagepath = `${basePath}${fileName}`
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: imagepath,
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
  if (!updatedProduct) {
    res
      .status(500)
      .json({ message: "the category with the given ID was not found" });
  }
  res.status(200).send(updatedProduct);
});

//Create new product
router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("invalid category");
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
  let product = await new Product({
    name: req.body.name,
    image: `${basePath}${fileName}`,
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
    numReviews: req.body.numReviews,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

//Update product by ID
router.put(
  "gallery-images:id",
  uploadOptions.array("image", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send("invalid product");
    }
    const files = req.files;
    let imagePaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/upload/`;
    if (files) {
      files.map((file) => imagePaths.push(`${basePath}${file.fileName}`));
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        image: imagePaths,
      },
      { new: true }
    );
    if (!product) return res.status(500).send("The product cannot be created");

    res.send(product);
  }
);

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

//Featured Products
router.get(`/get/featured:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
