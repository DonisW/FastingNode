const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverrider = require("method-override");
const session = require("express-session");
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { body } = require("express-validator");

//initializations
const app = express();
require("./database");
require("./config/passport");
//settings

app.set("port", process.env.port || 3001 );

app.set("views", path.join(__dirname,"views"));

app.engine(".hbs",exphbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main" ,
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"),"partials"),
  extname: ".hbs"
}));
app.set("view engine", ".hbs" );

//middlewares

app.use(express.urlencoded({extended: false}));
app.use(methodOverrider("_method"));
app.use(session({
  secret: "secretapp",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//global variables
app.use((req, res, next) =>{
res.locals.exito_not= req.flash("exito_not");
res.locals.error_not= req.flash("error_not");
res.locals.error= req.flash("error");
res.locals.user= req.user || null;
  next();
});

//routes

app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

// static files

app.use(express.static(path.join(__dirname, "public")));

//sever is listennig

app.listen(app.get("port"), () => {
    console.log(`server on port http://localhost:3001`, app.get("port"));
} );
