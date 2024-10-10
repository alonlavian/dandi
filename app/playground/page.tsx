"use client";

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Playground = () => {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isValid = await validateApiKey(apiKey);

      if (isValid) {
        toast.success('API key is valid!'); // Green notification
        router.push('/protected'); // Redirect to the protected page
      }
    } catch (error) {
      console.error('Validation error:', error); // Log the error for debugging
      toast.error('API key is not valid. Please check and try again.'); // Red notification
    }
  };

  const validateApiKey = async (key: string) => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', key)
      .single(); // Use single() to fetch a single record

    if (error) {
      console.error('Error validating API key:', error);
      if (error.code === 'PGRST116') {
        throw new Error('Unauthorized'); // Handle unauthorized access
      }
      throw new Error('An error occurred while validating the API key.'); // General error
    }

    return data !== null; // Return true if a record is found
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <ToastContainer /> {/* Ensure ToastContainer is present */}
      <h2 className="text-2xl font-bold mb-4">API Playground</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="mb-2">
          API Key:
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Validate API Key
        </button>
      </form>
    </div>
  );
};

export default Playground;