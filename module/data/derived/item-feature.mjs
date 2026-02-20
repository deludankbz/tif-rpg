import TIFItemBase from '../base-item.mjs';

export default class TIFFeature extends TIFItemBase {
  static LOCALIZATION_PREFIXES = [
    'TIF.Item.base',
    'TIF.Item.Feature',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    return schema;
  }
}
