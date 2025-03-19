const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){this.users = data}
}
const bcrypt = require('bcrypt');
const handleLogin = async (req,res)=>{
    const {user, pwd} = req.body;
    if(!user||!pwd) return res.status(400).json({"message":"username and password are required."});
    const foundUser = usersDB.users.find(person=>person.username === user);
    if(!foundUser)return res.sendStatus(401); //Unauthorised

    //evaluate password

    const match = await bcrypt.compare(pwd,foundUser.password);
    if(match){
        //IN next tutorial
        //create JWTs to send to other routes that we want protected in our API.
        //normal token and refresh token
        res.json({"message":`User ${user} is logged in!`});
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};
