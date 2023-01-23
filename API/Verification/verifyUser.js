const { Users } = require("../Users/users");

const verifyAdmin = (app) => {

    app.get('/users', async (req, res) => {
        try {
            const { email } = req.query;
            const query = { email: email }

            const user = await Users.findOne(query);
            if (user.role === "admin") {
                res.send(true)
            }
            else {
                res.send(false)
            }
        } catch (error) {
            res.send(error.messaage)
        }
    })
}


const verifyManager = (app) => {

    app.get('/users/:email', async (req, res) => {
        try {
            const { email } = req.params;
            const query = { email: email }

            const user = await Users.findOne(query);
            if (user.role === "manager") {
                res.send(true)
            }
            else {
                res.send(false)
            }
        } catch (error) {
            res.send(error.messaage)
        }
    })
}

module.exports = { verifyAdmin, verifyManager }