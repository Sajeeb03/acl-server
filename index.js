require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./Configure/dbConnect');

//api
const { postUser } = require('./API/Users/users');
const { verifyAdmin, verifyManager } = require('./API/Verification/verifyUser');

const app = express();
const port = process.env.PORT;

//middle wares
app.use(cors());
app.use(express.json());

//connecting mongodb to the server
dbConnect();


// posting user to db
postUser(app);



//verify a user is admin or not

verifyAdmin(app)

//manager verification

verifyManager(app)

//primary api
app.get("/", (req, res) => {
    res.send("Server is running");
})

//listening the port 
app.listen(port, () => console.log(`Server is running at ${port}`))