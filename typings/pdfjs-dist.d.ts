declare module "pdfjs-dist" {
  export function getDocument(options: { data: Uint8Array }): {
    promise: Promise<PDFDocumentProxy>;
  };

  interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  interface TextContent {
    items: TextItem[];
  }

  interface TextItem {
    str: string;
  }
}
