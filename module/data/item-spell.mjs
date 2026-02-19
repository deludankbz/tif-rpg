import TIFItemBase from './base-item.mjs';

export default class TIFSpell extends TIFItemBase {
  static LOCALIZATION_PREFIXES = [
    'TIF.Item.base',
    'TIF.Item.Spell',
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
