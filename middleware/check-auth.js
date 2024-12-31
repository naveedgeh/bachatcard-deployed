const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        if (!token) {
            return next(new ErrorResponse('Token Absent', 401))
        }
        const decoded = jwt.verify(token, "" + process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(new ErrorResponse(err, 400))
    }
};