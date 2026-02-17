/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Load Custom Dynamic Icons (svg)
    'systems/miniD6/templates/extra/dynamic-icons.hbs',
    
    // Actor partials.
    'systems/miniD6/templates/actor/parts/explorer/biography.hbs',
    'systems/miniD6/templates/actor/parts/explorer/header.hbs',
    'systems/miniD6/templates/actor/parts/explorer/inventory.hbs',
    'systems/miniD6/templates/actor/parts/explorer/effects.hbs',
    'systems/miniD6/templates/actor/parts/explorer/partials/inv-item-properties.hbs',
    
    // Item partials
    'systems/miniD6/templates/item/parts/item-effects.hbs',
  ]);
};
