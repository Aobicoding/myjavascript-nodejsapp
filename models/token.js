const path = require('path');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const tokenSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref:"user",
        unique:true,
        

    },
    token: { type: String, required:true },
    
});


const  Token = module.exports = mongoose.model('token', tokenSchema);