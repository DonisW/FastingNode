const passPort = require("passport");
const LocaStrategy = require("passport-local").Strategy;

const User = require("../models/Users");
const passport = require("passport");

passPort.use(new LocaStrategy ({
    usernameField: "email"
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user) {
        return done(null, false, {message: "El usuario no existe"}); 
    } else {
       const match = await user.matchPassword(password)
       if(match) {
           return done (null, user)
       } else {
           return done(null, false, {message: "Contraseña Incorrecta"});
       }
    }
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) =>{
        done(err, user);
    });
})