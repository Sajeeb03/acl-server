const { client } = require("../../Configure/dbConnect");

//creating a collection of users
const Users = client.db('acl').collection("users");


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



module.exports = { Users, postUser }