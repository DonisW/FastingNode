const { request } = require("express");
const router = require("express").Router();

const Note = require("../models/Notes");
const { collection } = require("../models/Notes");

router.get("/notes/add", (req,res) =>{
    res.render("notes/nw_note");
});

router.post("/notes/nw-note", async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: "Please write a title"});
    }
    if(!description) {
        errors.push({text: "Please write a description"});
    }
    if(errors.length > 0) {
        res.render("notes/nw_note", {
            errors,
            title,
            description
        });
    }else {
        const newNote = new Note({ title, description});
        await newNote.save();
        res.redirect("/notes");
    }
});

router.get("/notes", async (req, res)=>{
   const notes = await Note.find();
   res.render("notes/all_notes", { notes });
});

module.exports = router;