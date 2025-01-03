declare module "ollama" {
  export interface EmbeddingResponse {
    embedding: number[];
  }

  export interface EmbeddingOptions {
    model: string;
    prompt: string;
  }

  export class Ollama {
    constructor(config?: { baseUrl?: string });
    embeddings(options: EmbeddingOptions): Promise<EmbeddingResponse>;
  }
}
