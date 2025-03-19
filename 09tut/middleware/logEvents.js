const {format} = require('date-fns');
const { v4:uuid } = require('uuid');//different id to different entries
const fs  = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


const logEvents = async(message,logName)=>{
    const dateTime = `${format(new Date(),'yyyy/MM/dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){//one directory up with two dots since it is in middleware
            await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        }
        //testing
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logName),logItem);
    }catch(err){
        console.error(err);
    }
}

const logger = (req,res,next)=>{
    logEvents(`${req.method}\t${req.header.origin}\t${req.url}`,`reqLog.txt`);
    console.log(`${req.method}  ${req.path}`);
    next();
}

module.exports = {logger,logEvents};












// console.log(format(new Date(),'yyyy/MM/dd\tHH:mm:ss'));

// console.log(uuid());
// console.log('naman');