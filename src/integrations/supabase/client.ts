// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ljjlykhcxiksyzxbfkiw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqamx5a2hjeGlrc3l6eGJma2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NDg1ODQsImV4cCI6MjA1MDQyNDU4NH0.9hCqq4vxWIl8uKcoRvD9mvD-3tjJuKyANQqROUY859w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);