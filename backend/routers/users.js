const { User } = require("../models/users");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Get all users
router.get(`/`, async (req, res) => {
  let user = await User.find();

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

//Get Users by ID
router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id, {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    if (!user) {
      res
        .status(500)
        .json({ message: "the user with the given ID was not found" });
    }
    res.status(200).send(user);
  });
  

//Create new user
router.post(`/`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    postCode: req.body.postCode,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(404).send("the users cannot be created!");

  res.send(user);
});

//Delete User
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "The user was not found." });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//Update categories
router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.passwordHash,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      postCode: req.body.postCode,
      country: req.body.country,
    },
    { new: true }
  );
  if (!user) {
    res
      .status(500)
      .json({ message: "the user with the given ID was not found" });
  }
  res.status(200).send(user);
});
module.exports = router;
