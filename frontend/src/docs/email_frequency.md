# Email Frequency System Documentation

This document outlines how the email frequency preferences are collected, stored, and used in the Meow Memory Lane application.

## Overview

Users can select how often they want to receive updates from their memorialized cats: daily, weekly, or monthly. This preference is stored in the Supabase database and used by a scheduled function to determine when to send new updates.

## User Flow

1. User creates a memorial postcard for their cat
2. User selects their preferred email frequency (daily, weekly, or monthly)
3. User submits the form
4. The preference is saved to the Supabase database
5. The system sends the initial welcome email
6. Scheduled functions check the database at regular intervals to send follow-up emails according to the user's selected frequency

## Database Structure

The frequency preference is stored in the `user_preferences` table with these fields:

```sql
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
```

Key fields for the frequency feature:
- `frequency`: Stores the user's preferred update frequency ('daily', 'weekly', or 'monthly')
- `last_update_sent`: Timestamp of when the most recent update was sent

## Implementation Details

### Frontend Implementation

The frequency preference is collected in the `PostcardCreator` component:

```tsx
const [frequency, setFrequency] = useState('daily');

// User interface
<select
  value={frequency}
  onChange={(e) => setFrequency(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
</select>
```

### Saving to Database

When the form is submitted, the preference is saved to Supabase:

```tsx
const { data: savedPreferences, error: saveError } = await saveUserPreferences({
  email,
  cat_name: catName,
  frequency: frequency as 'daily' | 'weekly' | 'monthly',
  cat_image_url: catImage,
  selected_toy: selectedToy.id,
  memory_text: memory
});
```

### Database Operations

The database functions are defined in `userPreferences.ts`:

```typescript
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
          last_update_sent: new Date().toISOString() 
        }
      ])
      .select();

    return { data, error };
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return { data: null, error };
  }
}
```

## Scheduled Updates

Updates are sent based on the user's frequency preference and when they last received an update. The system uses these rules:

- Daily: Send an update if the last update was more than 24 hours ago
- Weekly: Send an update if the last update was more than 7 days ago
- Monthly: Send an update if the last update was more than 30 days ago

The query to find users due for updates:

```typescript
const { data, error } = await supabase
  .from('user_preferences')
  .select('*')
  .or(
    `and(frequency.eq.daily,last_update_sent.lt.${dailyThreshold.toISOString()}),` +
    `and(frequency.eq.weekly,last_update_sent.lt.${weeklyThreshold.toISOString()}),` +
    `and(frequency.eq.monthly,last_update_sent.lt.${monthlyThreshold.toISOString()})`
  );
```

## Admin Dashboard

The admin dashboard allows administrators to:

1. View all users and their selected frequencies
2. Modify a user's frequency if requested
3. See when the last update was sent to each user

## Testing

To test the frequency feature:

1. Use the DevTools to run database tests
2. Create test users with different frequency preferences
3. Manually trigger the scheduled function to verify updates are sent correctly

## Future Enhancements

Planned improvements for the frequency feature:

1. Allow users to change their frequency preference after signup
2. Implement a "pause updates" option
3. Add custom schedules (e.g., bi-weekly, weekends only)
4. Develop analytics to track which frequency options are most popular