const User = require('../model/User');

const handleLogout = async (req, res) => {
    //on client, also delete the accesToken, i.e should be done in memory of the client application, caan't be done on beackend, i.e set it to blank when logout button is clicked.

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);//No content to send back i.e a successful request
    const refreshToken = cookies.jwt;

    //is refresh token in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    //Delete the refresh token in the database
    foundUser.refreshToken = ' ';
    const result = await foundUser.save();//foundUser is a document
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });//secure:true->only serves on https, this should be added in production

    res.sendStatus(204);
}

module.exports = { handleLogout }
