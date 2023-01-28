const { jwt } = require("../API/JWT/getJwtToken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.cookies.accessToken;
    console.log(authHeader)

    if (!authHeader) {
        return res.status(401).send({ message: "Unauthorized Access" })
    }
    const token = authHeader;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access." })
        }
        req.decoded = decoded;
        next();
    })
}

module.exports = { verifyJWT }