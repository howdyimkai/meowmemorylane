import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hojcilohrcdjfdrpfnwd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvamNpbG9ocmNkamZkcnBmbndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MzQzMTcsImV4cCI6MjA1NDExMDMxN30.ZiW20D9UuF0pcrmJqfhpJiQOdW8-6a6QyxHn56iB8l0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);