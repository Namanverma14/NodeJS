const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//id field will be automatically created
const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema);//mongoose collection will be all lower case and plural i.e employees
//Mongoose automatically looks for the plural, lowercased version of your model name.