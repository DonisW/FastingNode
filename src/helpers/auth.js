const helpers = {};

helpers.isAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error_not", "Ingresa tu usuario");
    res.redirect("/users/signin");
}

module.exports = helpers