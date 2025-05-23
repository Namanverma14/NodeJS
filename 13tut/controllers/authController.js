const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ "message": "username and password are required." });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorised

    //evaluate password

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        //create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {             //used as different namespace because it is considered to be a private jwt claim
                    "username": foundUser.username,
                    "roles": roles
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', /*secure: true,*/ maxAge: 24 * 60 * 60 * 1000 });//if we are checking refresh endpoint with refresh cookie we have to remove "secure" because thunderclient won;t work but it is required for chrome i.e. in production.
        res.json({ accessToken });
    }
    else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
