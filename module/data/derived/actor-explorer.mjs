import TIFActorBase from '../base-actor.mjs';

export default class TIFExplorer extends TIFActorBase {
  static LOCALIZATION_PREFIXES = [
    ...super.LOCALIZATION_PREFIXES,
    'TIF.Actor.Character',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    // Define base stats
    schema.stats = new fields.SchemaField({
      body: new fields.NumberField({
        ...requiredInteger,
        initial: 20,
        min: 20,
        max: 80
      }),
      spirt: new fields.NumberField({ 
        ...requiredInteger,
        initial: 20,
        min: 20,
        max: 80
      }),
      mind: new fields.NumberField({ 
        ...requiredInteger,
        initial: 20,
        min: 20,
        max: 80
      })
    })

    // Create field for derived stats
    // schema.derived = new fields.SchemaField({});

    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.stats) {
      console.warn(key);
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
