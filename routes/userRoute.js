const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ message: "Please enter all the details" });
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.json({ message: "User already exist with the given emailId" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new userModel({ name, email, password: hashPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User registered successfully",
        data: { id: user._id },
      });
  } catch (error) {
    return res.json({ error: error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "Please enter all the details" });
  }

  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return res.json({ message: "Please check the details entered" });
  }

  const isPasswordMatched = await bcrypt.compare(password, userExist.password);

  if (!isPasswordMatched) {
    return res.json({ message: "Please check the details entered" });
  }

  const token = await jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User loggedIn successfully",
    });
});

router.get("/all", isAuthenticated, async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users) {
      return res.json({ message: "No user found" });
    }
    const filteredDetails = users.map((user) => {
      return { id: user._id, name: user.name, email: user.email };
    });

    return res.json({ users: filteredDetails });
  } catch (error) {
    return res.json({ error: error });
  }
});

module.exports = router;
