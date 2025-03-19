
//routing - breaking of routers into mini servers or mini apps
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger} = require('./middleware/logEvents') 
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

app.use(logger);

const whitelist=['https://www.google.com','http://127.0.0.1.5500','http://localhost:3500'];
const corsOptions = {
    origin:(origin, callback)=>{
        if(whitelist.indexOf(origin)!==-1 || !origin){ 
            callback(null,true);
        }else{
            callback(new Error('Not Allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false})); 

app.use(express.json());

app.use('/',express.static(path.join(__dirname,'/public')));    
app.use('/subdir',express.static(path.join(__dirname,'/public')));    

//routes
app.use('/',require('./routes/root'));
app.use('/subdir',require('./routes/subdir'));//route any reques coming for the subdirectory to the router instead of routes we are providing below
app.use('/employees',require('./routes/api/employees'));


app.all('*',(req,res)=>{  
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error:"404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found"); 
    }
})

app.use(errorHandler)

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)})











