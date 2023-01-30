const jwt = require("jsonwebtoken");

const getToken = (app) => {
    app.get("/jwt", async (req, res) => {
        try {
            const { email } = req.query;
            const payload = {
                name: 'John',
                surname: 'Smith',
                email: email,
                username: 'john.smith',
                permissions: ['USER', 'ADMIN'],
            };

            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "10d" });
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