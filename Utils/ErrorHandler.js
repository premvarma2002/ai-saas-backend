export const errorHandler = (res, err = {}, statusCode, message) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        error: err,
    });
};
