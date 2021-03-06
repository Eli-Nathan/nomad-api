module.exports = async (policyContext, config, { strapi }) => {
  if (
    policyContext.state.user &&
    policyContext.state.user.id &&
    policyContext.state.route
  ) {
    // Query db for items with owner as current user (and ID if present in request)
    const entity = await strapi.db.query(`api::auth-user.auth-user`).findOne({
      where: {
        id: policyContext.state.user.id,
      },
    });

    if (entity && entity.id) {
      // Ensure there is a filters object to use
      if (!policyContext.params) {
        policyContext.params = {};
      }
      //Set owner as current user
      policyContext.params.id = entity.id;
      return true; // Return true (policy allows the request through)
    }
  }

  return false; // If you return nothing, Strapi considers you didn't want to block the request and will let it pass
};
