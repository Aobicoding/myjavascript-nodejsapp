const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const config = require('./config/database');
const utils = require("./utils/sendEmail");
const crypto = require("crypto");
const cors = require('cors');
//const bodyParser = require('body-parser');




//mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2/');
 
mongoose.connect(config.database);
let db = mongoose.connection;

// check connection
db.once('open', function() {
    console.log('connected to mongodb');
});

// check for errors
db.on('error', function(err){
console.log(err);
});


// Init App
const app = express();



// Bring in Models
let  Jersey = require('.//models/jersey');
let  User =  require('.//models/user');
let UserVerification = require('.//models/userVerification');
const bodyParser = require('body-parser');
const { title } = require('process');
const jersey = require('.//models/jersey');
let  user =  require('.//models/user');
let token = require(".//models/token.js"); 
let Token = require(".//models/token.js"); 



// Email Handler
const nodemailer = require('nodemailer');
// Unique string
const  {v4: uuidv4} = require('uuid');
//env variables
require('dotenv').config();



// Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
  
// from here

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());


//from here

//body parser application middleware
app.use(bodyParser.urlencoded({ extended: false }))
//parser application(json)
app.use(bodyParser.json())

//use static folder
app.use(express.static(path.join(__dirname, 'public')));

  


//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator middleware

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
        
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';

        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
        
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport middleware
 app.use(passport.initialize());
  app.use(passport.session());


  app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
  });

// The home route
app.get('/',  function(req, res) {
 Jersey.find({}, {id:0}, {}, function(err, jerseys){
        
        if(err){
        console.log(err);

    }else{

        res.render('index', {
            title:'Jerseys',
           jerseys: jerseys
               
               });
    };
            })
});
    
   

//Get single jersey
app.get('/jersey/:id',  function(req, res) {
    Jersey.findById(req.params.id, function(err, jersey){
        User.findById(jersey.Authur, function(err, user){

            res.render('jersey', {
                jersey:jersey,
                Authur:user.id
                 
            });
    
        })
        
    });
});
// Add Jearsey info route
 app.get('/add/jersey', ensureAuthentificated, function(req, res){
     res.render('add_jersey', {
          title: 'Choose Jersey Info'
     
       
    });
 });

 //add Post Route
 app.post('/jersey/add', function(req, res){
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('number', 'Number is required').notEmpty();
    req.checkBody('size', 'Size is required').notEmpty();

    

    // Get Errors
    let errors = req.validationErrors();
    
    if(errors){
        res.render('/add_jersey', {
            errors:errors
        });
    } else{

    
    let jersey = new Jersey();
    jersey.Name = req.body.name;
    jersey.Number = req.body.number;
    jersey.Size = req.body.size;
    jersey.Authur = req.user._id;
    
    

    jersey.save(function(err){
        if(err){
        console.log(err);
        return;
    }else{
        req.flash('success', 'Jersey Info Added');
      res.redirect('/');
    }
    })
    }

 
    });
 

 //edit jersey info
app.get('/jersey/edit/:id', ensureAuthentificated, function(req, res) {
    Jersey.findById(req.params.id, function(err, jersey){
        res.render('edit_jersey', {
         title: 'Update Info',       

            jersey:jersey
        });

    });
});

//Update Info Route
app.post('/jersey/edit/:id', ensureAuthentificated,  function(req, res){
    let jersey = {};
    jersey.Name = req.user._id;
    jersey.Number = req.body.number;
    jersey.Size = req.body.size;

    let query = {_id:req.params.id}

    Jersey.update( query, jersey, function(err){
        if(err){
        console.log(err);
        return;
    }else{
      res.redirect('/');
    }
    })
 });

 //Delete Jersey Info 
 app.delete('/jersey/:id', function(req, res){
     let query = {_id:req.params.id}

     Jersey.remove(query, function(err){
        
        if(err){
            console.log(err);
        }
        
        res.send('success');
     })
 });


 // Register Form
 app.get('/register', function(req, res){
    res.render('register'); 
});

//Register post route

app.post('/register', function(req, res){

   const name = req.body.name;
   const email = req.body.email;
   const username = req.body.username;
   const password = req.body.password;
   const password2 = req.body.password2;

   req.checkBody('name', 'Name is required').notEmpty();
   req.checkBody('email', 'Email is required').notEmpty();
   //req.checkBody('email', 'email is not valid').isEmail();
   req.checkBody('username', 'Username is required').notEmpty();
   req.checkBody('password', 'Password is required').notEmpty();
   req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

   let errors = req.validationErrors();

   if(errors){
    res.render('register', {
        errors:errors
    });
   } else {
    let newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password
    });

    console.log(newUser);

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
         
            if(err){
                console.log(err);

            }
            newUser.password = hash;
            newUser.save(function(err){
                if(err){
                    console.log(err);
                 } else{
                    sendVerifyMail(req.body.name, req.body.email, newUser._id);
                    req.flash('success', 'you are now registered please  verify your email and  log in');
                    res.redirect('/login');

                    // generate verification token 

    // const token = new Token (
       // {userId:user._id ,
         //    token:crypto.randomBytes(16).toString('hex')
   //// });
           // token.save();
          // console.log(token)

    //generate verification toen
                }

    
            });
        });
    });
   }

});

// Send mail
 const sendVerifyMail = async(name, email, userId)=>{
     console.log(userId)
    try {

       const transporter =  nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port:587,
               secure:false,
               requireTLS:true,
               auth:{
                   user:'obiapostle30@gmail.com',
                   pass:'guls evka xxbt glcl'
               }
        });
        const mailOptions = {
            from:'obiapostle30@gmail.com',
            to:email,
            subject:'For Verification',
            html:'<p> Hi '+name+', please click here to <a  href="http://127.0.0.1:3000/verified?id='+userId+'"> verify </a> your email.</p>'
        }
        transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- ",info.response);
            }
        })
        
    } catch (error) {
        console.log(error.message);
        
    }

 }

 // Login Form

app.get('/login', function(req, res){
   res.render('login');
});

//Login Process

 app.post('/login', function(req, res, next){
     passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash: true
     })(req, res, next);
       
     
     
 });

 //Logout
 app.get('/logout', function(req, res){
    req.logOut(function(err){
        if (err) {return next(err); }
    req.flash('success', 'You Are Logged Out');
    res.redirect('/login');
        })
    });
 

 function omitPrivate(doc, obj) {
    delete obj.__v;
    return obj;
 }
    var options = {
        toJSON: {
            transform: omitPrivate
        }
    };
    
 //Get email verified Route
app.get('/verified',  function(req, res) {
     

    res.render("verified", {
      title: 'Verification Successful'
     
       
    });     
            
                 
            });
    
//Failure verification     
  app.get('/failure',  function(req, res) {
     

    res.render("failure", {
      title: 'OPPS Your Verification Failed'
     
       
    });     
            
                 
            });  

 
  //Routes files

   // let jerseys = require('./routes/jerseys');
   // app.use('/jerseys', jerseys);


// Access control
function ensureAuthentificated(req, res, next){
    if(req.isAuthenticated()){
        return next();
        
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/login');
    }
}
   


  const verifyMail = async(req, res)=>{
      try {
        const user = User.findById(req.params.id );
        
        if(user.verified === true) 
        res.render("User already verified");  

        user.verified = true;
        const res = user.save();
        res.render(user.username);
      } catch (error) {
        console.log(error.message);
      }
  }

   
   
app.listen(3000, function(){
    console.log('server started on port 3000');
});