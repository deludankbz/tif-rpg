/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Load Custom Dynamic Icons (svg)
    'systems/tif-rpg/templates/extra/dynamic-icons.hbs',
    
    // Actor partials.
    'systems/tif-rpg/templates/actor/parts/explorer/biography.hbs',
    'systems/tif-rpg/templates/actor/parts/explorer/header.hbs',
    'systems/tif-rpg/templates/actor/parts/explorer/inventory.hbs',
    'systems/tif-rpg/templates/actor/parts/explorer/effects.hbs',
    'systems/tif-rpg/templates/actor/parts/explorer/partials/inv-item-properties.hbs',
    
    // Item partials
    'systems/tif-rpg/templates/item/parts/item-effects.hbs',
  ]);
};
