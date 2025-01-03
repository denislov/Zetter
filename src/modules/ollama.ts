import { Ollama } from "ollama";

const ollama = new Ollama({
  baseUrl: "http://localhost:11434",
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ollama.embeddings({
      model: "llama2",
      prompt: text,
    });
    return response.embedding;
  } catch (e) {
    ztoolkit.log("Error generating embedding", e);
    return [];
  }
}
