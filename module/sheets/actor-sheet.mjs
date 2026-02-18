const { api, sheets } = foundry.applications;
const TextEditor = foundry.applications.ux.TextEditor.implementation;

/**
* Extend the basic ActorSheet with some very simple modifications
* @extends {ActorSheetV2}
*/
export class MiniD6ActorSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2
) {
  
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ['md6', 'actor'],
    position: {
      width: 600,
      height: 900,
    },
    actions: {
      onEditImage: this._onEditImage,
      onSelectItem: this._onSelectItem,
      viewDoc: this._viewDoc,
      createDoc: this._createDoc,
      deleteDoc: this._deleteDoc,
      toggleEffect: this._toggleEffect,
      roll: this._onRoll,
    },
    // Custom property that's merged into `this.options`
    // dragDrop: [{ dragSelector: '.draggable', dropSelector: null }],
    form: {
      submitOnChange: true,
    },
  };
  
  /** @override */
  static PARTS = {
    header: {
      template: 'systems/miniD6/templates/actor/parts/explorer/header.hbs',
    },
    tabs: {
      // Foundry-provided generic template
      template: 'templates/generic/tab-navigation.hbs',
    },
    effects: {
      template: 'systems/miniD6/templates/actor/parts/explorer/effects.hbs',
      scrollable: [""],
    },
    biography: {
      template: 'systems/miniD6/templates/actor/parts/explorer/biography.hbs',
      scrollable: [""],
    },
    inventory: {
      template: 'systems/miniD6/templates/actor/parts/explorer/inventory.hbs',
      scrollable: [""],
    },
  };
  
  /** @override */
  _configureRenderOptions(options) {
    // Add the current documents' actor type to the css classes.
    if (!this.options.classes.includes(this.document.type))
      this.options.classes.push(this.document.type);
    
    super._configureRenderOptions(options);
    // Not all parts always render
    options.parts = [];
    // Don't show the other tabs if only limited view
    if (this.document.limited) return;
    // Control which parts show based on document subtype
    switch (this.document.type) {
      case 'explorer':
      options.parts.push('header', 'tabs', 'inventory', 'effects', 'biography');
      break;
      case 'npc':
      options.parts.push('header');
      break;
      case 'creature':
      options.parts.push('header');
      break;
    }
  }
  
  /* -------------------------------------------- */
  
  /** @override */
  async _prepareContext(options) {
    // Output initialization
    const context = {
      // Validates both permissions and compendium status
      editable: this.isEditable,
      owner: this.document.isOwner,
      limited: this.document.limited,
      // Add the actor document.
      actor: this.actor,
      // Add the actor's data to context.data for easier access, as well as flags.
      system: this.actor.system,
      flags: this.actor.flags,
      // Adding a pointer to CONFIG.MINID6
      config: CONFIG.MINID6,
      tabs: this._getTabs(options.parts),
      // Necessary for formInput and formFields helpers
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
    };
    
    // Offloading context prep to a helper function
    this._prepareItems(context);
    
    return context;
  }
  
  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
      case 'inventory':
      break;
    }
    
    context.tab = context.tabs[partId];
    return context;
  }
  
  /**
  * Generates the data for the generic tab navigation template
  * @param {string[]} parts An array of named template parts to render
  * @returns {Record<string, Partial<ApplicationTab>>}
  * @protected
  */
  _getTabs(parts) {
    // If you have sub-tabs this is necessary to change
    const tabGroup = 'primary';
    
    // Default tab for first time it's rendered this session
    if (!this.tabGroups[tabGroup])
      this.tabGroups[tabGroup] = 'special-ability';
    
    return parts.reduce((tabs, partId) => {
      const tab = {
        cssClass: '',
        group: tabGroup,
        // Matches tab property to
        id: '',
        // FontAwesome Icon, if you so choose
        icon: '',
        tooltip: 'MINID6.Actor.Tabs.Tooltips.',
        // Run through localization
        label: 'MINID6.Actor.Tabs.',
      };
      switch (partId) {
        case 'header':
        case 'tabs':
        return tabs;
        case 'biography':
        tab.id = 'biography';
        tab.label += 'Biography';
        tab.tooltip += 'Biography';
        break;
        case 'features':
        tab.id = 'features';
        tab.label += 'Features';
        tab.tooltip += 'Features';
        break;
        case 'gear':
        tab.id = 'gear';
        tab.label += 'Gear';
        tab.tooltip += 'Gear';
        break;
        case 'effects':
        tab.id = 'effects';
        tab.label += 'Effects';
        tab.tooltip += 'Effects';
        break;
        case 'inventory':
        tab.id = 'inventory';
        tab.label += 'Inventory';
        tab.tooltip += 'Inventory';
        break;
        default:
        let config = partId;
        if (this.constructor.TABS_CONFIGURATION[partId])
          config = this.constructor.TABS_CONFIGURATION[partId];
        
        tab.id = config.toLowerCase();
        tab.label += `${config.charAt(0).toUpperCase()}${config.substring(1)}`;
      }
      
      if (this.tabGroups[tabGroup] === tab.id) tab.cssClass = 'active';
      tabs[partId] = tab;
      return tabs;
    }, {});
  }
  
  /**
  * Organize and classify Items for Actor sheets.
  *
  * @param {object} context The context object to mutate
  */
  _prepareItems(context) {
    const equipments = [];
    const weapons = [];
    const effects = [];

    console.log(this.document.items);
    
    
    for (let i of this.document.items) {
      if (i.type === 'weapon') {
        weapons.push(i);
        continue;
      }
      if (i.type === 'equipment') {
        equipments.push(i);
        continue;
      }
      if (i.type === 'effect') {
        effects.push(i);
        continue;
      }
    }
    
    // Sort then assign
    context.equipments = equipments.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    context.weapons = weapons.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    context.effects = effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    
    return context;
  }
  
  /**
  * Actions performed after any render of the Application.
  * Post-render steps are not awaited by the render process.
  * @param {ApplicationRenderContext} context      Prepared context data
  * @param {RenderOptions} options                 Provided render options
  * @protected
  * @override
  */
  async _onRender(context, options) {
    await super._onRender(context, options);
    this.#disableOverrides();
    // You may want to add other special handling here
    // Foundry comes with a large number of utility classes, e.g. SearchFilter
    // That you may want to implement yourself.
  }
  
  
  /* -------------------------------------------------- */
  /*   Application Life-Cycle Events                    */
  /* -------------------------------------------------- */
  
  /**
  * Actions performed after a first render of the Application.
  * @param {ApplicationRenderContext} context      Prepared context data
  * @param {RenderOptions} options                 Provided render options
  * @protected
  */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    
    this._createContextMenu(this._getItemButtonContextOptions, "[data-document-class]");
    //, { hookName: "getItemButtonContextOptions", parentClassHooks: false, fixed: true }
  }
  
  /**
  * Get context menu entries for item buttons.
  * @returns {ContextMenuEntry[]}
  * @protected
  */
  _getItemButtonContextOptions() {
    // name is auto-localized
    return [
      {
        name: "Edit",
        icon: "<i class=\"fa-solid fa-fw fa-edit\"></i>",
        condition: (target) => {
          let item = this._getEmbeddedDocument(target);
          return true;
        },
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          if (!item) {
            console.error("Could not find item");
            return;
          }
          await item.sheet.render({ force: true });
        },
      },
      {
        name: "Delete",
        icon: "<i class=\"fa-solid fa-fw fa-trash\"></i>",
        condition: (target) => {
          let item = this._getEmbeddedDocument(target);
          return this.actor.isOwner;
        },
        callback: async (target) => {
          const item = this._getEmbeddedDocument(target);
          if (!item) {
            console.error("Could not find item");
            return;
          }
          await item.deleteDialog();
        },
      },
    ];
  }
  
  /**************
  *
  *   ACTIONS
  *
  **************/
  
  /**
  * Handle changing a Document's image.
  *
  * @this MiniD6ActorSheet
  * @param {PointerEvent} event   The originating click event
  * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
  * @returns {Promise}
  * @protected
  */
  static async _onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, attr);
    const { img } =
    this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
    {};
    const fp = new FilePicker({
      current,
      type: 'image',
      redirectToRoot: img ? [img] : [],
      callback: (path) => {
        this.document.update({ [attr]: path });
      },
      top: this.position.top + 40,
      left: this.position.left + 10,
    });
    return fp.browse();
  }
  
  
  /**
  * Handle item select in inventory grid.
  *
  * @this MiniD6ActorSheet
  * @param {PointerEvent} event   The originating click event
  * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
  * @protected
  */
  static async _onSelectItem(event, target) {
    let $item = $(target);
    let $activeTab = $(this.document.sheet.form).find('section.tab.active');
    let $itemGrid = $activeTab.find('div.item');
    let $propertyTab = $activeTab.find('div.item-properties');

    const itemDocument = fromUuidSync(target.dataset.itemUuid);
    
    function sanitizeSelection() {
      $itemGrid.each(function() {
        let $elem = $(this);
        if ($elem.hasClass('selected')) $elem.removeClass('selected');
      });
    }
    
    async function toggleProps(isActive, item = null) {
      $propertyTab.empty();
      
      const templateData = isActive 
        ? {
            selection: 'active',
            item: item
          }
        : { selection: 'inactive' };
      
      const html = await renderTemplate(
        'systems/miniD6/templates/actor/parts/explorer/partials/inv-item-properties.hbs',
        templateData
      );

      if (isActive) $propertyTab.addClass('active');
      else $propertyTab.removeClass('active');

      $propertyTab.append(html);
    }
    
    // Remove selection
    if ($item.hasClass('grid-items')) { 
      sanitizeSelection();
      await toggleProps(false);
      return;
    }
    
    // Toggle
    if ($item.hasClass('selected')) {
      await toggleProps(false);
      $item.removeClass('selected');
    }
    else {
      sanitizeSelection();
      await toggleProps(true, itemDocument);;
      $(target).addClass('selected');
    }
    
  }
  
  /**
  * Renders an embedded document's sheet
  *
  * @this MiniD6ActorSheet
  * @param {PointerEvent} event   The originating click event
  * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
  * @protected
  */
  static async _viewDoc(event, target) {
    const doc = this._getEmbeddedDocument(target);
    doc.sheet.render(true);
  }
  
  /**
  * Handles item deletion
  *
  * @this MiniD6ActorSheet
  * @param {PointerEvent} event   The originating click event
  * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
  * @protected
  */
  static async _deleteDoc(event, target) {
    const doc = this._getEmbeddedDocument(target);
    await doc.delete();
  }
  
  /**
  * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset
  *
  * @this MiniD6ActorSheet
  * @param {PointerEvent} event   The originating click event
  * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
  * @private
  */
  static async _createDoc(event, target) {
    // Retrieve the configured document class for Item or ActiveEffect
    const docCls = getDocumentClass(target.dataset.documentClass);
    // Prepare the document creation data by initializing it a default name.
    const docData = {
      name: docCls.defaultName({
        // defaultName handles an undefined type gracefully
        type: target.dataset.type,
        parent: this.actor,
      }),
    };
    // Loop through the dataset and add it to our docData
    for (const [dataKey, value] of Object.entries(target.dataset)) {
      // These data attributes are reserved for the action handling
      if (['action', 'documentClass'].includes(dataKey)) continue;
      // Nested properties require dot notation in the HTML, e.g. anything with `system`
      // An example exists in spells.hbs, with `data-system.spell-level`
      // which turns into the dataKey 'system.spellLevel'
      foundry.utils.setProperty(docData, dataKey, value);
    }
    
    // Finally, create the embedded document!
    await docCls.create(docData, { parent: this.actor });
  }
  
  /**
  * Determines effect parent to pass to helper
  *
  * @this MiniD6ActorSheet
  * @param {PointerEvent} event   The originating click event
  * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
  * @private
  */
  static async _toggleEffect(event, target) {
    const effect = this._getEmbeddedDocument(target);
    await effect.update({ disabled: !effect.disabled });
  }
  
  /**
  * Handle clickable rolls.
  *
  * @this MiniD6ActorSheet
  * @param {PointerEvent} event   The originating click event
  * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
  * @protected
  */
  static async _onRoll(event, target) {
    event.preventDefault();
    const dataset = target.dataset;
    
    // Handle item rolls.
    switch (dataset.rollType) {
      case 'item':
      const item = this._getEmbeddedDocument(target);
      if (item) return item.roll();
    }
    
    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
  
  /** Helper Functions */
  
  /**
  * Fetches the embedded document representing the containing HTML element
  *
  * @param {HTMLElement} target    The element subject to search
  * @returns {Item | ActiveEffect} The embedded Item or ActiveEffect
  */
  _getEmbeddedDocument(target) {
    const docRow = target.closest('div[data-document-class]');
    if (docRow.dataset.documentClass === 'Item') {
      return this.actor.items.get(docRow.dataset.itemId);
    } else if (docRow.dataset.documentClass === 'ActiveEffect') {
      const parent =
      docRow.dataset.parentId === this.actor.id
      ? this.actor
      : this.actor.items.get(docRow?.dataset.parentId);
      return parent.effects.get(docRow?.dataset.effectId);
    } else return console.warn('Could not find document class');
  }
  
  /***************
  *
  * Drag and Drop
  *
  ***************/
  
  /**
  * Handle the dropping of ActiveEffect data onto an Actor Sheet
  * @param {DragEvent} event                  The concluding DragEvent which contains drop data
  * @param {object} data                      The data transfer extracted from the event
  * @returns {Promise<ActiveEffect|boolean>}  The created ActiveEffect object or false if it couldn't be created.
  * @protected
  */
  async _onDropActiveEffect(event, data) {
    const aeCls = getDocumentClass('ActiveEffect');
    const effect = await aeCls.fromDropData(data);
    if (!this.actor.isOwner || !effect) return false;
    if (effect.target === this.actor)
      return this._onSortActiveEffect(event, effect);
    return aeCls.create(effect, { parent: this.actor });
  }
  
  /**
  * Handle a drop event for an existing embedded Active Effect to sort that Active Effect relative to its siblings
  *
  * @param {DragEvent} event
  * @param {ActiveEffect} effect
  */
  async _onSortActiveEffect(event, effect) {
    /** @type {HTMLElement} */
    const dropTarget = event.target.closest('[data-effect-id]');
    if (!dropTarget) return;
    const target = this._getEmbeddedDocument(dropTarget);
    
    // Don't sort on yourself
    if (effect.uuid === target.uuid) return;
    
    // Identify sibling items based on adjacent HTML elements
    const siblings = [];
    for (const el of dropTarget.parentElement.children) {
      const siblingId = el.dataset.effectId;
      const parentId = el.dataset.parentId;
      if (
        siblingId &&
        parentId &&
        (siblingId !== effect.id || parentId !== effect.parent.id)
      )
      siblings.push(this._getEmbeddedDocument(el));
    }
    
    // Perform the sort
    const sortUpdates = SortingHelpers.performIntegerSort(effect, {
      target,
      siblings,
    });
    
    // Split the updates up by parent document
    const directUpdates = [];
    
    const grandchildUpdateData = sortUpdates.reduce((items, u) => {
      const parentId = u.target.parent.id;
      const update = { _id: u.target.id, ...u.update };
      if (parentId === this.actor.id) {
        directUpdates.push(update);
        return items;
      }
      if (items[parentId]) items[parentId].push(update);
      else items[parentId] = [update];
      return items;
    }, {});
    
    // Effects-on-items updates
    for (const [itemId, updates] of Object.entries(grandchildUpdateData)) {
      await this.actor.items
      .get(itemId)
      .updateEmbeddedDocuments('ActiveEffect', updates);
    }
    
    // Update on the main actor
    return this.actor.updateEmbeddedDocuments('ActiveEffect', directUpdates);
  }
  
  /**
  * Handle dropping of an Actor data onto another Actor sheet
  * @param {DragEvent} event            The concluding DragEvent which contains drop data
  * @param {object} data                The data transfer extracted from the event
  * @returns {Promise<object|boolean>}  A data object which describes the result of the drop, or false if the drop was
  *                                     not permitted.
  * @protected
  */
  async _onDropActor(event, data) {
    if (!this.actor.isOwner) return false;
  }
  
  /* -------------------------------------------- */
  
  /**
  * Handle dropping of a Folder on an Actor Sheet.
  * The core sheet currently supports dropping a Folder of Items to create all items as owned items.
  * @param {DragEvent} event     The concluding DragEvent which contains drop data
  * @param {object} data         The data transfer extracted from the event
  * @returns {Promise<Item[]>}
  * @protected
  */
  async _onDropFolder(event, data) {
    if (!this.actor.isOwner) return [];
    const folder = await Folder.implementation.fromDropData(data);
    if (folder.type !== 'Item') return [];
    const droppedItemData = await Promise.all(
      folder.contents.map(async (item) => {
        if (!(document instanceof Item)) item = await fromUuid(item.uuid);
        return item;
      })
    );
    return this._onDropItemCreate(droppedItemData, event);
  }
  
  /**
  * Handle the final creation of dropped Item data on the Actor.
  * This method is factored out to allow downstream classes the opportunity to override item creation behavior.
  * @param {object[]|object} itemData      The item data requested for creation
  * @param {DragEvent} event               The concluding DragEvent which provided the drop data
  * @returns {Promise<Item[]>}
  * @private
  */
  async _onDropItemCreate(itemData, event) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    return this.actor.createEmbeddedDocuments('Item', itemData);
  }
  
  /********************
  *
  * Actor Override Handling
  *
  ********************/
  
  /**
  * Submit a document update based on the processed form data.
  * @param {SubmitEvent} event                   The originating form submission event
  * @param {HTMLFormElement} form                The form element that was submitted
  * @param {object} submitData                   Processed and validated form data to be used for a document update
  * @returns {Promise<void>}
  * @protected
  * @override
  */
  async _processSubmitData(event, form, submitData) {
    const overrides = foundry.utils.flattenObject(this.actor.overrides);
    for (let k of Object.keys(overrides)) delete submitData[k];
    await this.document.update(submitData);
  }
  
  /**
  * Disables inputs subject to active effects
  */
  #disableOverrides() {
    const flatOverrides = foundry.utils.flattenObject(this.actor.overrides);
    for (const override of Object.keys(flatOverrides)) {
      const input = this.element.querySelector(`[name="${override}"]`);
      if (input) {
        input.disabled = true;
      }
    }
  }
}
