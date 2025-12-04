'use strict';

/**
 * chicken router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::chicken.chicken');
