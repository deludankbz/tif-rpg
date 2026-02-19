import { TIFActorSheet } from "./actor-sheet.mjs";

export class TIFActorNpcSheet extends TIFActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ['simple'],
    position: {
      width: 400,
      height: 800,
    }
  };
}