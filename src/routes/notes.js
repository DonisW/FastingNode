const { request } = require("express");
const router = require("express").Router();

const Note = require("../models/Notes");

router.get("/notes/add", (req,res) =>{
    res.render("notes/nw_note");
});

router.post("/notes/nw-note", async (req, res) => {
    const { title, Description } = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: "Please write a title"});
    }
    if(!Description) {
        errors.push({text: "Please write a description"});
    }
    if(errors.length > 0) {
        res.render("notes/nw_note", {
            errors,
            title,
            Description
        });
    }else {
        const newNote = new Note({ title, Description});
        await newNote.save();
        res.redirect("/notes");
    }
});

router.get("/notes", (req, res)=>{
    res.send("Notas desde la base de datos");
});

module.exports = router;