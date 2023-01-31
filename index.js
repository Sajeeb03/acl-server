require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwtPermission = require('express-jwt-permissions')
const { dbConnect, client } = require('./Configure/dbConnect');


//api
const { postUser, getUsers, updateUser, deleteUser } = require('./API/Users/users');
const { verifyAdmin, verifyManager } = require('./API/Verification/verifyUser');
const { getToken } = require('./API/JWT/getJwtToken');
const { verifyJWT, checkPermission } = require('./MiddleWares/middleWares');
const { postPermissions } = require('./API/Permissions/permissions');



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


// const permissions = [
//     {
//         method: 'GET',
//         path: '/admin',
//         action: 'read:users',
//     },
//     {
//         method: 'GET',
//         path: '/users/:id',
//         action: 'read:user',
//     },
//     {
//         method: 'POST',
//         path: '/users',
//         action: 'create:user',
//     },
//     {
//         method: 'PUT',
//         path: '/users/:id',
//         action: 'update:user',
//     },
//     {
//         method: 'DELETE',
//         path: '/users/:id',
//         action: 'delete:user',
//     },
// ];

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


// const aclCheck = (err, req, res, next) => {
//     if (err) {
//         console.log(err)
//     }
//     else {

//         next();
//     }
// }


//primary api
app.get("/", (req, res) => {
    res.send("Server is running");
})

const actions = ['manager:read', 'admin:write']

// const myMiddleware = async (req, res, next) => {
//     try {
//         guard.check([...actions], (req, res, next) => {
//             if (res.statusCode === 403) {
//                 console.log(error)
//             }
//             else {
//                 next()
//             }
//         })
//     } catch (error) {

//     }

// };
postPermissions(app);



app.get("/admin", verifyJWT, checkPermission, guard.check([...actions]), async (req, res) => {
    try {
        console.log(req.statusCode)
        res.send("hello from there")
    } catch (error) {
        res.send("error")
    }
});

//listening the port 
app.listen(port, () => console.log(`Server is running at ${port}`))


