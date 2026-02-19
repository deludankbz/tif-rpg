export default class TIFItemBase extends foundry.abstract
  .TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.HTMLField();

    schema.playMode = new fields.BooleanField();

    return schema;
  }
}
