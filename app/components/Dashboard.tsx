"use client";

import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon, CheckIcon, ClipboardIcon } from '@heroicons/react/24/solid';

interface ApiKey {
  id: number;
  name: string;
  usage: number;
  key: string;
}

interface DashboardProps {
  apiKeys: ApiKey[];
  visibleKeyId: number | null;
  editingKeyId: number | null;
  editingKeyName: string;
  setVisibleKeyId: (id: number | null) => void;
  startEditing: (key: ApiKey) => void;
  saveEditing: () => Promise<void>;
  cancelEditing: () => void;
  copyToClipboard: (text: string) => void;
  confirmDelete: (id: number) => void;
  deleteApiKey: (id: number) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({
  apiKeys,
  visibleKeyId,
  editingKeyId,
  editingKeyName,
  setVisibleKeyId,
  startEditing,
  saveEditing,
  cancelEditing,
  copyToClipboard,
  confirmDelete,
  deleteApiKey,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold">API Keys</h2>
      <table className="w-full overflow-x-auto">
        <thead>
          <tr className="text-left text-gray-800">
            <th className="pb-2 font-semibold">NAME</th>
            <th className="pb-2 font-semibold">USAGE</th>
            <th className="pb-2 font-semibold">KEY</th>
            <th className="pb-2 font-semibold">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} className="border-t">
              <td className="py-2 text-gray-900">
                {editingKeyId === key.id ? (
                  <input
                    type="text"
                    value={editingKeyName}
                    onChange={(e) => editingKeyName = e.target.value}
                    className="border rounded px-2 py-1 text-gray-900"
                  />
                ) : (
                  <span>{key.name}</span>
                )}
              </td>
              <td className="py-2 text-gray-900">{key.usage}</td>
              <td className="py-2 text-gray-900">
                {visibleKeyId === key.id ? key.key : key.key.replace(/./g, '*')}
              </td>
              <td className="py-2 flex items-center">
                <button onClick={() => setVisibleKeyId(visibleKeyId === key.id ? null : key.id)}>
                  <EyeIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                </button>
                {editingKeyId === key.id ? (
                  <>
                    <button onClick={saveEditing} className="ml-2">
                      <CheckIcon className="h-5 w-5 text-green-600 hover:text-green-800" />
                    </button>
                    <button onClick={cancelEditing} className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <button onClick={() => startEditing(key)} className="ml-2">
                    <PencilIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                  </button>
                )}
                <button onClick={() => copyToClipboard(key.key)} className="ml-2">
                  <ClipboardIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                </button>
                <button onClick={() => confirmDelete(key.id)} className="ml-2">
                  <TrashIcon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;