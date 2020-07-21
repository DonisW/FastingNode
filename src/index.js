const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverrider = require("method-override");
const session = require("express-session");

//initializations

const app = express();
require("./database");
//settings

app.set("port", process.env.port || 3000 );

app.set("views", path.join(__dirname,"views"));

app.engine(".hbs",exphbs({
  defaultLayout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"),"partials"),
  extname: ".hbs"
}));
app.set("views engine", ".hbs");

//middlewares

app.use(express.urlencoded({extended: false}));
app.use(methodOverrider("_method"));
app.use(session({
  secret: "secretapp",
  resave: true,
  saveUninitialized: true
}));

//global variables

//routes

app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

// static files

app.use(express.static(path.join(__dirname, "public")));

//sever is listennig

app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
} );