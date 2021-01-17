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

    body("password").isLength({ min: 5 }),
    body("confirme_password").custom((value, {req}) =>{
      if(value !== req.body.password) {
        throw new Error("La confirmación de la contraseña no coincide con la contraseña");
      }
      return true;
    }),
    body("email").isEmail().custom(email =>{
      return User.findOne({email : email}).then(users =>{
        if(users) {
          return Promise.reject("Correo electrónico se encuentra en uso");
        }
      })
    })
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