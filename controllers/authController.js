const User = require("../models/user");
// const Role = require('../models/admin');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokengen = require("../middleware/authMiddleware");
const Key = require("../models/randomkey");
// const express = require('express')
// const app = express()
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());

var role1;
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username exists using the User model
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    // const hashedPassword2 = await bcrypt.hash("admin123", 10);
    // let adminemail = "admin@123.com";
    // if (email === adminemail) {
    //   // const user = await User.findOne({ email });
    //   const isMatch = await bcrypt.compare(hashedPassword2, hashedPassword);
    //   if (isMatch) {
    //     role1 = "Admin";
    //   }
    //   //  role1='User'
    // } else {
    //   role1 = "User";
    // }
    //  const isadminRole = await Role.findOne({ name: role1 });

    // Create a new user using the User model
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role1,
    });
    await user.save();
    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        role: user.role,
        user: user._id,
      },
      "Hs235",
      {
        expiresIn: "10h",
      }
    );

    // Generate a JWT token
    // tokengen()

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating user: ${err}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by username using the User model
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare hashed password with provided password using bcrypt
    // const adminPipeline = [
    //   { $match: { email: 'admin@123.com', password :'admin123' } }
    // ];
    // const admin = await User.aggregate(adminPipeline);

    // role1=checkAdmin(email,password)
    console.log("firstdgdf,", user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("first,", user.role);
    if (user.role !== "Admin") {
      return res.status(401).json({ message: "Admin can Only access" });
    }
    // Generate a JWT token
    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        role: user.role,
        user: user._id,
      },
      "Hs235",
      {
        expiresIn: "12h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
};
exports.handleAdmin = async (req, res) => {
  try {
    const admins = await User.find().populate("role");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.userHandle = async (req, res) => {
  try {
    const { firstname, lastname, userEmail, userkey } = req.body;
    // let existKey;
    console.log("gfhfg", userkey);

    const existKey = await Key.findOne({ key: userkey });
    if (!existKey) {
      return res.status(500).json("Invalid key!");
    }
    const currentDate = new Date();
    const formattedDate = formatDatew(currentDate);
    if (
      existKey.Starttime > formattedDate &&
      existKey.Endtime < formattedDate
    ) {
      res.status(404).json("Exam Has NOt started");
    }
    console.log("gfhffgdfg", existKey);
    const token = jwt.sign(
      {
        firstname: firstname,
        lastname: lastname,
        userEmail: userEmail,
        key: existKey,
      },
      "Hs235",
      {
        expiresIn: "12h",
      }
    );

    // Find user by username using the User model

    // Generate a JWT token

    res.status(201).json({
      message: "Login successful",
      token,
      firstname,
      lastname,
      userEmail,
      existKey,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
};
exports.userauth = async (req, res) => {
  try {
    // const admins = await User.find().populate('role');
    res.status(201).json({ message: "helloo user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  // Get the current date and time
};
const formatDatew = (date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
