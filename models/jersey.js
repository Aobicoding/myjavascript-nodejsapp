let mongoose = require('mongoose');

let jerseyShcema = mongoose.Schema({

    

    Name:{
        type: String,
        required: true,
    },
    Number:{
        type: String,
        required: true
    },
    Size:{
        type: String,
        required:true
    },
    Authur:{
        type: String,
        required:true
    }


    
},{ jerseys: 'jerseySchema',
    versionKey: false,

    

});



let Jersey = module.exports = mongoose.model('Jersey', jerseyShcema);