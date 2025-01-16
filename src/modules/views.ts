import { config } from "../../package.json";
import { getString } from "../utils/locale";
import { URLInputDialog } from "./urlDialog";

export async function registerViews(window: Window) {
  // 注册工具栏按钮
  ztoolkit.UI.createElement(window.document, "button", {
    id: `${config.addonRef}-toolbar-button`,
    listeners: [
      {
        type: "click",
        listener: (e) => {
          const dialog = new URLInputDialog();
          dialog.open();
          dialog.saveSnapshot(
            "https://blog.csdn.net/qq_43210428/article/details/120384547",
          );
        },
      },
    ],
  });
}
