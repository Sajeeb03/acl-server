const { client } = require("../../Configure/dbConnect");

const Permissions = client.db("acl").collection("permissions");


const postPermissions = app => {
    app.post("/permission", async (req, res) => {
        const result = await Permissions.insertOne(req.body)
        res.send('uploaded')
    })
}

module.exports = { postPermissions }