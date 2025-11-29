export default class UnifiedActorBase extends foundry.abstract
  .TypeDataModel {
  static LOCALIZATION_PREFIXES = ["UNIFIED.Actor.base"];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.vigor = new fields.NumberField({
      ...requiredInteger,
      initial: 6,
      min: 0,
      max: 10
    });

    schema.oneiric = new fields.NumberField({
      ...requiredInteger,
      initial: 6,
      min: 0,
      max: 10,
    }),

    schema.biography = new fields.HTMLField();

    return schema;
  }
}
