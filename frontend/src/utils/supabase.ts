import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to hardcoded values for development
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://hojcilohrcdjfdrpfnwd.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvamNpbG9ocmNkamZkcnBmbndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MzQzMTcsImV4cCI6MjA1NDExMDMxN30.ZiW20D9UuF0pcrmJqfhpJiQOdW8-6a6QyxHn56iB8l0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);