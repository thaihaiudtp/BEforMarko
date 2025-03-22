const User = require('../model/user');
const bcrypt = require('bcrypt');
const {genAccessToken} = require('../util/genAcessToken');

const Register = async (req, res) => {
    const {fullname, email, password} = req.body;
    try {
        const existEmail = await User.findOne({email: email});
        if (existEmail) {
            return res.status(409).json({
                success: false,
                message: 'Email already exist',
            })
        }
        const newUser = await User.create({
            fullname, email, password
        });
        return res.status(201).json({
            success: newUser ? true : false,
            message: newUser ? "User created successfully" : "Failed to create user",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        });
    }
}
const Login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const existEmail = await User.findOne({email: email});
        if(!existEmail){
            return res.status(404).json({
                success: false,
                message: 'Email not found',
            })
        }
        if(existEmail.role === 3){
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to login',
            })
        }
        const isMatchUser = bcrypt.compareSync(password, existEmail.password);
        if(!isMatchUser){
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            })
        }
        const token = genAccessToken(existEmail.email, existEmail.fullname);
        return res.status(200).json({
            success: true,
            message: 'Login successfully',
            token: token,
            role: existEmail.role,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        });
    }
}
const authGoogle = async(req, res) => {
    const token = req.cookies.accessToken;
    if(!token){
        return res.status(401).json({
            success: false,
            message: 'You are not authorized to access this route',
        })
    }
    return res.status(200).json({
        success: true,
        message: 'You are authorized to access this route',
        token: token,
        role: '0'
    })
}
const logout = async (req, res) => {
    res.clearCookie("token");
    
    return res.status(200).json({
        success: true,
        message: "Logged out",
    });
}

module.exports = {
    Login, Register, authGoogle, logout
}