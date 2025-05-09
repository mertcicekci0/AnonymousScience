"use client";

import { useState } from 'react';

interface NoirVerificationProps {
  onVerificationComplete: (success: boolean) => void;
}

interface VerificationData {
  sender: string;
  recipient: string;
  message: string;
  timestamp: number;
  expected_sender_hash: string;
  expected_recipient_hash: string;
  expected_message_hash: string;
  expected_timestamp: number;
}

export default function NoirVerification({ onVerificationComplete }: NoirVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VerificationData>({
    sender: '',
    recipient: '',
    message: '',
    timestamp: Date.now(),
    expected_sender_hash: '',
    expected_recipient_hash: '',
    expected_message_hash: '',
    expected_timestamp: Date.now(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const verifyWithNoir = async () => {
    try {
      setIsVerifying(true);
      setError(null);

      // Convert string inputs to Uint8Array
      const requestData = {
        ...formData,
        sender: new TextEncoder().encode(formData.sender),
        recipient: new TextEncoder().encode(formData.recipient),
        message: new TextEncoder().encode(formData.message),
        expected_sender_hash: new TextEncoder().encode(formData.expected_sender_hash),
        expected_recipient_hash: new TextEncoder().encode(formData.expected_recipient_hash),
        expected_message_hash: new TextEncoder().encode(formData.expected_message_hash),
      };

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      onVerificationComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white/95 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#312e81]">Noir Verification</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
          <input
            type="text"
            name="sender"
            value={formData.sender}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter sender"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
          <input
            type="text"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter recipient"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <input
            type="text"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Sender Hash</label>
          <input
            type="text"
            name="expected_sender_hash"
            value={formData.expected_sender_hash}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter expected sender hash"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Recipient Hash</label>
          <input
            type="text"
            name="expected_recipient_hash"
            value={formData.expected_recipient_hash}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter expected recipient hash"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Message Hash</label>
          <input
            type="text"
            name="expected_message_hash"
            value={formData.expected_message_hash}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter expected message hash"
          />
        </div>
      </div>

      <button
        onClick={verifyWithNoir}
        disabled={isVerifying}
        className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#60a5fa] text-white rounded-md hover:from-[#60a5fa] hover:to-[#6366f1] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isVerifying ? 'Verifying...' : 'Verify with Noir'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
} 