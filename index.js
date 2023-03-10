require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwtPermission = require('express-jwt-permissions')
const { dbConnect, client } = require('./Configure/dbConnect');


//api
const { postUser, getUsers, updateUser, deleteUser } = require('./API/Users/users');
const { verifyAdmin, verifyManager } = require('./API/Verification/verifyUser');
const { getToken } = require('./API/JWT/getJwtToken');
const { verifyJWT, checkPermission, checkAcess } = require('./MiddleWares/middleWares');
const { postPermissions, getPermissions, allowPermission, allowActions } = require('./API/Permissions/permissions');



const app = express();
const port = process.env.PORT;
const guard = jwtPermission();


app.use(function (err, req, res, next) {

    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
})

//middle wares
app.use(cors());
app.use(express.json());




//connecting mongodb to the server
dbConnect();
const Users = client.db('acl').collection("users");


//getting json web token

getToken(app);

//getting all users
getUsers(app);
// posting user to db
postUser(app);
//update users data
updateUser(app);

//deleting a user
deleteUser(app);

//verify a user is admin or not

verifyAdmin(app)

//manager verification

verifyManager(app)

//posting permissions
postPermissions(app);

//getting permissions
getPermissions(app);

//allow users to do things
allowPermission(app);

//allow new actions
allowActions(app);




//primary api
app.get("/", (req, res) => {
    res.send("Server is running");
})












app.get("/admin", verifyJWT, checkPermission, checkAcess('delete'), async (req, res) => {
    try {
        res.send("hello from there")
    } catch (error) {
        res.send("error")
    }
});

//listening the port 
app.listen(port, () => console.log(`Server is running at ${port}`))


