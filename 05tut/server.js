const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;


const logEvents = require('./logEvents');//custom module that is why ./ is used
const EventEmitter = require('events');
class Emitter extends EventEmitter{};
//initialize the object
const myEmitter = new Emitter();
myEmitter.on('log',(msg,fileName)=>logEvents(msg,fileName));
const PORT = process.env.PORT || 3200;  //if we have to host it somewhere


const serveFile = async(filePath, contentType, response)=>{
    try{
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image')?'utf8':''
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData): rawData;
        response.writeHead(
            filePath.includes('404.html')?404:200,
            {'Content-Type': contentType});
        response.end(
            contentType==='application/json'
            ? JSON.stringify(data):data
        );
    }
    catch(err){
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`,'errLog.txt');
        response.statusCode = 500;//server error 
        response.end();
    }
}


const server = http.createServer((req,res)=>{
    console.log(req.url,req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`,'reqLog.txt'); 

    // let filePath;
    // if(req.url==='/' || req.url==='index.html'){
    //     res.statusCode = 200;  //means successful
    //     res.setHeader('Content-Type','text/html');  //serving the html page
    //     filePath = path.join(__dirname,'views','index.html');
    //     fs.readFile(filePath,'utf-8',(err,data)=>{  //read the index.html file and sending the data
    //         res.end(data);
    //     });
    // }



    const extension = path.extname(req.url); //if it is just a / then there won't be an extension name

    let contentType;
    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';  //if it is just a slash 
    } 


    //ternary chain
    let filePath = 
        contentType==='text/html' && req.url==='/'
            ?path.join(__dirname,'views','index.html')
            :contentType==='text/html' && req.url.slice(-1)==='/'   //when last character of url is /
                ?path.join(__dirname,'views',req.url,'index.html')
                :contentType==='text/html'
                    ?path.join(__dirname,'views',req.url)
                    :path.join(__dirname,req.url);

    //makes the .html extenso=ion not required in browser
    if(!extension && req.url.slice(-1)!=='/'){
        filePath+='.html';
    } //when we don't add .html


    const fileExists = fs.existsSync(filePath);//true or false whether file exists


    if(fileExists){
        //serve the file
        serveFile(filePath,contentType,res);
    }else{
        //404
        //301 -  redirect
        
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301,{'Locatoin':'/new-page.html'});//301 is for redirect, to new-apge file
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301,{'Locatoin':'/'});//301 is for redirect, to root i.e home page
                res.end();
                break;
            default:
                //serve a 404 response
                serveFile(path.join(__dirname,'views','404.html'),'text/html',res);
        }//tell us different parts of filr path
    }
});
server.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)})











