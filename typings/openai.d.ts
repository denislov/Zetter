declare module "openai" {
  export interface CreateEmbeddingRequest {
    model: string;
    input: string | string[];
  }

  export interface Embedding {
    embedding: number[];
    index: number;
    object: string;
  }

  export interface CreateEmbeddingResponse {
    data: Embedding[];
    model: string;
    object: string;
    usage: {
      prompt_tokens: number;
      total_tokens: number;
    };
  }

  export class OpenAI {
    constructor(config: { baseURL?: string; apiKey: string });

    embeddings: {
      create(request: CreateEmbeddingRequest): Promise<CreateEmbeddingResponse>;
    };
  }
}
