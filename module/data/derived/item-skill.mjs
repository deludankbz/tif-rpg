import TIFItemBase from '../base-item.mjs';

export default class TIFSkill extends TIFItemBase {
  static LOCALIZATION_PREFIXES = [
    'TIF.Item.base',
    'TIF.Item.Skill',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    return schema;
  }
}
