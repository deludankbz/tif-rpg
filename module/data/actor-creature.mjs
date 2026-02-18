import MiniD6ActorBase from './base-actor.mjs';

export default class MiniD6Creature extends MiniD6ActorBase {
  static LOCALIZATION_PREFIXES = [
    ...super.LOCALIZATION_PREFIXES,
    'MINID6.Actor.CREATURE',
  ];

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.health = new fields.NumberField({
      ...requiredInteger,
      initial: 1,
      min: 0,
    });

    return schema;
  }
}
