
const { jwt } = require("../API/JWT/getJwtToken");
const { client } = require("../Configure/dbConnect");
const Users = client.db('acl').collection("users");


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




module.exports = { verifyJWT }