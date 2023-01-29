require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnect, client } = require('./Configure/dbConnect');


//api
const { postUser, getUsers, updateUser, deleteUser } = require('./API/Users/users');
const { verifyAdmin, verifyManager } = require('./API/Verification/verifyUser');
const { getToken } = require('./API/JWT/getJwtToken');
const { verifyJWT } = require('./MiddleWares/middleWares');


const app = express();
const port = process.env.PORT;


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



//primary api
app.get("/", (req, res) => {
    res.send("Server is running");
})

app.get("/admin", verifyJWT, (req, res) => {
    res.send("hello from there")
});

//listening the port 
app.listen(port, () => console.log(`Server is running at ${port}`))


