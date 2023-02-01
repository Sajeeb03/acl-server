const { jwt } = require("../API/JWT/getJwtToken");
const { client } = require("../Configure/dbConnect");
const Users = client.db('acl').collection("users");
const Permissions = client.db("acl").collection("permissions");
const jwtPermission = require('express-jwt-permissions')
const guard = jwtPermission();


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized Access" })
    }
    const token = authHeader.split(' ')[1];
    const algorithm = 'HS256';

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY, { algorithms: [algorithm] });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}


const checkPermission = async (req, res, next) => {
    const email = req.user.email;
    const user = await Users.findOne({ email });
    const role = user?.role;
    const result = await Permissions.findOne({})
    const allowed = result.allowed;

    if (allowed.includes(role)) {
        req.user.role = role;
        next();
    }
    else {
        res.status(403).send("Unauthorized user")
    }
}

const checkAcess = (action) => async (req, res, next) => {
    const role = req.user.role;
    const requiredPermission = `${role}:${action}`

    try {
        const middleware = guard.check([requiredPermission]);
        middleware(req, res, next);

    } catch (err) {
        // handle error
        res.status(401).send('Unauthorized');
        return false;
    }
};


module.exports = { verifyJWT, checkPermission, checkAcess }