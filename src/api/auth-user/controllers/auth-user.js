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
  "saved_public_routes",
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
  "sites.type",
  "sites.images",
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

    async editProfile(ctx) {
      let dataToUpdate = {};
      const enrichedCtx = enrichCtx(ctx);
      if (!enrichedCtx.request.body) {
        enrichedCtx.request.body = {};
      }
      if (!enrichedCtx.request.body.data) {
        enrichedCtx.request.body.data = {};
      }
      if (enrichedCtx.request.body.data.name) {
        dataToUpdate.name = enrichedCtx.request.body.data.name;
      }
      if (enrichedCtx.request.body.data.profilePic) {
        dataToUpdate.profile_pic = enrichedCtx.request.body.data.profilePic;
      }
      if (enrichedCtx.request.body.data.profilePic) {
        dataToUpdate.profile_pic = enrichedCtx.request.body.data.profilePic;
      }
      if (enrichedCtx.request.body.data.businessName) {
        dataToUpdate.businessName = enrichedCtx.request.body.data.businessName;
      }
      enrichedCtx.request.body.data = dataToUpdate;
      const user = await super.update(enrichedCtx);
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

    // updateFavourites method
    async updateSavedRoutes(ctx) {
      const enrichedCtx = enrichCtx(ctx);
      const routeId = enrichedCtx.request.body?.data?.route;
      if (!routeId) {
        return {
          status: 400,
          message: "Bad request",
        };
      }
      const serverRoute = await strapi.db
        .query("api::user-route.user-route")
        .findOne({
          where: {
            id: routeId,
          },
        });

      if (serverRoute.public) {
        const currentUser = await this.findMe({
          ...enrichedCtx,
          params: { id: enrichedCtx.params.id },
        });

        const savedRoutes =
          currentUser.data.attributes.saved_public_routes.data.map(
            (r) => r.id
          ) || [];
        if (savedRoutes.includes(routeId)) {
          enrichedCtx.request.body.data = {
            saved_public_routes: savedRoutes.filter((r) => r !== routeId),
          };
        } else {
          enrichedCtx.request.body.data = {
            saved_public_routes: [...savedRoutes, routeId],
          };
        }
        const user = await super.update(enrichedCtx);
        return this.sanitizeOutput(user, ctx);
      } else {
        ctx.status = 400;
        return {
          status: 400,
          message: "Cannot save a route that isn't public",
        };
      }
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
