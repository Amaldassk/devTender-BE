const mongoose = require("mongoose");

const connectDatabase = async () => {
    await mongoose.connect("mongodb+srv://namastenode_amal:OXiEJ26xNHpzkFgO@namastenodejs.v3kolas.mongodb.net/devTinder");
}

module.exports = connectDatabase;