require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwtPermission = require('express-jwt-permissions')
const { dbConnect, client } = require('./Configure/dbConnect');


//api
const { postUser, getUsers, updateUser, deleteUser } = require('./API/Users/users');
const { verifyAdmin, verifyManager } = require('./API/Verification/verifyUser');
const { getToken } = require('./API/JWT/getJwtToken');
const { verifyJWT } = require('./MiddleWares/middleWares');


const app = express();
const port = process.env.PORT;
const guard = jwtPermission();

//middle wares
app.use(cors());
app.use(express.json());

//connecting mongodb to the server
dbConnect();
const Users = client.db('acl').collection("users");


const permissions = [
    {
        method: 'GET',
        path: '/admin',
        action: 'read:users',
    },
    {
        method: 'GET',
        path: '/users/:id',
        action: 'read:user',
    },
    {
        method: 'POST',
        path: '/users',
        action: 'create:user',
    },
    {
        method: 'PUT',
        path: '/users/:id',
        action: 'update:user',
    },
    {
        method: 'DELETE',
        path: '/users/:id',
        action: 'delete:user',
    },
];

// permissions.forEach((permission) => {
//     app[permission.method.toLowerCase()](permission.path, guard.check(permission.action), (req, res) => {
//         res.json({ message: 'Access granted.' });
//     });
// });

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



//primary api
app.get("/", (req, res) => {
    res.send("Server is running");
})

app.get("/admin", verifyJWT, guard.check(['ADMIN']), (req, res) => {
    res.send("hello from there")
});

//listening the port 
app.listen(port, () => console.log(`Server is running at ${port}`))


