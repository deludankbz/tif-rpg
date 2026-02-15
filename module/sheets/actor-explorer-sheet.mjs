import { MiniD6ActorSheet } from "./actor-sheet.mjs";

export class MiniD6ActorExplorerSheet extends MiniD6ActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ['simple'],
    position: {
      width: 400,
      height: 800,
    },
    defaultTab: "stats",
    submitOnClose: true,
    submitOnChange: true,
  };
}