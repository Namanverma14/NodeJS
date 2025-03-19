const fs = require('fs');


if(!fs.existsSync('./new')){//if it does not exist
fs.mkdir('./new',(err)=>{
    if(err)throw err;
    console.log('directory created');
})
}
//DELETE

if(fs.existsSync('./new')){//if it does exist
    fs.rmdir('./new',(err)=>{
        if(err)throw err;
        console.log('directory removed');
    })
}

