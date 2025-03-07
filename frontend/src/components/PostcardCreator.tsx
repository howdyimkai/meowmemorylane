import React, { useState, ReactElement } from 'react';
import * as emailjs from '@emailjs/browser';
import ImageUploader from './ImageUploader';
import ToySelector from './ToySelector';
import { generateFirstMessage } from '../utils/messageGenerator';
import { uploadImage } from '../utils/uploadImage';
import { saveUserPreferences } from '../utils/database/userPreferences';
import { getAppImage } from '../utils/imageImports';

interface SelectedToy {
  id: string;
  src: string;
  alt: string;
}

const PostcardCreator = (): ReactElement => {
  // Initialize EmailJS with User ID from environment variables or fallback
  const EMAILJS_USER_ID = process.env.REACT_APP_EMAILJS_USER_ID || 'z04zSHHFmbUO57sp8';
  emailjs.init(EMAILJS_USER_ID);
  
  // State declarations
  const [catName, setCatName] = useState('');
  const [memory, setMemory] = useState('');
  const [catImage, setCatImage] = useState<string | null>(null);
  const [selectedToy, setSelectedToy] = useState<SelectedToy | null>(null);
  const [step, setStep] = useState<'postcard' | 'email' | 'success'>('postcard');
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNext = (): void => {
    console.log('Next button clicked');
    console.log('Current state:', {
      catName,
      catImage,
      step,
      isButtonDisabled: !catName || !catImage
    });
    setStep('email');
  };

  const handleImageUpload = async (file: File): Promise<void> => {
    setIsSubmitting(true);
    setUploadError(null);
    try {
      const imageUrl = await uploadImage(file);
      console.log('Uploaded image URL:', imageUrl);
      setCatImage(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Error uploading image. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    // Validate all required fields
    if (!catName || !email || !selectedToy || !catImage) {
      alert('Please fill in all required fields and upload a photo');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate frequency selection
    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      alert('Please select a valid frequency for your updates');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Submitting with frequency:', frequency);
    try {
      const message = generateFirstMessage({
        catName,
        toyType: selectedToy.id,
        memory
      });

      // Save user preferences to Supabase
      const { data: savedPreferences, error: saveError } = await saveUserPreferences({
        email,
        cat_name: catName,
        frequency: frequency as 'daily' | 'weekly' | 'monthly',
        cat_image_url: catImage,
        selected_toy: selectedToy.id,
        memory_text: memory
      });

      if (saveError) {
        console.error('Error saving preferences:', saveError);
        
        // Handle specific Supabase errors
        if (saveError.code === '23505') { // Unique constraint violation
          throw new Error(`You've already created a memorial for ${catName}. Please use a different cat name.`);
        } else {
          throw new Error('Failed to save your preferences. Please try again.');
        }
      }

      console.log('Saved preferences:', savedPreferences);

      try {
        // Send the first email update
        console.log('Attempting to send email with EmailJS...');
        const emailData = {
          to_email: email,
          from_email: 'noreply@meowmemorylane.com',
          cat_name: catName,
          monthly_story: message,
          postcard_url: catImage,
          unsubscribe_url: '#',
          to_name: 'Friend',
          frequency: frequency // Add frequency to email template
        };
        
        console.log('Email template data:', emailData);
        
        const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_eyhgzzc';
        const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_xwr06xh';
        
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailData,
          EMAILJS_USER_ID
        );

        console.log('EmailJS Response:', response);
        // Move to success screen instead of showing an alert
        setStep('success');
      } catch (emailError) {
        console.error('EmailJS Error:', emailError);
        
        // For this demo, we'll proceed to success even if email fails
        // In production, you'd want to handle this differently
        console.warn('Proceeding to success screen despite email error');
        setStep('success');
        
        // Uncomment this in production to show error to user
        // throw new Error(`Error sending email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPostcardStep = (): ReactElement => (
    <>
      <div className="relative rounded-lg shadow-lg overflow-visible">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${getAppImage('victorianHome')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.85
          }}
        />

        <div className="relative grid grid-cols-2 gap-8 p-12">
          <div className="bg-[#FAF9F7] bg-opacity-95 p-8 rounded-lg">
            <h3 className="text-xl mb-4" style={{ color: '#1B4332' }}>
              Your Cat's Name
            </h3>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              className="w-full p-2 mb-8 bg-transparent border-b border-gray-300 focus:outline-none"
              placeholder="Enter your cat's name"
            />

            <h3 className="text-xl mb-4" style={{ color: '#1B4332' }}>
              Share a fond memory of your kitty
            </h3>
            <textarea
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              className="w-full h-48 p-3 bg-white bg-opacity-50 border border-gray-200 rounded-lg focus:outline-none resize-none"
              placeholder="Write about a special moment with your kitty..."
            />
          </div>

          <div className="relative" style={{ marginBottom: '4rem' }}>
            <div className="flex items-start justify-center">
              <div 
                className="transform rotate-3 transition-transform hover:rotate-0 duration-300 bg-white rounded-lg shadow-xl" 
                style={{ 
                  width: '400px',
                  padding: '20px 20px 60px 20px'
                }}
              >
                <div className="relative w-full aspect-square bg-[#1B4332] rounded overflow-hidden">
                  {catImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={catImage}
                        alt="Your cat"
                        className="w-full h-full object-cover"
                      />
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <ImageUploader onImageUpload={handleImageUpload} />
                  )}
                </div>
                <div className="text-center mt-4 text-gray-400 text-sm">
                  Meow Memory Lane
                </div>
              </div>
            </div>
            {selectedToy && (
              <div 
                className="absolute"
                style={{
                  bottom: '-2.5rem',
                  right: '0.5rem',
                  width: '6rem',    // Increased from 5rem
                  height: '6rem',   // Increased from 5rem
                  transform: 'rotate(12deg)',
                  zIndex: 20
                }}
              >
                <img 
                  src={selectedToy.src} 
                  alt={selectedToy.alt}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 right-4" style={{ zIndex: 30 }}>
          <button
            onClick={handleNext}
            disabled={!catName || !catImage}
            className="bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-center text-gray-600 mb-4">
          Click your kitty's favorite toy to add it to the postcard
        </p>
        <ToySelector 
          onToySelect={setSelectedToy} 
          selectedToyId={selectedToy?.id ?? null}
        />
      </div>
    </>
  );

  const renderEmailStep = (): ReactElement => (
    <div className="relative rounded-lg shadow-lg overflow-hidden bg-white p-8">
      <img 
        src={getAppImage('stamp')} 
        alt="Postage Stamp" 
        className="absolute top-4 right-4 w-16 h-16 object-contain"
      />
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h3 className="text-2xl text-center mb-2" style={{ color: '#1B4332' }}>From: {catName}</h3>
          <p className="text-center text-gray-600">Your kitty will send you updates from their furever home</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Your Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="youremail@email.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">How often would you like to receive updates?</label>
            <div className="relative">
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                disabled={isSubmitting}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {isSubmitting && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-800"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep('postcard')}
              className="text-green-800 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-800 text-white px-8 py-2 rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Start Receiving Updates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = (): ReactElement => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-2xl font-medium mb-4" style={{ color: '#1B4332' }}>
        Thank You for Setting Up {catName}'s Memorial
      </h3>
      
      <p className="text-gray-600 mb-6">
        Your kitty's first letter is on its way to your inbox. You'll receive updates
        <strong> {frequency === 'daily' ? 'every day' : frequency === 'weekly' ? 'every week' : 'every month'}</strong> with
        new adventures from {catName}'s life on Meow Memory Lane.
      </p>
      
      <div className="p-4 bg-gray-50 rounded-lg mb-8">
        <p className="text-sm text-gray-500">
          <strong>Email:</strong> {email}<br />
          <strong>Frequency:</strong> {frequency === 'daily' ? 'Daily' : frequency === 'weekly' ? 'Weekly' : 'Monthly'}
        </p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
        >
          Create Another Memorial
        </button>

        <button
          onClick={() => window.open('https://www.meowmemorylane.com/#submit', '_blank')}
          className="bg-white border border-green-800 text-green-800 px-6 py-2 rounded-full hover:bg-green-50 transition-colors"
        >
          Create Account
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF2FF' }}>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-5xl text-center mb-2" style={{ 
          color: '#4A3628',
          fontFamily: 'Rockwell, Georgia, serif'
        }}>
          Meow Memory Lane
        </h1>
        <h2 className="text-lg text-center text-gray-600 mb-8">
          {step === 'success' ? 'Your kitty has arrived at their furever home' : 'Set up mail for your kitty\'s furever home'}
        </h2>

        {step === 'postcard' 
          ? renderPostcardStep() 
          : step === 'email' 
          ? renderEmailStep() 
          : renderSuccessStep()}
      </div>
    </div>
  );
};

export default PostcardCreator;