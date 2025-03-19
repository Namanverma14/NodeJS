const {format} = require('date-fns');
const { v4:uuid } = require('uuid');//different id to different entries
const fs  = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async(message)=>{
    const dateTime = `${format(new Date(),'yyyy/MM/dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try{
        if(!fs.existsSync(path.join(__dirname,'logs'))){
            await fsPromises.mkdir(path.join(__dirname,'logs'));
        }
        //testing
        await fsPromises.appendFile(path.join(__dirname,'logs','eventLog.txt'),logItem);
    }catch(err){
        console.error(err);
    }
}


module.exports = logEvents;












// console.log(format(new Date(),'yyyy/MM/dd\tHH:mm:ss'));

// console.log(uuid());
// console.log('naman');