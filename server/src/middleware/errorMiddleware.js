const errorMiddleware = (err, req, res, next) => {
    const statusCode =
      res.statusCode === 200 ? 500 : res.statusCode;

      console.log("my errors codes and constraint", err.code , "and constraint", err.constraint);

      if(
          err.code === "23505" &&
          err.constraint === "unique_user_project_title"
        ) {
          console.log("here");
          return res.status(409).json({
            success: false,
            message: "You already have a project with this name."
          });
        }

        console.log("error message from middlewere", err.message)

      res.status(statusCode).json({
        success: false,
        message: err.message,
      });
};

module.exports = errorMiddleware;