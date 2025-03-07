import { supabase } from '../supabase';

// Interface for user preferences
export interface UserPreference {
  id?: string;
  email: string;
  cat_name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  last_update_sent?: string; // ISO date string
  cat_image_url: string;
  selected_toy: string;
  memory_text: string;
  created_at?: string;
}

/**
 * Save user preferences to Supabase
 */
export async function saveUserPreferences(preferences: Omit<UserPreference, 'id' | 'created_at' | 'last_update_sent'>): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .insert([
        {
          email: preferences.email,
          cat_name: preferences.cat_name,
          frequency: preferences.frequency,
          cat_image_url: preferences.cat_image_url,
          selected_toy: preferences.selected_toy,
          memory_text: preferences.memory_text,
          last_update_sent: new Date().toISOString() // Set initial value to now (since we send first email immediately)
        }
      ])
      .select();

    return { data, error };
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return { data: null, error };
  }
}

/**
 * Get user preferences by email
 */
export async function getUserPreferencesByEmail(email: string): Promise<{ data: UserPreference[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('email', email);

    return { data, error };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return { data: null, error };
  }
}

/**
 * Update the last_update_sent timestamp for a user
 */
export async function updateLastUpdateSent(id: string): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ last_update_sent: new Date().toISOString() })
      .eq('id', id);

    return { data, error };
  } catch (error) {
    console.error('Error updating last update sent:', error);
    return { data: null, error };
  }
}
