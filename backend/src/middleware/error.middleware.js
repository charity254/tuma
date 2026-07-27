const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    const isProd = process.env.NODE_ENV === 'production';
    const message = (err.isOperational || !isProd) ? err.message : 'Internal server error';

    res.status(status).json({
        success: false,
        message
    });
};

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };