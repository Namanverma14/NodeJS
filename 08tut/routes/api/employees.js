const express = require('express');
const router = express.Router();
const data = {};
data.employees = require('../../data/employees.json');
//chained every request method to the same route
router.route('/')
    .get((req,res)=>{
        res.json(data.employees);
    })
    .post((req,res)=>{
        res.json({
            "firstname":req.body.firstname,
            "lastname":req.body.lastname
        });
    })
    .put((req,res)=>{            //updating the employee
        res.json({
            "firstname":req.body.firstname,
            "lastname":req.body.lastname
        });
    })
    .delete((req,res)=>{
        res.json({
            "id":req.body.id
        });
    });


router.route('/:id')           //parameter inside URL
    .get((req,res)=>{
        res.json({
            "id":req.params.id         //since we are pulling the named parameter directly out of the URL
        })
    });
module.exports = router;


//check these with thunder client extension