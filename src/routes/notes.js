const router = require("express").Router();

router.get("/notes", (req, res)=>{
    res.send("Notas desde la base de datos");
});

module.exports = router;