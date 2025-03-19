const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ "message": "username and password are required." });//400 means bad request
    ///check for duplicate username in database
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409);//conflict error

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);///means 10 salt rounds
        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });
        /* OR
        const newUser = new User();
        newUser.username = user;
        newUser.password = hashedPwd;
        const result = await newUser.save();
        */
        console.log(result);
        res.status(201).json({ 'success': `New User ${user} user created!` });

    } catch (err) {
        res.status(500).json({ "message": err.message });//500 is server error
    }
}

module.exports = { handleNewUser };