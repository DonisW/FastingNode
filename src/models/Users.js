const mongoose = require ("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const Userschema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: { type : Date, default: Date.now}
});

Userschema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

Userschema.methods.matchPassword = async function (password) {
 return await bcrypt.compare(password, this.password);  
};

module.exports = mongoose.model("User", Userschema);

/*
(no usar) "   1

Parece que está utilizando la sintaxis de Mongoose incorrecta para los métodos de esquema.

Schema.prototype.method() es una función, por lo que es necesario pasar un objeto de métodos o pasar cada uno individualmente con una cadena como clave.  "



Userschema.method({
  encryptPassword: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  },
  validPassword: function(password) {
    return bcrypt.compareSync(password, this.password);
  },
})

*/