//middleware is anything between request and response.Eg: route handlers are also middlewares.
/*3 types:
1)Builtin
2)Custom  : what we create ourselves
3)Middleware from 3rd parties
*/
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger} = require('./middleware/logEvents') //curly braces because it is one of the many functions imported
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
//custom middleware logger (at top)

app.use(logger);

//cors = cross origin resource sharing(3rd party middleware)
const whitelist=['https://www.google.com','http://127.0.0.1.5500','http://localhost:3500'];//domains which can access our backend server eg: it can be where frontend is there
const corsOptions = {
    origin:(origin, callback)=>{
        if(whitelist.indexOf(origin)!==-1 || !origin){ //or conditon added before devlopment and should be removed after development
            callback(null,true);
        }else{
            callback(new Error('Not Allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));



//built-in middleware to handle urlencoded data
//in other words, form data:
//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended:false})); 

//built-in middleware for json
app.use(express.json());

//serve static files like image, css, etc
app.use(express.static(path.join(__dirname,'/public')));    


app.get('^/$|/index(.html)?',(req,res)=>{
    // res.sendFile('./views/index.html',{root: __dirname});
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get('/new-page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','new-page.html'));
});

app.get('/old-page(.html)?',(req,res)=>{
    res.redirect(301,'/new-page.html');//302 by default response code, but it won't change search engine to get permanant redirect so we actually need 301(mean permanent move to new-page)
});

//Route Handlers: functions we are writing after the routes are route handlers
app.get('/hello(.html)?',(req,res,next)=>{
    console.log('Attempted to load Hello.html');
    next();//moves to the next handler or next expression or function i.e written after the comma. We can continue the chain by writing next as parameter in each finction.
},(req,res)=>{
    res.send('Hello World!');
})

//chaining route handlers
const one = (req,res,next)=>{
    console.log('one');
    next();
}
const two = (req,res,next)=>{
    console.log('two');
    next();
}
const three = (req,res)=>{
    console.log('three');
    res.send('Finished!');
}

app.get('/chain(.html)?',[one,two,three]);//providing handlers in array 

//app.use('/')            

app.all('*',(req,res)=>{  //for anything,  mostly for routing 
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error:"404 Not Found"});
    }else{
        res.type('txt').send("404 Not Found"); 
    }
})

//custom error handler
app.use(errorHandler)

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)})











