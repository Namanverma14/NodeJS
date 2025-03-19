const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){this.users = data}
}
const fsPromises = require('fs').promises;
const path = require('path');

//bcrypt helps hash and add salt to the passwords we commence, adding salt helps when db gets compromised and hacker might dcrypt all the passwords through it but adding salt will avoid that.
const bcrypt = require('bcrypt');

const handleNewUser = async(req,res)=>{
    const {user, pwd} = req.body;
    if(!user||!pwd) return res.status(400).json({"message":"username and password are required."});//400 means bad request
    ///check for duplicate username in database
    const duplicate = usersDB.users.find(person=>person.username===user);
    if(duplicate)return res.sendStatus(409);//conflict error
    try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);///means 10 salt rounds
        //store the new user
        const newUser = {"username":user, "password":hashedPwd};
        usersDB.setUsers([...usersDB.users,newUser]);
        await fsPromises.writeFile(                        //writing in the file
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({'success':`New User ${user} user created!`});

    }catch(err){
        res.status(500).json({"message":err.message});//500 is server error
    }
}

module.exports = {handleNewUser};