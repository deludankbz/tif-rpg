import { UnifiedActorSheet } from "./actor-sheet.mjs";

export class UnifiedActorNpcSheet extends UnifiedActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ['simple'],
    position: {
      width: 400,
      height: 800,
    }
  };
}