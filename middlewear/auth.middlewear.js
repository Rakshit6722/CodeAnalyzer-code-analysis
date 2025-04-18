const axios = require("axios")
require("dotenv").config()

exports.auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(401).json({ message: "Token not found" })
        }

        const response = await axios.post(`${process.env.USER_SERVICE_URL}/user/verifyToken`, {
            token: token
        })
        if(response.status !== 200){
            return res.status(401).json({ message: "Unauthorized access" })
        }

        req.user = response?.data?.user
        req.userId = response?.data?.user?.userId
        next()

    }catch(err){


        console.error("Error in auth middleware:", err)
        return res.status(500).json({ message: "Internal server error" })
    }
}