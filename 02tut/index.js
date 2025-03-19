const fsPromises = require('fs').promises;

const path = require('path');

const fileOps = async()=>{
    try {
        const data = await fsPromises.readFile(path.join(__dirname,'abc','gists.txt'),'utf8');
        console.log(data);
        await fsPromises.unlink(path.join(__dirname,'abc','test.txt'));

        await fsPromises.writeFile(path.join(__dirname,'abc','promiseWrite.txt'),data);
        await fsPromises.appendFile(path.join(__dirname,'abc','promiseWrite.txt'),'\n\n Hi Disha, nice to meet you');
        await fsPromises.rename(path.join(__dirname,'abc','promiseWrite.txt'),path.join(__dirname,'abc','promiseComplete.txt'));

        const newData = await fsPromises.readFile(path.join(__dirname,'abc','promiseComplete.txt'),'utf-8');
        console.log(newData);
    }catch(err){
        console.error(err);
    }
}

fileOps();


// fs.readFile(path.join(__dirname,'abc','gists.txt'),'utf8',(err,data)=>{
//     if(err){
//         throw err;
//     }
//     console.log(data/*.toString()*/);//instead of toString() we can also use utf8 before the call back
// });

//to show it uses async
// console.log('Helol...')

// fs.writeFile(path.join(__dirname,'abc','reply.txt'),'Nice to meet you too',(err)=>{
//     if(err){
//         throw err;
//     }
//     console.log('operation complete');
//     fs.appendFile(path.join(__dirname,'abc','reply.txt'),'Nice to meet you too again',(err)=>{
//         if(err){
//             throw err;
//         }
//         console.log('operation 2 complete');
//         fs.rename(path.join(__dirname,'abc','reply.txt'),path.join(__dirname,'abc','test2.txt'),(err)=>{
//             if(err){
//                 throw err;
//             }
//             console.log('operation 3 complete');
//         });
//     });
// });


//exit on uncaught errors
process.on('uncaughtException',err=>{
    console.error(`There was an unknown error: ${err}`);
    process.exit(1);
})