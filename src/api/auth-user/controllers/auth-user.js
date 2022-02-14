"use strict";

/**
 *  auth-user controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const utils = require("@strapi/utils");

const { parseMultipartData } = utils;

const populateList = [
  "addition_requests",
  "edit_requests",
  "edit_requests.site",
  "user_routes",
  "favourites",
  "profile_pic",
];

const enrichCtx = (ctx) => {
  if (!ctx.query) {
    ctx.query = {};
  }
  const currentPopulateList = ctx.query.populate || [];
  ctx.query.populate = [...currentPopulateList, ...populateList];
  return ctx;
};

module.exports = createCoreController(
  "api::auth-user.auth-user",
  ({ strapi }) => ({
    // findMe method
    async findMe(ctx) {
      const enrichedcCtx = enrichCtx(ctx);
      const user = await super.findOne(ctx);
      return this.sanitizeOutput(user, ctx);
    },

    // update method
    async update(ctx) {
      const enrichedcCtx = enrichCtx(ctx);
      const user = await super.update(ctx);
      return this.sanitizeOutput(user, ctx);
    },
  })
);