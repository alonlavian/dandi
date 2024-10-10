"use client";

import React from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleCreateKey: () => Promise<void>;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  nameError: string | null;
  limitMonthlyUsage: boolean;
  setLimitMonthlyUsage: (limit: boolean) => void;
  monthlyLimit: number;
  setMonthlyLimit: (limit: number) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  closeModal,
  handleCreateKey,
  newKeyName,
  setNewKeyName,
  nameError,
  limitMonthlyUsage,
  setLimitMonthlyUsage,
  monthlyLimit,
  setMonthlyLimit,
}) => {
  if (!isOpen) return null;

  return (
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
            }}
            className={`w-full p-2 border rounded ${nameError ? 'border-red-500' : ''}`}
            placeholder="Key Name"
            maxLength={50}
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
  );
};

export default ApiKeyModal;