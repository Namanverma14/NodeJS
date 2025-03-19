//Example of Model View Controller pattern (MVC)

const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController')
//chained every request method to the same route
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updatEmployee)
    .delete(employeesController.deleteEmployee)


router.route('/:id')          
    .get(employeesController.getEmployee);
module.exports = router;


