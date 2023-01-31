const jwt = require("jsonwebtoken");
const { client } = require("../../Configure/dbConnect");
const Permissions = client.db("acl").collection("permissions");

const getToken = (app) => {
    app.get("/jwt", async (req, res) => {
        try {
            const { email } = req.query;
            const permissions = await Permissions.findOne({});
            // console.log(permissions)
            const payload = {
                name: 'John',
                surname: 'Smith',
                email: email,
                username: 'john.smith',
                permissions: [...permissions.scope],
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