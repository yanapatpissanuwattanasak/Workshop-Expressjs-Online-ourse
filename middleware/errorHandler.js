module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        error : {
            sattusCode : statusCode,
            message : err.message ,
            validation : err.validation
        }
      })
}