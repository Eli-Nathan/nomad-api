const axios = require("axios");

const auth0domain = process.env.AUTH0_DOMAIN;

module.exports = (plugin) => {
  plugin.policies["isAuthed"] = async (ctx, config, { strapi }) => {
    if (ctx.state.user) {
      // request is already authenticated in a different way
      return true;
    }

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      try {
        const data = await axios({
          method: "POST",
          url: auth0domain,
          headers: {
            Authorization: ctx.request.header.authorization,
          },
        });
        const userData = data.data;
        const user = await strapi.db.query(`api::auth-user.auth-user`).findOne({
          where: {
            id: user.id,
          },
        });

        ctx.state.user = user;
        ctx.state.user.sub = userData.sub;
        if (userData) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    // Execute the action.
    return false;
  };
  return plugin;
};
