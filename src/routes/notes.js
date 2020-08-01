const { request } = require("express");
const router = require("express").Router();

const Note = require("../models/Notes");
const { collection, find, findById } = require("../models/Notes");

router.get("/notes/add", (req,res) =>{
    res.render("notes/nw_note");
});

router.post("/notes/nw-note", async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: "Falta un Titulo"});
    }
    if(!description) {
        errors.push({text: "Falta la Descripcion"});
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
   const notes = await Note.find().sort({date: "desc"});
   res.render("notes/all_notes", { notes });
});

router.get("/notes/edit/:id", async(req, res) =>{
    const note = await Note.findById(req.params.id)
    res.render("notes/edit_notes", {note})
});

router.put("/notes/edit_notes/:id", async(req, res) =>{
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title,description});
    res.redirect("/notes")
});

router.delete("/notes/delete/:id", async(req, res) =>{
    await Note.findByIdAndDelete(req.params.id);
    res.redirect("/notes")
});

module.exports = router;