import { TIFActorSheet } from "./actor-sheet.mjs";

export class TIFActorExplorerSheet extends TIFActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ['simple'],
    position: {
      width: 600,
      height: 900,
    },
    defaultTab: "stats",
    submitOnClose: true,
    submitOnChange: true,
  };
}
