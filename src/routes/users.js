const router = require("express").Router();
const User = require("../models/Users");
const passport = require("passport");
const express = require("express");
const app = express();
app.use(express.json());

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

router.post(
  "/users/signin",
  passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/signin",
    failureFlash: true,
  })
);

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

const { body, validationResult } = require("express-validator");
router.post(
  "/users/signup",
  [
    body("name").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const { name, email, password, confirme_password } = req.body;
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newUser = new User({name, email, password});
    newUser.password = await newUser.encryptPassword(password)
    await newUser.save();
    req.flash("exito_not", "Se Registro Exitosamente");
    res.redirect("/users/signin");
  }
);

router.get("/users/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;