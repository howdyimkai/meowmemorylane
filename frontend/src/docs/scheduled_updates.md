# Scheduled Updates System for Meow Memory Lane

This document outlines how to set up and run the scheduled update system for Meow Memory Lane, which sends periodic updates to users based on their selected frequency preference (daily, weekly, or monthly).

## Overview

The system uses Supabase as the database to store user preferences and track when updates were last sent. A scheduled function (which can be deployed as a Supabase Edge Function, AWS Lambda, or similar) runs regularly to:

1. Query for users who are due for an update
2. Generate a personalized message for each user
3. Send the email update via EmailJS
4. Update the `last_update_sent` timestamp for each user

## Database Structure

The `user_preferences` table stores all necessary information:

- `id`: Unique identifier for each record
- `email`: User's email address
- `cat_name`: Name of the user's cat
- `frequency`: Preferred update frequency ('daily', 'weekly', 'monthly')
- `last_update_sent`: Timestamp of when the last update was sent
- `cat_image_url`: URL to the cat's image in storage
- `selected_toy`: The toy ID the user selected
- `memory_text`: The memory the user shared about their cat
- `created_at`: When the record was created

## Setting Up the Scheduled Function

### Option 1: Supabase Edge Function

1. Create a new Supabase Edge Function:

```bash
supabase functions new send-scheduled-updates
```

2. Implement the function using the provided utilities:

```typescript
// supabase/functions/send-scheduled-updates/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getUsersDueForUpdates, updateLastUpdateSent } from '../../../src/utils/database/updateScheduler.ts'
import { generateMonthlyUpdate } from '../../../src/utils/messageGenerator.ts'

serve(async (req) => {
  try {
    // Initialize Supabase client with admin privileges
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    
    // Get users due for updates
    const { data: usersDue, error } = await getUsersDueForUpdates()
    
    if (error) {
      throw error
    }
    
    console.log(`Found ${usersDue?.length || 0} users due for updates`)
    
    // Process each user
    const results = await Promise.all((usersDue || []).map(async (user) => {
      try {
        // Generate personalized update
        const message = generateMonthlyUpdate({
          catName: user.cat_name,
          toyType: user.selected_toy,
          memory: user.memory_text
        })
        
        // Send email via EmailJS (implementation needed)
        // This would call your email service
        
        // Update last_update_sent timestamp
        await updateLastUpdateSent(user.id!)
        
        return { userId: user.id, status: 'success' }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error)
        return { userId: user.id, status: 'error', error }
      }
    }))
    
    return new Response(JSON.stringify({ 
      processed: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error in scheduled update function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
```

3. Schedule the function to run daily using Supabase cron:

```sql
-- In SQL editor, set up a cron job
select cron.schedule(
  'daily-update-check',
  '0 9 * * *', -- Run at 9 AM every day
  $$
  select net.http_post(
    'https://your-project-ref.supabase.co/functions/v1/send-scheduled-updates',
    '{}',
    '{}'
  )
  $$
);
```

### Option 2: AWS Lambda

1. Create a Lambda function using the same logic
2. Set up an EventBridge rule to trigger the function daily
3. Configure environment variables for Supabase and EmailJS credentials

## Monitoring and Debugging

1. Add logging to your function to track execution
2. Set up error alerting for failed update sends
3. Create a dashboard to monitor success rates and user engagement

## Future Enhancements

1. Implement an unsubscribe mechanism that updates the user's record
2. Add analytics tracking for opens and clicks
3. Personalize content further based on user engagement
4. Implement content rotation to avoid repetitive updates

## Testing the System

To test the system manually:

1. Insert test records with different frequencies
2. Manipulate the `last_update_sent` dates to trigger updates
3. Run the scheduled function manually
4. Verify emails are sent correctly and database is updated
