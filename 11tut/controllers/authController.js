const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){this.users = data}
}
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');


const handleLogin = async (req,res)=>{
    const {user, pwd} = req.body;
    if(!user||!pwd) return res.status(400).json({"message":"username and password are required."});
    const foundUser = usersDB.users.find(person=>person.username === user);
    if(!foundUser)return res.sendStatus(401); //Unauthorised

    //evaluate password

    const match = await bcrypt.compare(pwd,foundUser.password);
    if(match){
        //create JWTs
        const accessToken = jwt.sign(        //pass a payload and it should not be password instead username
            {"username":foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'60s'}//in production use 5 min or 15 min
        );
        const refreshToken = jwt.sign(        
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        );
        //saving refresh token with current user
        //so that if user logs out before their one day has expired we can invalidate their refresh token
        const otherUsers = usersDB.users.filter(person=>person.username!== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..', 'model','users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt',refreshToken, {httpOnly:true,sameSite:'None',secure:true,maxAge:24*60*60*1000});//sameSite and secure are added because these are required to avoid error if we use chrome or any other browser, thunderclient just shows everything is fine , but its not actually(I am not mentioning the details now!)
        res.json({accessToken});//should be stored in memory and not in local storage as it is not secure, also any cookie that we can access with javascript could also be accessed. But if we set the coookie as httpOnly then it is safe from javascript, So basically we can send it as JSON where it is stored in memory safely but it will be difficult for the frontend developer so we send it as cookie which is httpOnly, and hence refresh token is sent as cookie and access token as json
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};
