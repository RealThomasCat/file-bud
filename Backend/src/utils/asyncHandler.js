/*
    -> Making a reusable wrapper function for async/await error handling.
    -> This eliminates the need to use try/catch blocks in every asynchronous route handler.
*/

//USING PROMISES
//
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            next(err)
        );
    };
};

// USING TRY CATCH
//
// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export { asyncHandler };
