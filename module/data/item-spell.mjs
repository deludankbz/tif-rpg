import MiniD6ItemBase from './base-item.mjs';

export default class MiniD6Spell extends MiniD6ItemBase {
  static LOCALIZATION_PREFIXES = [
    'MINID6.Item.base',
    'MINID6.Item.Spell',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.spellLevel = new fields.NumberField({
      required: true,
      nullable: false,
      integer: true,
      initial: 1,
      min: 0,
      max: 9,
    });

    return schema;
  }
}
