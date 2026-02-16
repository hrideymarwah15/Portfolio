import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "./embedding";

export async function getContext(query: string): Promise<string> {
  const supabase = await createClient();
  const embedding = await generateEmbedding(query);

  const { data: documents } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5,
  });

  if (!documents) return "";

  return documents
    .map((doc: any) => doc.content)
    .join("\n---\n");
}
