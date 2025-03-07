# Meow Memory Lane - Digital Cat Memorial Postcards

A digital memorial service that allows grieving cat parents to create customized postcards featuring their departed cats, followed by AI-generated periodic updates that imagine their cat's adventures in their "furever home."

![Meow Memory Lane Screenshot](./public/images/preview.png)

> **Note:** This project saves user frequency preferences for updates. Users can choose to receive updates daily, weekly, or monthly.

## Features

- **Photo Upload**: Users can upload photos of their departed cats
- **Postcard Creation**: Users can customize postcards with toys and memories
- **Periodic Updates**: AI-generated stories sent via email on a schedule chosen by the user
  - **Customizable Frequency**: Users can select daily, weekly, or monthly updates
  - **Seasonal Content**: Updates are themed based on the time of year
- **Admin Dashboard**: Manage user preferences and check subscription status
- **Success Confirmation**: Users receive clear confirmation of their subscription
- **Data Validation**: Email format and required fields are validated

## Technical Implementation

- **Frontend**: React + TypeScript + Tailwind CSS
- **Storage**: Supabase for image storage and user preferences
- **Email**: EmailJS for sending updates
- **Data Storage**: Supabase database for user preferences and settings

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── admin/      # Admin dashboard components
│   │   ├── postcard/   # Postcard-related components
│   ├── utils/          # Utility functions
│   │   ├── database/   # Database operations
│   ├── migrations/     # SQL migrations for Supabase
│   ├── docs/           # Documentation
```

## User Preferences Storage

User preferences are stored in a Supabase table called `user_preferences` with the following fields:

- `id`: Unique identifier for each record
- `email`: User's email address
- `cat_name`: Name of the user's cat
- `frequency`: Preferred update frequency ('daily', 'weekly', 'monthly')
- `last_update_sent`: Timestamp of when the last update was sent
- `cat_image_url`: URL to the cat's image in storage
- `selected_toy`: The toy ID the user selected
- `memory_text`: The memory the user shared about their cat
- `created_at`: When the record was created

## Scheduled Updates

The system uses a scheduled function to send updates based on user preferences. 

Detailed documentation is available in the docs folder:
- [Scheduled Updates System](src/docs/scheduled_updates.md)
- [Email Frequency System](src/docs/email_frequency.md)

## Message Generation

The system generates varied messages for different types of updates:

- First welcome message
- Regular updates
- Seasonal/holiday-themed updates

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up Supabase:
   - Create a Supabase project
   - Run the migration SQL in `src/migrations/001_create_user_preferences_table.sql`
   - Create a storage bucket named `cat-photos`
   - Set up appropriate permissions

3. Configure environment variables:
   - Supabase URL and API key
   - EmailJS credentials

4. Start the development server:
   ```
   npm start
   ```

## Admin Dashboard

Access the admin dashboard at `/admin`. It allows:
- Viewing all subscribers
- Changing update frequency for users
- Viewing when the last update was sent

## Deployment

The app is deployed using GitHub Pages. To deploy a new version:

```
npm run deploy
```

## Future Enhancements

- Unsubscribe mechanism
- More toy varieties
- Additional postcard themes
- Analytics for email opens and engagement