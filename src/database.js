const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/app-notes-db",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false
})
    .then(db => console.log("DB conectada"))
    .catch(err => console.error(err));