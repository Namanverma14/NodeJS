const logEvents = require('./logEvents');//custom module that is why ./ is used

const EventEmitter = require('events');

class MyEmitter extends EventEmitter{};

//initialize the object

const myEmitter = new MyEmitter();

//add a listener for the log event

myEmitter.on('log',(msg)=>logEvents(msg));

setTimeout(()=>{
    //Emit Event 
    myEmitter.emit('log', 'Log event emitted!');
},5000);//5 sec delay