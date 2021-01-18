const router = require("express").Router();
const User = require("../models/Users");
const passport = require("passport");
const express = require("express");
const app = express();
// para el manejo de datos en la recepción (es decir, manejar más fácil los datos de POST a nuestro servidor)//
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

router.post("/users/signup", async(req, res) => {
  const { name, email, password, confirme_password } = req.body;
  const errors = [];
  if (name.length <= 0) {
      errors.push({ text: "Indicar nombre" });
  }
  if (email.length <= 0) {
      errors.push({ text: "Indicar email" })
  }
  if (password.length <= 0) {
      errors.push({ text: "Indicar Contraseña" })
  }
  if (password != confirme_password) {
      errors.push({ text: "La contraseña no coinciden" });
  }
  if (password.length <= 4) {
      errors.push({ text: "La contraseña debe ser mayor a 4 digitos" });
  }
  if (errors.length > 0) {
      res.render("users/signup", { errors, name, email, password, confirme_password });
  } else {
      const nameUser = await User.findOne({name: name});
      const emailUser = await User.findOne({email: email});
      if(emailUser){
          errors.push({text: "El email se encuentra en uso"})
          res.render("users/signup", { errors, name, email, password, confirme_password });
        }
        if(nameUser){
          errors.push({text: "El nombre de usuario esta siendo utilizado."});
          res.render("users/signup", { errors, name, email, password, confirme_password});
        }else{
          const newUser = new User({name, email, password});
          newUser.password = await newUser.encryptPassword(password)
          await newUser.save();
          req.flash("exito_not", "Se Registro Exitosamente");
          res.redirect("/users/signin");
      }
      
  }
})
router.get("/users/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;