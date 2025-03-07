-- Migration file to create user_preferences table
-- Run this in your Supabase SQL Editor

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL,
  cat_name VARCHAR NOT NULL,
  frequency VARCHAR NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  last_update_sent TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cat_image_url TEXT NOT NULL,
  selected_toy VARCHAR NOT NULL,
  memory_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Adding constraints
  CONSTRAINT unique_email_cat_name UNIQUE (email, cat_name)
);

-- Create index for faster querying by email
CREATE INDEX IF NOT EXISTS idx_user_preferences_email ON user_preferences(email);

-- Create index for querying due updates
CREATE INDEX IF NOT EXISTS idx_user_preferences_frequency_last_update ON user_preferences(frequency, last_update_sent);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting data
CREATE POLICY insert_user_preferences ON user_preferences
  FOR INSERT WITH CHECK (true);

-- Create policy to allow selecting own data
CREATE POLICY select_user_preferences ON user_preferences
  FOR SELECT USING (true);

-- Create policy to allow updating own data
CREATE POLICY update_user_preferences ON user_preferences
  FOR UPDATE USING (true);
