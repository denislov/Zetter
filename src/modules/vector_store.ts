import { getLocaleID, getString } from "../utils/locale";
// import weaviate, { WeaviateClient } from "weaviate-ts-client";

import { getDocument } from "pdfjs-dist";
import { OpenAI } from "openai";
// import { MilvusClient } from "@zilliz/milvus2-sdk-node";

export class VectorStore {
  // private client: ReturnType<typeof weaviate.client>;
  // private openai: OpenAI;
  // private className = "ZoteroItem";
  private CLUSTER_ENDPOINT = "http://localhost:19530";

  constructor() {
    ztoolkit.log("init vector store");
    // this.openai = new OpenAI({
    //   baseURL: "http://localhost:11434/v1", // Ollama compatible API
    //   apiKey: "ollama", // Required but unused
    // });
    // this.initSchema();
  }

  async listCollections() {
    try {
      const response = await fetch(
        this.CLUSTER_ENDPOINT + "/v2/vectordb/collections/list",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            dbName: "_default",
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      ztoolkit.log("Collections list:", data);
      ztoolkit.log(Zotero.PDFWorker.getFullText);

      return data;
    } catch (error) {
      ztoolkit.log("Error listing collections:", error);
    }
  }

  // private async initSchema() {
  //   const schemaConfig = {
  //     class: this.className,
  //     vectorizer: "none", // We'll use Ollama for embeddings
  //     properties: [
  //       {
  //         name: "title",
  //         dataType: ["string"],
  //       },
  //       {
  //         name: "content",
  //         dataType: ["text"],
  //       },
  //       {
  //         name: "itemId",
  //         dataType: ["string"],
  //       },
  //       {
  //         name: "vector",
  //         dataType: ["number[]"],
  //       },
  //     ],
  //   };

  //   try {
  //     await this.client.schema.classCreator().withClass(schemaConfig).do();
  //   } catch (e) {
  //     ztoolkit.log("Schema already exists or error creating schema", e);
  //   }
  // }

  // async storeItem(item: Zotero.Item) {
  //   const attachmentId = item
  //     .getAttachments()
  //     .find(
  //       (id) =>
  //         Zotero.Items.get(id).attachmentContentType === "application/pdf",
  //     );

  //   if (!attachmentId) return;

  //   const pdfAttachment = Zotero.Items.get(attachmentId) as Zotero.Item & {
  //     contentType: string;
  //   };

  //   if (!pdfAttachment?.contentType) return;

  //   const pdfText = await this.extractPdfText(pdfAttachment);
  //   const embedding = await this.getEmbedding(pdfText);

  //   await this.client.data
  //     .creator()
  //     .withClassName(this.className)
  //     .withProperties({
  //       title: item.getField("title"),
  //       content: pdfText,
  //       itemId: item.id,
  //       vector: embedding,
  //     })
  //     .do();
  // }

  private async extractPdfText(
    attachment: Zotero.Item & { contentType: string },
  ): Promise<string> {
    try {
      const file = Zotero.getFile(attachment.id);
      if (!file) return "";

      const pdfData = await file.readBinary();
      const pdfDoc = await getDocument({
        data: new Uint8Array(pdfData),
      }).promise;

      let text = "";
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ");
      }

      return text;
    } catch (e) {
      ztoolkit.log("Error extracting PDF text", e);
      return "";
    }
  }

  // private async getEmbedding(text: string): Promise<number[]> {
  //   const response = await this.openai.embeddings.create({
  //     model: "llama2",
  //     input: text,
  //   });
  //   return response.data[0].embedding;
  // }

  static registerRightClickMenuItem() {
    const menuIcon = `chrome://${addon.data.config.addonRef}/content/icons/favicon@0.5x.png`;
    // const client = weaviate.client({ scheme: "http", host: "localhost:8080" });
    // item menuitem with icon
    ztoolkit.Menu.register("item", {
      tag: "menuitem",
      id: "zotero-itemmenu-addontemplate-store-vector",
      label: getString("mmenu-store-vector"),
      commandListener: (ev) => {},
      icon: menuIcon,
    });
    // ztoolkit.Menu.register("item", {
    //   tag: "menuitem",
    //   id: "zotero-itemmenu-addonzetter-store-vector",
    //   label: getString("menu-store-vector"),
    //   icon: menuIcon,
    //   commandListener: (ev) => {
    //     const vectorStore = new VectorStore();
    //     const popwin = new ztoolkit.ProgressWindow(addon.data.config.addonName)
    //       .createLine({
    //         text: "Item storing!",
    //         type: "default",
    //         progress: 30,
    //       })
    //       .show();
    //     // await Zotero.Promise.delay(1000);
    //     // vectorStore.storeItem(item);
    //     popwin.changeLine({
    //       text: "Item stored in vector database!",
    //       type: "success",
    //       progress: 100,
    //     });
    //   },
    // });
  }
}
