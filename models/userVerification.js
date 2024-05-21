const mongoose = require('mongoose');

//User Schema

const UserVerificationSchema = mongoose.Schema({
    
    userId:{
        type: String,
        required: true
    },
    uniqueString:{
        type: String,
        required: true
    },
    createdAt:{
        Date
        
    },

    expiresAt:{
        Date
        
    }
  
   
});



const  UserVerification = module.exports = mongoose.model('UserVerification', UserVerificationSchema);