import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { URLInputDialog } from "./urlDialog";

export default class Views {
  private id = "zotero-zetter-container";
  constructor() {
    this.registerViews();
  }
  private registerViews() {
    const papersgptNode = Zotero.getMainWindow().document.querySelector(
      "#" + this.id,
    )!;
    if (papersgptNode) {
      return;
    }
    const toolbar = Zotero.getMainWindow().document.querySelector(
      "#zotero-items-toolbar",
    )!;
    const lookupNode = toolbar.querySelector("#zotero-tb-lookup")!;
    const newNode = lookupNode?.cloneNode(true) as XULToolBarButtonElement;
    newNode.setAttribute("id", this.id);
    newNode.setAttribute("tooltiptext", "Zotero Better Plugin");
    newNode.setAttribute("command", "");
    newNode.setAttribute("oncommand", "");
    newNode.setAttribute("mousedown", "");
    newNode.setAttribute("onmousedown", "");
    newNode.addEventListener("click", async (event: any) => {
      const papersgptState = Zotero.Prefs.get(
        `${config.addonRef}.papersgptState`,
      );
      const dialog = new URLInputDialog();
      dialog.open();
    });
    const searchNode = toolbar.querySelector("#zotero-tb-search");
    newNode.style.listStyleImage = `url(chrome://${config.addonRef}/content/icons/favicon.png)`;
    toolbar.insertBefore(newNode, searchNode);
  }
}
