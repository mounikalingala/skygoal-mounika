const mongoose = require("mongoose")

let RegisterUser = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    confirmPassword: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model("RegisterUser", RegisterUser)