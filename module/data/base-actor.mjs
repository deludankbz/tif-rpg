export default class TIFActorBase extends foundry.abstract
  .TypeDataModel {
  static LOCALIZATION_PREFIXES = ["TIF.Actor.base"];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.playMode = new fields.BooleanField();

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
