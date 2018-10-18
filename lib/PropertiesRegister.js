module.exports = /** @class */ (function() {
  function PropertiesRegister() {}

  PropertiesRegister.add = function(title, value) {
    PropertiesRegister.properties[title] = value;
  };

  PropertiesRegister.properties = {};

  return PropertiesRegister;
})();
