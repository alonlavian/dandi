"use client";

import React, { useState, useEffect } from 'react';
import { EyeIcon, PencilIcon, TrashIcon, CheckIcon, XIcon } from '@heroicons/react/solid';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface ApiKey {
  id: number;
  name: string;
  usage: number;
  key: string;
}

export default function Overview() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [visibleKeyId, setVisibleKeyId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [limitMonthlyUsage, setLimitMonthlyUsage] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState(1000);
  const [editingKeyId, setEditingKeyId] = useState<number | null>(null);
  const [editingKeyName, setEditingKeyName] = useState('');
  const [deletingKeyId, setDeletingKeyId] = useState<number | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching API keys:', error);
      setError('Failed to fetch API keys. Please try again.');
    } else {
      setApiKeys(data || []);
    }
    setIsLoading(false);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewKeyName('');
    setNameError(null);
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      setNameError("Please enter a name for the API key.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const newKey: Omit<ApiKey, 'id'> = {
      name: newKeyName.trim(),
      usage: 0,
      key: 'tvly-' + Math.random().toString(36).substr(2, 32),
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select();

    if (error) {
      console.error('Error creating API key:', error);
      setError('Failed to create API key. Please try again.');
    } else {
      setApiKeys([...apiKeys, data[0]]);
      closeModal();
    }
    setIsLoading(false);
  };

  const startEditing = (key: ApiKey) => {
    setEditingKeyId(key.id);
    setEditingKeyName(key.name);
  };

  const cancelEditing = () => {
    setEditingKeyId(null);
    setEditingKeyName('');
  };

  const saveEditing = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('api_keys')
      .update({ name: editingKeyName })
      .eq('id', editingKeyId)
      .select();

    if (error) {
      console.error('Error updating API key:', error);
      setError('Failed to update API key. Please try again.');
    } else {
      setApiKeys(apiKeys.map(key => 
        key.id === editingKeyId ? data[0] : key
      ));
      setEditingKeyId(null);
      setEditingKeyName('');
    }
    setIsLoading(false);
  };

  const confirmDelete = (id: number) => {
    setDeletingKeyId(id);
  };

  const cancelDelete = () => {
    setDeletingKeyId(null);
  };

  const deleteApiKey = async (id: number) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting API key:', error);
      setError('Failed to delete API key. Please try again.');
    } else {
      setApiKeys(apiKeys.filter(key => key.id !== id));
      setDeletingKeyId(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          
          {/* Current Plan Card */}
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">CURRENT PLAN</span>
              <button className="bg-white text-purple-600 px-3 py-1 rounded text-sm">Manage Plan</button>
            </div>
            <h3 className="text-2xl font-bold mb-4">Researcher</h3>
            <div className="bg-white bg-opacity-20 rounded p-2">
              <span className="text-sm">API Limit</span>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-1">
                <div className="w-0 bg-white h-2 rounded-full"></div>
              </div>
              <span className="text-sm">0 / 1,000 Requests</span>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">API Keys</h3>
            <button onClick={openModal} className="text-purple-600 font-semibold">+</button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
          </p>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2">NAME</th>
                <th className="pb-2">USAGE</th>
                <th className="pb-2">KEY</th>
                <th className="pb-2">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-t">
                  <td className="py-2">
                    {editingKeyId === key.id ? (
                      <input
                        type="text"
                        value={editingKeyName}
                        onChange={(e) => setEditingKeyName(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      key.name
                    )}
                  </td>
                  <td className="py-2">{key.usage}</td>
                  <td className="py-2">
                    {visibleKeyId === key.id ? key.key : key.key.replace(/./g, '*')}
                  </td>
                  <td className="py-2 flex items-center">
                    <button onClick={() => setVisibleKeyId(visibleKeyId === key.id ? null : key.id)}>
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    </button>
                    {editingKeyId === key.id ? (
                      <>
                        <button onClick={saveEditing} className="ml-2">
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        </button>
                        <button onClick={cancelEditing} className="ml-2">
                          <XIcon className="h-5 w-5 text-red-500" />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => startEditing(key)} className="ml-2">
                        <PencilIcon className="h-5 w-5 text-gray-400" />
                      </button>
                    )}
                    <button onClick={() => confirmDelete(key.id)} className="ml-2">
                      <TrashIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contact Us Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Have any questions, feedback or need support? We'd love to hear from you!</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded">Contact us</button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Create a new API key</h2>
              <p className="mb-4">Enter a name and limit for the new API key.</p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name — A unique name to identify this key
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => {
                    setNewKeyName(e.target.value);
                    setNameError(null);
                  }}
                  className={`w-full p-2 border rounded ${nameError ? 'border-red-500' : ''}`}
                  placeholder="Key Name"
                />
                {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={limitMonthlyUsage}
                    onChange={(e) => setLimitMonthlyUsage(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Limit monthly usage*</span>
                </label>
                {limitMonthlyUsage && (
                  <input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(parseInt(e.target.value))}
                    className="w-full p-2 border rounded mt-2"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleCreateKey}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Create
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingKeyId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Delete API Key</h2>
              <p className="mb-4">Are you sure you want to delete this API key? This action cannot be undone.</p>
              <div className="flex justify-end">
                <button
                  onClick={() => deleteApiKey(deletingKeyId)}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}