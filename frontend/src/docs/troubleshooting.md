# Troubleshooting Guide for Meow Memory Lane

This document provides solutions for common issues you might encounter when working with the Meow Memory Lane application.

## Image Loading Issues

If images aren't loading properly, check the following:

### Path Issues

Make sure image paths are correct. In React apps served from the public folder:

- **Correct path**: `/toys/yarn.png` (leading slash)
- **Incorrect path**: `./toys/yarn.png` (relative path)

All paths should be relative to the public directory and start with a forward slash.

### Missing Images

Ensure that all required images exist in the public directory:

```
public/
├── images/
│   ├── stamp.png
│   └── victorian-home.png
└── toys/
    ├── cat-tree.png
    ├── laser.png
    ├── mouse.png
    ├── treats.png
    └── yarn.png
```

## Email Sending Issues

If you encounter problems with sending emails:

### EmailJS Setup

1. Create a `.env.local` file with your EmailJS credentials:

```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_USER_ID=your_user_id
```

2. Make sure your EmailJS template includes the following variables:
   - `to_email`
   - `from_email`
   - `cat_name`
   - `monthly_story`
   - `postcard_url`
   - `unsubscribe_url`
   - `to_name`
   - `frequency`

3. Check if your EmailJS service is active and your account is in good standing.

### Testing Email Functionality

Use the DevTools component to test email functionality:

1. Look for the DevTools panel in the bottom-right corner of the app (only visible in development mode).
2. Click to expand it.
3. Enter a test email address.
4. Click "Test Email" to send a test message.
5. Check the console for detailed error messages if the test fails.

## Database Issues

If you're having trouble with the Supabase database:

### Connection Issues

1. Verify your Supabase credentials in the `.env.local` file:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

2. Check if your Supabase project is active and accessible.

3. Ensure the `user_preferences` table exists with the correct schema.

### Testing Database Operations

Use the DevTools component to test database operations:

1. Open the DevTools panel.
2. Click "Test Database Ops" to run a comprehensive test.
3. Check the console for detailed logs and error messages.

## Development Tools

### Using the DevTools Component

The DevTools component provides several testing utilities:

1. **Database Tests**: Run automated tests against the Supabase database.
2. **Email Tests**: Send test emails to verify EmailJS integration.

To access DevTools:

1. Ensure you're in development mode (`npm start`).
2. Look for the semi-transparent "DevTools" button in the bottom-right corner.
3. Click to expand the panel.

### Environment Configuration

For local development, create a `.env.local` file with the following variables:

```
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_USER_ID=your_user_id
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholders with your actual credentials.

## Common Error Messages

### "Failed to send email"

Possible causes:
- Invalid EmailJS credentials
- Template ID doesn't exist
- Service ID is incorrect
- EmailJS rate limit exceeded

Solution: Check your EmailJS credentials and ensure your account is active.

### "Failed to save user preferences"

Possible causes:
- Invalid Supabase credentials
- Table doesn't exist
- RLS policies blocking the operation
- Unique constraint violation

Solution: Verify your Supabase setup and check for duplicate entries.

### "Images not loading"

Possible causes:
- Incorrect image paths
- Missing image files
- CORS issues (if using external URLs)

Solution: Ensure all images exist and use the correct paths starting with a forward slash.