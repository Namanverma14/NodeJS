const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

app.use(express.static(path.join(__dirname, 'img')));//for static like img, css, json, etc

//it reads it down like waterfall
//What if someone requests index.html??
//Ans: We can use regular expression(or regex) since express allows that eg ^/$|/index(.html)? means begins with a slash and end with a slash or index.html where .html is optional
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


//route handlers work in a way we call middleware


app.get('/*',(req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));//it actually will not 404 status code instead it will send 200 because we actually made the 404 file and it will serve that so we explicitly send that status code as 404
})
app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)})











