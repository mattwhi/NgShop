const { User } = require("../models/users");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

//Get all users
router.get(`/`, async (req, res) => {
  let user = await User.find().select("-passwordHash");

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

//Get Users by ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res
      .status(500)
      .json({ message: "the user with the given ID was not found" });
  }
  res.status(200).send(user);
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments({});

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });

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

//Create new user
router.post(`/register`, async (req, res) => {
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

//Create new user
router.post(`/login`, async (req, res) => {
  const user = await User.findOne({email: req.body.email})
  const secret = process.env.JWTSecret;
  if(!user) {
    return res.status(400).send('The user was not found');
  }

  if(user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      },
      secret, 
      {expiresIn: '1d'}
    )
    res.status(200).send({user: user.email, token: token})
  } else {
    res.status(400).send('Incorrect Password');
  }

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
  const userExists = await User.findById(req.params.id);
  let newPassword
  if (req.body.passwordHash) {
    newPassword = bcrypt.hashSync(req.body.passwordHash);
  } else {
    newPassword = userExists.passwordHash;
  }

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
