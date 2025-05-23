const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data){this.users = data}
}
const fsPromises = require('fs').promises;
const path =  require('path');

const handleLogout = async (req,res)=>{
    //on client, also delete the accesToken, i.e should be done in memory of the client application, caan't be done on beackend, i.e set it to blank when logout button is clicked.

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);//No content to send back i.e a successful request
    const refreshToken = cookies.jwt;

    //is refresh token in DB
    const foundUser = usersDB.users.find(person=>person.refreshToken === refreshToken);
    if(!foundUser){
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
        return res.sendStatus(204);
    }
    
    //Delete the refresh token in the database
    const otherUsers = usersDB.users.filter(person=>person.refreshToken!==foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});//secure:true->only serves on https, this should be added in production

    res.sendStatus(204);
}

module.exports = {handleLogout}
