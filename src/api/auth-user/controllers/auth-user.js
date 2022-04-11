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
  "edit_requests.site.type",
  "user_routes",
  "favourites",
  "favourites.type",
  "profile_pic",
  "comments",
  "comments.site",
  "role",
  "sites",
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
      const enrichedCtx = enrichCtx(ctx);
      const user = await super.findOne(enrichedCtx);
      return this.sanitizeOutput(user, ctx);
    },

    // verify email method
    async verifyEmail(ctx) {
      const enrichedCtx = enrichCtx(ctx);
      const userDetails = ctx.state.user;
      ctx.request.body = { data: { isVerified: userDetails.email_verified } };
      const user = await super.update(enrichedCtx);
      return this.sanitizeOutput(user, ctx);
    },

    // updateFavourites method
    async updateFavourites(ctx) {
      const enrichedCtx = enrichCtx(ctx);
      if (!enrichedCtx.request.body) {
        enrichedCtx.request.body = {};
      }
      if (!enrichedCtx.request.body.data) {
        enrichedCtx.request.body.data = {};
      }
      if (!enrichedCtx.request.body.data.favourites) {
        enrichedCtx.request.body.data.favourites = {};
      }
      const { favourites } = enrichedCtx.request.body.data;
      enrichedCtx.request.body.data = {
        favourites,
      };
      const user = await super.update(enrichedCtx);
      return this.sanitizeOutput(user, ctx);
    },

    // create method
    async create(ctx) {
      const enrichedCtx = enrichCtx(ctx);
      if (!ctx.request.body) {
        ctx.request.body = {};
      }
      if (!ctx.request.body.data) {
        ctx.request.body.data = {};
      }

      const baseRole = await strapi.db
        .query(`api::user-role.user-role`)
        .findOne({
          where: {
            level: 0,
          },
        });

      ctx.request.body.data.role = baseRole.id;
      const user = await super.create(enrichedCtx);
      return this.sanitizeOutput(user, ctx);
    },
  })
);
