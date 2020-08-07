const { request } = require("express");
const router = require("express").Router();

const Note = require("../models/Notes");
const { collection, find, findById } = require("../models/Notes");
const {isAuthenticated} = require("../helpers/auth")

router.get("/notes/add", isAuthenticated, (req,res) =>{
    res.render("notes/nw_note");
});

router.post("/notes/nw-note", isAuthenticated, async (req, res) => {
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
        newNote.user = req.user.id;
        await newNote.save();
        req.flash("exito_not", "Guardada exitosamente");
        res.redirect("/notes");
    }
});

router.get("/notes", isAuthenticated, async (req, res)=>{
   const notes = await Note.find({user: req.user.id}).sort({date: "desc"});
   res.render("notes/all_notes", { notes });
});

router.get("/notes/edit/:id", isAuthenticated, async(req, res) =>{
    const note = await Note.findById(req.params.id)
    res.render("notes/edit_notes", {note})
});

router.put("/notes/edit_notes/:id", isAuthenticated, async(req, res) =>{
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title,description});
    req.flash("exito_not", "Editada exitosamente");
    res.redirect("/notes")
});

router.delete("/notes/delete/:id", isAuthenticated, async(req, res) =>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash("exito_not", "Eliminada exitosamente");
    res.redirect("/notes")
});

module.exports = router;