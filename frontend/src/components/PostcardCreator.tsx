import React, { useState, ReactElement } from 'react';
import * as emailjs from '@emailjs/browser';
import ImageUploader from './ImageUploader';
import ToySelector from './ToySelector';
import { generateFirstMessage } from '../utils/messageGenerator';
import { uploadImage } from '../utils/uploadImage';

interface SelectedToy {
  id: string;
  src: string;
  alt: string;
}

const PostcardCreator = (): ReactElement => {
  // Initialize EmailJS
  emailjs.init('z04zSHHFmbUO57sp8');
  
  // State declarations
  const [catName, setCatName] = useState('');
  const [memory, setMemory] = useState('');
  const [catImage, setCatImage] = useState<string | null>(null);
  const [selectedToy, setSelectedToy] = useState<SelectedToy | null>(null);
  const [step, setStep] = useState<'postcard' | 'email'>('postcard');
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
    if (!catName || !email || !selectedToy || !catImage) {
      alert('Please fill in all required fields and upload a photo');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const message = generateFirstMessage({
        catName,
        toyType: selectedToy.id,
        memory
      });

      const response = await emailjs.send(
        'service_eyhgzzc',
        'template_xwr06xh',
        {
          to_email: email,
          from_email: 'noreply@meowmemorylane.com',
          cat_name: catName,
          monthly_story: message,
          postcard_url: catImage,
          unsubscribe_url: '#',
          to_name: 'Friend'
        },
        'z04zSHHFmbUO57sp8'
      );

      console.log('EmailJS Response:', response);
      alert('Welcome to Meow Memory Lane! Check your email for your first update.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending email. Please try again.');
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
            backgroundImage: 'url(/images/victorian-home.png)',
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
        src="/images/stamp.png" 
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
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
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
          Set up mail for your kitty's furever home
        </h2>

        {step === 'postcard' ? renderPostcardStep() : renderEmailStep()}
      </div>
    </div>
  );
};

export default PostcardCreator;