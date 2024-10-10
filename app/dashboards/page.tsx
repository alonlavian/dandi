"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Dashboard from '../components/Dashboard';
import ApiKeyModal from '../components/ApiKeyModal';
import ContactImage from '../components/ContactImage';
import Sidebar from '../components/Sidebar'; // Import the Sidebar
import { EyeIcon, PencilIcon, TrashIcon, CheckIcon, ClipboardIcon, LockClosedIcon } from '@heroicons/react/24/solid'; // Import LockClosedIcon

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
  const [showContactImage, setShowContactImage] = useState(false);
  const router = useRouter();

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
      key: 'dandi-' + Math.random().toString(36).substr(2, 32),
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select();

    if (error) {
      console.error('Error creating API key:', error);
      setError('Failed to create API key. Please try again.');
      toast.error('Failed to create API key. Please try again.');
    } else {
      setApiKeys([...apiKeys, data[0]]);
      closeModal();
      toast.success('API key created successfully');
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
      toast.error('Failed to update API key. Please try again.');
    } else {
      setApiKeys(apiKeys.map(key => 
        key.id === editingKeyId ? data[0] : key
      ));
      setEditingKeyId(null);
      setEditingKeyName('');
      toast.success('API key updated successfully');
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
      toast.error('Failed to delete API key. Please try again.');
    } else {
      setApiKeys(apiKeys.filter(key => key.id !== id));
      setDeletingKeyId(null);
      toast.success('API key deleted successfully');
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy to clipboard');
    });
  };

  const handleContactUsClick = () => {
    setShowContactImage(true);
  };

  const closeContactImage = () => {
    setShowContactImage(false);
  };

  const handleDoorClick = () => {
    router.push('/secret-room');
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Add the Sidebar here */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <ToastContainer />
        <div className="max-w-7xl mx-auto p-8">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <Dashboard 
            apiKeys={apiKeys}
            visibleKeyId={visibleKeyId}
            editingKeyId={editingKeyId}
            editingKeyName={editingKeyName}
            setVisibleKeyId={setVisibleKeyId}
            startEditing={startEditing}
            saveEditing={saveEditing}
            cancelEditing={cancelEditing}
            copyToClipboard={copyToClipboard}
            confirmDelete={confirmDelete}
            deleteApiKey={deleteApiKey}
          />
          <ApiKeyModal 
            isOpen={isModalOpen}
            closeModal={closeModal}
            handleCreateKey={handleCreateKey}
            newKeyName={newKeyName}
            setNewKeyName={setNewKeyName}
            nameError={nameError}
            limitMonthlyUsage={limitMonthlyUsage}
            setLimitMonthlyUsage={setLimitMonthlyUsage}
            monthlyLimit={monthlyLimit}
            setMonthlyLimit={setMonthlyLimit}
          />
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Have any questions, feedback or need support? We'd love to hear from you!</p>
            <div className="flex justify-center space-x-4">
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={handleContactUsClick}
              >
                Contact us
              </button>
              <button 
                className="bg-brown-600 text-white p-2 rounded-lg border-2 border-gray-800 shadow-md transform hover:scale-105 transition-transform"
                onClick={handleDoorClick}
                aria-label="Secret door"
              >
                <LockClosedIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <ContactImage 
            showContactImage={showContactImage}
            closeContactImage={closeContactImage}
          />
        </div>
      </div>
    </div>
  );
}