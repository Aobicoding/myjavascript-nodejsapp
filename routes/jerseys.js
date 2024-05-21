/*
const express = require('express');
const router = express.Router();

//bring Article model
let  Jersey = require('../models/jersey');


//Get single jersey
router.get('/:id', function(req, res) {
    Jersey.findById(req.params.id, function(err, jersey){
        res.render('jersey', {
            jersey:jersey
        });

    });
});
// Add Jearsey info route
 router.get('/add/jersey', function(req, res){
     res.render('add_jersey', {
          title: 'Choose Jersey Info'
     
       
    });
 });

 //add Post Route
 router.post('/add/jersey', function(req, res){
    let jersey = new Jersey();
    jersey.Name = req.body.name;
    jersey.Number = req.body.number;
    jersey.Size = req.body.size;

    jersey.save(function(err){
        if(err){
        console.log(err);
        return;
    }else{
        req.flash('success', 'Jersey Info Succesfully Added');
      res.redirect('/');
    }
    })
 });

 //edit jersey info
router.get('/edit/:id', function(req, res) {
    Jersey.findById(req.params.id, function(err, jersey){
        res.render('edit_jersey', {
            title: 'Update Jersey',
            jersey:jersey
        });

    });
});

//Update Info Route
router.post('/edit/:id', function(req, res){
    let jersey = {};
    jersey.Name = req.body.name;
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
  
module.exports = router;
*/