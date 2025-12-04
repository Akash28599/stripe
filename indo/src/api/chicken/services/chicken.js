'use strict';

/**
 * chicken service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chicken.chicken');
