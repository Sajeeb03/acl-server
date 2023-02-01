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

const allowPermission = app => {
    app.put("/permission/:role", async (req, res) => {
        try {
            const role = req.params.role;
            const permission = await Permissions.findOne({});
            const allowed = permission.allowed;
            let allowedRoles = [];
            if (allowed.includes(role)) {
                allowedRoles = allowed.filter(r => r !== role);
            }
            else {
                allowedRoles = [...allowed, role]
            }

            const update = {
                $set: { allowed: allowedRoles }
            }

            const updatePermission = await Permissions.updateOne({}, update, { upsert: true })

            res.send({
                success: true,
                message: "Updated"
            })
        } catch (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
    })
}


const allowActions = app => {
    app.put("/permission", async (req, res) => {
        try {
            const { access } = req.body;
            const permission = await Permissions.findOne({});

            const scope = permission.scope;
            let newScopes = [];

            if (scope.includes(access)) {
                newScopes = scope.filter(s => s !== access);
            }
            else {
                newScopes = [...scope, access];
            }

            const update = {
                $set: { scope: newScopes }
            }
            const updateScopes = await Permissions.updateOne({}, update, { upsert: true })
            res.send({
                success: true,
                message: "Updated"
            })

        } catch (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
    })
}

module.exports = { postPermissions, getPermissions, allowPermission, allowActions }