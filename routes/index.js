const { info, error } = require("winston");

const { errorHandler } = require("../middleware");
const migration = require("./migration");
const synchronization = require("./synchronization");

module.exports = (app = null) => {
  if (!app) {
    error("Failed to create mediator routes");
    return;
  }

  app.use("/interop-manager/synchronizations", synchronization);
  app.use("/interop-manager/migration", migration);

  /**
   * error handler
   * It should be the last route
   */
  app.use(errorHandler);

  info("routers successfully set");
};
