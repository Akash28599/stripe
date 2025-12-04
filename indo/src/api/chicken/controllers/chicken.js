'use strict';

/**
 * chicken controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::chicken.chicken');
