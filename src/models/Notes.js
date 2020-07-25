const mongoose = require ("mongoose");
const { Schema } = mongoose;

const Noteschema = new Schema ({
    title: { type: String, required: true},
    Description: { type: String, required: true},
    date: { type : Date, default: Date.now}
});

module.exports = mongoose.model("Note", Noteschema);