
const { jwt } = require("../API/JWT/getJwtToken");
const { client } = require("../Configure/dbConnect");
const Users = client.db('acl').collection("users");


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized Access" })
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access." })
        }
        req.decoded = decoded;
        // const user = await Users.findOne({ email: req.decoded.email });
        req.user = {
            id: 1,
            role: ['admin'],
            permissions: ['read', 'write', 'delete']
        };
        next();
    })
}




module.exports = { verifyJWT }