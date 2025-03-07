import React, { useState } from 'react';
import { testDatabaseOperations } from '../utils/database/testDatabaseOps';
import { sendTestEmail } from '../utils/testEmail';

/**
 * DevTools component for development-only functionality
 * This should be hidden in production
 */
const DevTools: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [testResults, setTestResults] = useState<{success: boolean, message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');

  const runDatabaseTest = async () => {
    setTestResults(null);
    setIsLoading(true);
    
    try {
      const success = await testDatabaseOperations();
      setTestResults({
        success,
        message: success 
          ? 'Database operations test completed successfully!' 
          : 'Database operations test failed. Check console for details.'
      });
    } catch (error) {
      setTestResults({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 right-0 bg-gray-800 text-white p-2 rounded-tl-lg shadow-lg z-50"
      style={{ opacity: isExpanded ? 1 : 0.7 }}
    >
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          {isExpanded ? '🔽 DevTools' : '🔼 DevTools'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2 p-2">
          <h3 className="text-sm font-bold">Database Tests</h3>
          
          <div className="flex space-x-2">
            <button
              onClick={runDatabaseTest}
              disabled={isLoading}
              className="text-xs bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Running...' : 'Test Database Ops'}
            </button>
            
            <button
              onClick={async () => {
                setTestResults(null);
                setIsLoading(true);
                try {
                  const success = await sendTestEmail(testEmail);
                  setTestResults({
                    success,
                    message: success 
                      ? `Test email sent to ${testEmail}` 
                      : 'Failed to send test email. Check console for details.'
                  });
                } catch (error) {
                  setTestResults({
                    success: false,
                    message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="text-xs bg-green-700 hover:bg-green-600 px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Test Email'}
            </button>
          </div>
          
          <div className="mt-2">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Email for testing"
              className="text-xs w-full bg-gray-700 border border-gray-600 rounded p-1 text-white"
            />
          </div>
          
          {testResults && (
            <div className={`text-xs p-2 rounded ${testResults.success ? 'bg-green-900' : 'bg-red-900'}`}>
              {testResults.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevTools;