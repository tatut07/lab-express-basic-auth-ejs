const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.redirect("login");
  } catch (error) {
    res.render("signup", error);
  }
});

module.exports = router;
