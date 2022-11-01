const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup", { isConnected: false });
});

router.post("/signup", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (error) {
    res.render("signup", { errorMessage: error.message, isConnected: false });
  }
});

router.get("/login", (req, res) => {
  res.render("login", { isConnected: false });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const currentUser = await User.findOne({ username });
  if (!currentUser) {
    res.render("login", {
      errorMessage: "No user with this username",
      isConnected: false,
    });
  } else {
    if (bcrypt.compareSync(password, currentUser.password)) {
      console.log("Correct password");
      req.session.user = currentUser;
      res.redirect("/profile");
    } else {
      res.render("login", {
        errorMessage: "Incorrect password !!!",
        isConnected: false,
      });
    }
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  console.log("SESSION =====> ", req.session);
  res.render("profile", { user: req.session.user, isConnected: true });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect("login");
  });
});

module.exports = router;
