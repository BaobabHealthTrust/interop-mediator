module.exports = /** @class */ (function() {
  function OrchestrationRegister() {}

  OrchestrationRegister.add = function(
    req,
    name,
    responseBody,
    responseStatus
  ) {
    OrchestrationRegister.orchestrations.push({
      name,
      request: {
        path: req.path,
        headers: req.headers,
        querystring: req.originalUrl.replace(req.path, ""),
        body: JSON.stringify(req.body),
        method: req.method,
        timestamp: new Date().getTime()
      },
      response: {
        status: responseStatus,
        body: JSON.stringify(responseBody),
        timestamp: new Date().getTime()
      }
    });
  };

  OrchestrationRegister.orchestrations = [];
  return OrchestrationRegister;
})();
