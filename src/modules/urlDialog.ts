import { config } from "../../package.json";
import { getString } from "../utils/locale";

export class URLInputDialog {
  private window: Window;
  private dialog: Window;

  constructor() {
    this.window = Zotero.getMainWindow();
  }

  public open() {
    // 创建对话框 HTML 内容
    const dialogContent = `
      <div style="padding: 20px;">
        <form id="snapshot-form">
          <div style="margin-bottom: 15px;">
            <label for="url-input" style="display: block; margin-bottom: 5px;">Enter webpage URL:</label>
            <input type="url" id="url-input" style="width: 100%; padding: 5px;" 
                   required placeholder="https://example.com">
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" id="cancel-button">Cancel</button>
            <button type="submit" id="save-button">Save Snapshot</button>
          </div>
        </form>
      </div>
    `;

    // 创建对话框参数
    const params: any = {
      dataIn: {
        url: "",
        accepted: false,
      },
      dataOut: null,
    };

    // 打开对话框
    this.dialog = this.window.openDialog(
      rootURI + "content/dialog/dialog.html",
      "",
      "chrome,centerscreen,resizable=false,width=500,height=200",
      params,
    );

    // 设置对话框内容和事件监听
    this.dialog.addEventListener("load", () => {
      const doc = this.dialog.document;

      // 设置对话框标题
      doc.title = getString("snapshot-dialog.title");

      // 插入自定义内容
      const container = doc.querySelector(".dialog-content");
      container.innerHTML = dialogContent;

      // 表单提交处理
      const form = doc.getElementById("snapshot-form") as HTMLFormElement;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const urlInput = doc.getElementById("url-input") as HTMLInputElement;
        params.dataOut = {
          url: urlInput.value,
          accepted: true,
        };
        this.dialog.close();
      });

      // 取消按钮处理
      const cancelButton = doc.getElementById("cancel-button");
      cancelButton.addEventListener("click", () => {
        params.dataOut = {
          accepted: false,
        };
        this.dialog.close();
      });

      // 自动聚焦到 URL 输入框
      const urlInput = doc.getElementById("url-input") as HTMLInputElement;
      urlInput.focus();
    });

    // 等待对话框关闭
    if (params.dataOut?.accepted) {
      this.saveSnapshot(params.dataOut.url);
    }
  }

  async saveSnapshot(url: string) {
    try {
      // 创建新的 webpage 类型条目
      const item = new Zotero.Item("webpage");

      // 获取网页内容
      const response = await fetch(url);
      const html = await response.text();

      // 设置基本元数据
      item.setField("title", this.extractTitle(html));
      item.setField("url", url);
      item.setField("accessDate", Zotero.Date.dateToSQL(new Date(), true));

      await item.saveTx();

      // 保存网页内容作为附件
      const attachment = await Zotero.Attachments.importFromURL({
        url: url,
        parentItemID: item.id,
        contentType: "text/html",
        title: item.getField("title"),
      });

      // 选中新创建的条目
      const zp = Zotero.getActiveZoteroPane();
      zp.selectItem(item.id);

      Zotero.debug(`Web Snapshot: Successfully saved ${url}`);
    } catch (error) {
      Zotero.debug(`Web Snapshot error: ${error}`);
      this.window.alert(getString("snapshot.error"));
    }
  }

  private extractTitle(html: string): string {
    const match = html.match(/<title>(.*?)<\/title>/i);
    return match ? match[1] : getString("snapshot.untitled");
  }
}
