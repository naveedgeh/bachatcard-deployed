//File created for creating custom errors
const errorHandler = (err, req, res, next) => {
    //Log to console for dev
    console.log(err.stack);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
        data: null

    })
};


module.exports = errorHandler;