const { ObjectId } = require("mongodb");
const { client } = require("../../Configure/dbConnect");
const { verifyJWT, checkPermission, checkAcess } = require("../../MiddleWares/middleWares");


//creating a collection of users
const Users = client.db('acl').collection("users");

const getUsers = (app) => {
    app.get("/users", verifyJWT, checkPermission, checkAcess('read'), async (req, res) => {
        try {
            const result = await Users.find({}).toArray();
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


const postUser = (app) => {
    app.post("/users", async (req, res) => {
        try {
            const { email } = req.query;
            const user = req.body;
            const query = { email: email };
            const result = await Users.findOne(query);
            if (result) {
                res.send({
                    success: false,
                    message: "no need to update again"
                })
                return;
            }
            else {
                const addUser = await Users.insertOne(user);
                res.send({
                    success: true,
                    message: "User posted."
                })
            }
        } catch (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
    })
};



const updateUser = (app) => {

    app.put("/users/:id", verifyJWT, checkPermission, checkAcess('update'), async (req, res) => {
        const { id } = req.params;
        const filter = { _id: ObjectId(id) };

        const data = req.body;

        const update = {
            $set: { role: data.role }
        }
        try {
            const result = await Users.updateOne(filter, update, { upsert: true });
            // console.log(result)
            res.send("updated")
        } catch (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
    })
}


const deleteUser = (app) => {
    app.delete("/users/user/:id", verifyJWT, checkPermission, checkAcess('delete'), async (req, res) => {

        const { id } = req.params;
        const filter = { _id: ObjectId(id) }

        try {
            const user = await Users.deleteOne(filter);
            res.send({
                success: true,
                message: "user deleted"
            })
        } catch (error) {
            res.send({
                success: false,
                message: error.message
            })
        }
    })
}


module.exports = { postUser, getUsers, updateUser, deleteUser }