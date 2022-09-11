const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    try {

        console.log(req, 'req');
        const { access_token } = req.cookies;
        if(!access_token){
            return next('Please login to access the data');
        }
        const verify = await jwt.verify(access_token,process.env.SECRET_KEY);
        req.user = await userModel.findById(verify.id);
        next();
    } catch(error) {
        return next(error);
    }
}

module.exports = isAuthenticated;