import UnifiedActorBase from './base-actor.mjs';

export default class UnifiedExplorer extends UnifiedActorBase {
  static LOCALIZATION_PREFIXES = [
    ...super.LOCALIZATION_PREFIXES,
    'UNIFIED.Actor.Character',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.think = new fields.NumberField({
        ...requiredInteger,
        initial: 6,
        min: 0,
        max: 10,
    }),

    schema.age = new fields.NumberField({ 
      ...requiredInteger,
      initial: 20,
      min: 20,
      max: 80
    });

    schema.notes = new fields.HTMLField();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
      }),
    });



    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor(
        (this.abilities[key].value - 10) / 2
      );
      // Handle ability label localization.
      this.abilities[key].label =
        game.i18n.localize(CONFIG.UNIFIED.abilities[key]) ?? key;
    }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;

    return data;
  }
}
