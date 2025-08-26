import { createClient } from "@supabase/supabase-js";

// Create and export a singleton client instance
export const supabase = createClient(
  "https://xcfykovekrjjrfkygtrj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjZnlrb3Zla3JqanJma3lndHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxOTkxMzUsImV4cCI6MjA3MTc3NTEzNX0.x_HT9tkjlIdyLeEKm5qdT7whUSstkdXmKM6XzUpvZbY"
);

export default supabase;
