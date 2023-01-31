const { client } = require("../../Configure/dbConnect");
const { verifyJWT } = require("../../MiddleWares/middleWares");

const Permissions = client.db("acl").collection("permissions");


const postPermissions = app => {
    app.post("/permission", async (req, res) => {
        const result = await Permissions.insertOne(req.body)
        res.send('uploaded')
    })
}

const getPermissions = app => {
    app.get("/permission", verifyJWT, async (req, res) => {
        try {
            const result = await Permissions.findOne({});
            res.send({
                success: true,
                data: result
            })
        } catch (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
    })
}

module.exports = { postPermissions, getPermissions }