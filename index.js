const {format} = require('date-fns');
const { v4:uuid } = require('uuid');//different id to different entries

console.log(format(new Date(),'yyyy/MM/dd\tHH:mm:ss'));

console.log(uuid());
console.log('naman');