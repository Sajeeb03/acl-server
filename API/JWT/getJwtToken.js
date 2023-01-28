const jwt = require("jsonwebtoken")

const getToken = app => {
    app.post("/jwt", async (req, res) => {
        try {
            const email = req.query;
            const token = jwt.sign(email, process.env.SECRET_KEY, { expiresIn: "10d" });
            res.send({
                success: true,
                data: token
            })
        } catch (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
    })
}


module.exports = { getToken, jwt }