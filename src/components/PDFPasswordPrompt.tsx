'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PDFPasswordPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
  pdfName: string;
}

export default function PDFPasswordPrompt({ 
  isOpen, 
  onClose, 
  onSuccess, 
  pdfName 
}: PDFPasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify password with the server
      const response = await fetch('/api/verify-pdf-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfName,
          password,
        }),
      });

      if (response.ok) {
        onSuccess(password);
        setPassword('');
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Incorrect password');
      }
    } catch (error) {
      setError('Failed to verify password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Protected Document</h2>
          <p className="text-gray-600">
            This document is password protected. Please enter the password to access it.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Verifying...' : 'Access Document'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}