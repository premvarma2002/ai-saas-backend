export const SuccessHandler = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data,
    });
};
