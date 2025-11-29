import UnifiedDataModel from "./base-model.mjs";

export default class UnifiedItemBase extends UnifiedDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.StringField({ required: true, blank: true });

    return schema;
  }

}