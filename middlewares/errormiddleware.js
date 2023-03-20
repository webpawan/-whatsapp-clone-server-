// const notFound = (req,res,next) =>{
//     // req.originalUrl me ya bo url send dega jo apan request kar rahe ha
//     const error = new Error(`not found - ${req.originalUrl}`);
//     res.status(400);
//     next(error)

// }

// const errorHandler = (err,req,res,next) =>{
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     res.json({
//         message:err.message,
//         stack:process.env.NODE_ENV === "production" ? null :err.stack;
//     })
// }

// // const exports =  {notFound,errorHandler};



