const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const genAccessToken = (email, fullname, id) => {
    try {
        return jwt.sign({
            email: email,
            fullname: fullname,
            id: id
        },
        process.env.SECRET_JWT,
        {
            expiresIn: '1d'
        }
        )
    } catch (error) {
        console.log(error.message);
        return null;
    }
}
module.exports = {genAccessToken}