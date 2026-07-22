const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Interval server error'
    });
};

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };