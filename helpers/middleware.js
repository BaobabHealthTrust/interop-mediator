const { info, error } = require("winston");
const express = require("express");
const morgan = require("morgan");

const { client } = require("../middleware");

module.exports = (app = null) => {
  if (!app) {
    error("Failed to create mediator routes");
    return;
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use(client);
};
