import { supabase } from '../supabase';
import { UserPreference } from './userPreferences';

/**
 * Get users who are due for updates based on their frequency preference
 */
export async function getUsersDueForUpdates(): Promise<{ data: UserPreference[] | null; error: any }> {
  const now = new Date();
  
  try {
    // Query for daily updates (last update more than 1 day ago)
    const dailyThreshold = new Date(now);
    dailyThreshold.setDate(dailyThreshold.getDate() - 1);
    
    // Query for weekly updates (last update more than 7 days ago)
    const weeklyThreshold = new Date(now);
    weeklyThreshold.setDate(weeklyThreshold.getDate() - 7);
    
    // Query for monthly updates (last update more than 30 days ago)
    const monthlyThreshold = new Date(now);
    monthlyThreshold.setDate(monthlyThreshold.getDate() - 30);
    
    // Combined query to get all users due for updates
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .or(
        `and(frequency.eq.daily,last_update_sent.lt.${dailyThreshold.toISOString()}),` +
        `and(frequency.eq.weekly,last_update_sent.lt.${weeklyThreshold.toISOString()}),` +
        `and(frequency.eq.monthly,last_update_sent.lt.${monthlyThreshold.toISOString()})`
      );
      
    return { data, error };
  } catch (error) {
    console.error('Error getting users due for updates:', error);
    return { data: null, error };
  }
}
