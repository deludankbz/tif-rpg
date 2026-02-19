// Import document classes.
import { TIFActor } from './documents/actor.mjs';
import { TIFItem } from './documents/item.mjs';

import * as sheets from "./sheets/_module.mjs";       // Import sheet classes.

// Import helper/utility classes and constants.
import { TIF } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';

const collections = foundry.documents.collections;
const foundrySheets = foundry.appv1.sheets;

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

// Add key classes to the global scope so they can be more easily used
// by downstream developers
globalThis.tif = {
  documents: {
    TIFActor,
    TIFItem,
  },
  utils: {
    rollItemMacro,
  },
  models,
  sheets
};

Hooks.once('init', function () {
  
  // Add custom constants for configuration.
  CONFIG.TIF = TIF;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d20 + @abilities.dex.mod',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = TIFActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    explorer: models.TIFExplorer,
    creature: models.TIFCreature,
    npc: models.TIFNPC,
  };
  CONFIG.Item.documentClass = TIFItem;
  CONFIG.Item.dataModels = {
    effect: models.TIFEffect,
    equipment: models.TIFGear,
    weapon: models.TIFItemBase,
  };

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  collections.Actors.unregisterSheet('core', foundrySheets.ActorSheet);
  collections.Actors.registerSheet('tif-rpg', sheets.TIFActorExplorerSheet, {
    types: ['explorer', 'npc', 'creature'],
    makeDefault: true,
    label: 'TIF.SheetLabels.Actor',
  });

  collections.Items.unregisterSheet('core', foundrySheets.ItemSheet);
  collections.Items.registerSheet('tif-rpg', sheets.TIFItemSheet, {
    types: ['equipment', 'effect', 'weapon'],
    makeDefault: true,
    label: 'TIF.SheetLabels.Item',
  });

  preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createDocMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createDocMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.tif.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'tif.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
