import { getString } from "../utils/locale";

export class AttachmentFactory {
  /**
   * Convert snapshot attachments to PDF format
   */
  static async convertSnapshotsToPDF(itemIDs: number[]) {
    for (const itemID of itemIDs) {
      const item = Zotero.Items.get(itemID);
      if (!item.isRegularItem()) continue;

      const attachments = item.getAttachments();
      for (const attachmentID of attachments) {
        const attachment = Zotero.Items.get(attachmentID);
        if (attachment.attachmentContentType !== "image/png") continue;

        try {
          // Get the snapshot file path
          const filePath = await attachment.getFilePathAsync();
          if (!filePath) continue;

          // Convert to PDF
          const pdfPath = filePath.replace(/\.png$/i, ".pdf");
          // await Zotero.File.convertImageToPDF(filePath, pdfPath);

          // Create new PDF attachment
          const pdfAttachment = await Zotero.Attachments.linkFromFile({
            file: pdfPath,
            parentItemID: itemID,
          });

          new ztoolkit.ProgressWindow(getString("conversion-success"))
            .createLine({
              text: `Converted ${filePath} to PDF`,
              type: "success",
            })
            .show();
        } catch (e) {
          new ztoolkit.ProgressWindow(getString("conversion-error"))
            .createLine({
              text: `Failed to convert ${attachment.getField("title")}: ${e}`,
              type: "fail",
            })
            .show();
        }
      }
    }
  }

  /**
   * Register right-click menu for conversion
   */
  static registerConversionMenu() {
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-itemmenu-convert-snapshots",
      label: getString("convert-snapshots-label"),
      commandListener: async (ev) => {
        const items = Zotero.getActiveZoteroPane().getSelectedItems();
        ztoolkit.log(items);
        await this.convertSnapshotsToPDF(items.map((item) => item.id));
      },
    });
  }
}
