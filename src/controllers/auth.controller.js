const userModel = require('../model/user.model.js')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service.js')

async function register(req, res) {
    const {name, email, password} = req.body;

    const isalreadyExist = await userModel.findOne({email})

    if(isalreadyExist) {
        return res.status(422).json({
            message : "User already exists with this email",
            status : "failed"
        })
    }

    const user = await userModel.create({
        name, email, password
    })


    const token = jwt.sign({userID : user._id} , process.env.JWT_SECRET , {expiresIn:'7d'});

    res.cookie("token", token)

    res.status(201).json({
        user : {
            id : user._id,
            name : user.name,
            email : user.email
        },
        token
    })
    await emailService.sendRegistrationEmail(user.email, user.name);
}

async function login(req, res) {
    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select("+password")
    if(!user) {
        return res.status(401).json({
            message : "Invalid email"
        })
    }

    const isValidPassword = await user.comparePassword(password)
    if(!isValidPassword) {
        return res.status(401).json({
            message : "Invalid password"
        })
    }

    const token = jwt.sign({userID : user._id} , process.env.JWT_SECRET , {expiresIn:'7d'});

    res.cookie("token", token)

    res.status(200).json({
        user : {
            id : user._id,
            name : user.name,
            email : user.email
        },
        token
    })
}

module.exports = {register,login}
