const express = require("express");

//initializations

const app = express();


//settings

app.set("port", process.env.port || 3000 );

//minddlewares

//global variables

//routes

// static files

//sever is listennig

app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
} );