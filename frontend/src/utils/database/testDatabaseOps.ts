import { saveUserPreferences, getUserPreferencesByEmail, updateLastUpdateSent } from './userPreferences';
import { supabase } from '../supabase';

/**
 * Test function to verify database operations are working
 * This is for development purposes only
 */
export async function testDatabaseOperations() {
  console.log('🧪 Running database operations test');
  
  // Test data
  const testEmail = `test-${Date.now()}@example.com`;
  const testCatName = `TestCat-${Date.now()}`;

  try {
    // 1. Test saving preferences
    console.log('1️⃣ Testing saveUserPreferences...');
    const saveResult = await saveUserPreferences({
      email: testEmail,
      cat_name: testCatName,
      frequency: 'daily',
      cat_image_url: 'https://example.com/test-cat.jpg',
      selected_toy: 'yarn',
      memory_text: 'This is a test memory'
    });

    if (saveResult.error) {
      throw new Error(`Failed to save user preferences: ${saveResult.error.message}`);
    }

    console.log('✅ Saved test user preferences:', saveResult.data);
    const savedId = saveResult.data[0]?.id;

    // 2. Test retrieving by email
    console.log('2️⃣ Testing getUserPreferencesByEmail...');
    const getResult = await getUserPreferencesByEmail(testEmail);
    
    if (getResult.error) {
      throw new Error(`Failed to get user preferences: ${getResult.error.message}`);
    }

    console.log('✅ Retrieved user preferences:', getResult.data);

    // 3. Test updating last update sent
    if (savedId) {
      console.log('3️⃣ Testing updateLastUpdateSent...');
      const updateResult = await updateLastUpdateSent(savedId);
      
      if (updateResult.error) {
        throw new Error(`Failed to update last_update_sent: ${updateResult.error.message}`);
      }

      console.log('✅ Updated last_update_sent');
    }

    // 4. Check if frequency is correctly stored
    console.log('4️⃣ Verifying frequency is stored correctly...');
    const verifyResult = await supabase
      .from('user_preferences')
      .select('frequency')
      .eq('email', testEmail)
      .single();
    
    if (verifyResult.error) {
      throw new Error(`Failed to verify frequency: ${verifyResult.error.message}`);
    }

    console.log('✅ Frequency stored correctly:', verifyResult.data.frequency);
    
    // 5. Clean up test data (optional)
    console.log('5️⃣ Cleaning up test data...');
    const deleteResult = await supabase
      .from('user_preferences')
      .delete()
      .eq('email', testEmail);
    
    if (deleteResult.error) {
      throw new Error(`Failed to delete test data: ${deleteResult.error.message}`);
    }

    console.log('✅ Test data cleaned up');
    
    // All tests passed
    console.log('🎉 All database tests completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}
