"use strict";

/**
 * home-filterlink router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::home-filterlink.home-filterlink");

("use strict");

/**
 * home-filterlinks router.
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/home-filterlinks",
      handler: "home-filterlink.find",
      middlewares: ["populate-filterlinks"],
    },
    {
      method: "GET",
      path: "/home-filterlinks/:id",
      handler: "home-filterlink.findOne",
      middlewares: ["populate-filterlinks"],
    },
  ],
};
